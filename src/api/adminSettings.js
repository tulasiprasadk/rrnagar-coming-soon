import { get, post, put } from "./client";

/**
 * getSettings()
 * - Attempts to GET /settings/1. If not found, returns defaults.
 */
export async function getSettings() {
  try {
    // try the single-settings resource
    const res = await get("/settings/1");
    if (res) return res;
  } catch (e) {
    // fallthrough to try list
  }

  try {
    const list = await get("/settings");
    if (Array.isArray(list) && list.length > 0) return list[0];
  } catch (e) {
    // ignore
  }

  // defaults
  return {
    id: 1,
    upiVpa: "",
    upiName: "",
    upiPhone: "",
    upiQrUrl: "",
    piRateINRPerPi: 0.1,
    piReceiverAddress: "",
  };
}

/**
 * updateSettings(settings)
 * - If /settings/1 exists does PUT, otherwise POST creates it (json-server).
 */
export async function updateSettings(settings) {
  try {
    // attempt to PUT to /settings/1
    const res = await put(`/settings/1`, settings);
    return res;
  } catch (e) {
    // fallback to POST /settings
    const res = await post("/settings", settings);
    return res;
  }
}
