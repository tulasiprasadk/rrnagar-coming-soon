import React, { useState } from "react";
import Papa from "papaparse";
import { saveAs } from "file-saver";
import { post } from "../api/client";
import { parsePrice, applyMargin, formatPrice } from "../utils/price";
import RequireAdminAuth from "./RequireAdminAuth";

/**
 * Admin bulk upload page (CSV) - enhanced to support bulk quantities.
 * - Accepts headers: title, price, description, category, sku, stock (or quantity), copies
 *   - stock / quantity: sets the product stock level
 *   - copies: (optional) if >1, creates that many identical product records (use carefully)
 *
 * Save as: src/admin/AdminBulkUpload.jsx (overwrite existing)
 */
function BulkUploaderInner() {
  const [rows, setRows] = useState(null);
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  // Allow both "stock" and "quantity" column names; "copies" optionally creates duplicates
  const TEMPLATE_HEADERS = ["title", "price", "description", "category", "sku", "stock", "quantity", "copies"];

  function downloadTemplate() {
    const example = [
      {
        title: "Rice (5kg)",
        price: "400",
        description: "Basmati rice 5kg",
        category: "Grocery",
        sku: "RICE-5KG",
        stock: 20,
        copies: 1
      }
    ];
    const csv = Papa.unparse({ fields: TEMPLATE_HEADERS, data: example });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "rrnagar-admin-bulk-template.csv");
  }

  function handleFile(e) {
    setRows(null);
    setErrors([]);
    setMessage("");
    const f = e.target.files && e.target.files[0];
    if (!f) return;

    if (!f.name.toLowerCase().endsWith(".csv")) {
      setErrors([`Please upload a .csv file. Convert Excel -> CSV first.`]);
      e.target.value = "";
      return;
    }

    const MAX_BYTES = 5 * 1024 * 1024; // 5MB for admins
    if (f.size > MAX_BYTES) {
      setErrors([`File too large. Maximum allowed size is 5 MB.`]);
      e.target.value = "";
      return;
    }

    Papa.parse(f, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data.map((r, i) => {
            // support multiple possible header names
            const rawStock = (r.stock ?? r.quantity ?? "").toString().trim();
            const rawCopies = (r.copies ?? "").toString().trim();

            const item = {
              title: (r.title || r["product name"] || "").toString().trim(),
              price_raw: (r.price || "").toString().trim(),
              description: (r.description || "").toString().trim(),
              category: (r.category || "").toString().trim(),
              sku: (r.sku || "").toString().trim(),
              stock_raw: rawStock,
              copies_raw: rawCopies,
              __row: i + 2,
            };

            const supplierNum = parsePrice(item.price_raw || "");
            item.supplier_price = supplierNum;
            item.platform_price = applyMargin(supplierNum, 15);

            // parse stock / quantity as integer (if provided)
            item.stock = rawStock === "" ? undefined : Number(rawStock);
            if (item.stock != null && !Number.isInteger(item.stock)) {
              // allow numeric strings that are integer-like after Number()
              item.stock = Number.isFinite(Number(rawStock)) ? Math.trunc(Number(rawStock)) : NaN;
            }

            // parse copies if provided (used to create duplicates)
            item.copies = rawCopies === "" ? 1 : Number(rawCopies);

            return item;
          });

          // validation
          const errs = [];
          data.forEach((it) => {
            if (!it.title) errs.push(`Row ${it.__row}: title is required`);
            if (it.price_raw && Number.isNaN(it.supplier_price)) errs.push(`Row ${it.__row}: invalid price`);
            if (it.stock != null && Number.isNaN(it.stock)) errs.push(`Row ${it.__row}: invalid stock/quantity`);
            if (it.copies == null || Number.isNaN(it.copies) || !Number.isInteger(it.copies) || it.copies < 1) {
              errs.push(`Row ${it.__row}: copies must be an integer >= 1`);
            }
            // guard: disallow very large copies to avoid accidental large imports
            if (it.copies > 50) errs.push(`Row ${it.__row}: copies too large (max 50)`);
          });

          if (errs.length) {
            setErrors(errs);
            setRows(null);
          } else {
            setErrors([]);
            setRows(data);
          }
        } catch (err) {
          setErrors([`Failed to parse CSV: ${err.message || err}`]);
        }
      },
      error: (err) => {
        setErrors([`Failed to parse CSV: ${err.message || err}`]);
      },
    });

    e.target.value = "";
  }

  async function uploadAll() {
    if (!rows || rows.length === 0) return;
    setBusy(true);
    setMessage("");
    const results = [];

    for (const r of rows) {
      // for each row, create `copies` records or one record with stock set
      try {
        // if copies > 1 we create multiple identical records (admin choice)
        const toCreate = Math.max(1, Number(r.copies || 1));
        for (let i = 0; i < toCreate; i++) {
          const payload = {
            title: r.title,
            supplier_price: r.supplier_price,
            platform_price: r.platform_price,
            price: r.supplier_price,
            description: r.description,
            category: r.category,
            sku: r.sku,
            // if stock provided, set it; otherwise leave undefined
            stock: typeof r.stock === "number" && !Number.isNaN(r.stock) ? Number(r.stock) : undefined,
          };

          await post("/admin/products", payload, "admin");
        }
        results.push({ row: r.__row, ok: true });
      } catch (err) {
        results.push({ row: r.__row, ok: false, error: err.message || String(err) });
      }
    }

    const failed = results.filter((r) => !r.ok);
    if (failed.length === 0) {
      setMessage(`All ${rows.length} rows processed successfully.`);
      setRows([]);
    } else {
      setErrors(failed.map((f) => `Row ${f.row}: ${f.error || "failed"}`));
    }
    setBusy(false);
  }

  return (
    <main style={{ padding: 24, maxWidth: 980 }}>
      <h1>Admin: Bulk upload listings (CSV)</h1>
      <p>
        Admins only: download the CSV template, set per-row stock/quantity, and optionally "copies" to create duplicate items.
        The uploader computes platform price (+15%) for each row. Max copies per row: 50.
      </p>

      <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
        <button onClick={downloadTemplate} style={{ padding: "8px 12px", background: "#ffd600", border: "none", borderRadius: 6 }}>
          Download CSV template
        </button>

        <label style={{ display: "inline-block", padding: "8px 12px", background: "#222", borderRadius: 6, cursor: "pointer" }}>
          Choose CSV file
          <input type="file" accept=".csv" onChange={handleFile} style={{ display: "none" }} />
        </label>
      </div>

      {errors && errors.length > 0 && (
        <div style={{ background: "#2b0000", color: "#ffb4b4", padding: 12, borderRadius: 6, marginBottom: 12 }}>
          <strong>Errors:</strong>
          <ul>
            {errors.map((e, idx) => <li key={idx}>{e}</li>)}
          </ul>
        </div>
      )}

      {rows && rows.length > 0 && (
        <section>
          <h2>Preview ({rows.length})</h2>
          <div style={{ maxHeight: 420, overflow: "auto", border: "1px solid rgba(255,255,255,0.04)", borderRadius: 6 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ textAlign: "left", background: "#111" }}>
                  <th style={{ padding: 8 }}>Row</th>
                  <th style={{ padding: 8 }}>Title</th>
                  <th style={{ padding: 8 }}>Supplier</th>
                  <th style={{ padding: 8 }}>Platform</th>
                  <th style={{ padding: 8 }}>Stock</th>
                  <th style={{ padding: 8 }}>Copies</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255,255,255,0.02)" }}>
                    <td style={{ padding: 8 }}>{r.__row}</td>
                    <td style={{ padding: 8 }}>{r.title}</td>
                    <td style={{ padding: 8 }}>{formatPrice(r.supplier_price)}</td>
                    <td style={{ padding: 8 }}>{formatPrice(r.platform_price)}</td>
                    <td style={{ padding: 8 }}>{r.stock == null ? "—" : r.stock}</td>
                    <td style={{ padding: 8 }}>{r.copies ?? 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 12 }}>
            <button onClick={uploadAll} disabled={busy} style={{ padding: "8px 12px", background: "#ffd600", border: "none", borderRadius: 6 }}>
              {busy ? "Uploading..." : `Upload ${rows.length} rows`}
            </button>
          </div>
        </section>
      )}

      {message && <div style={{ color: "#88c28a", marginTop: 12 }}>{message}</div>}
    </main>
  );
}

export default function AdminBulkUpload() {
  return (
    <RequireAdminAuth>
      <BulkUploaderInner />
    </RequireAdminAuth>
  );
}