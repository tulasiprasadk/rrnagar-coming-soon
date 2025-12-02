// Save as src/admin/Orders.jsx

import React from "react";

export default function Orders() {
  // static demo data
  const orders = [
    { id: 9001, user: "Suresh", total: "₹400", status: "Pending" },
    { id: 9002, user: "Meena", total: "₹250", status: "Delivered" },
  ];

  return (
    <section>
      <h1>Orders</h1>
      <table className="admin-table">
        <thead>
          <tr><th>Order</th><th>User</th><th>Total</th><th>Status</th></tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>{o.user}</td>
              <td>{o.total}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}