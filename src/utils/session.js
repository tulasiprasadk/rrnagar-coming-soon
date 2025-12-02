export function getBuyerId() {
  let id = localStorage.getItem("buyerId");
  if (!id) {
    id = "buyer-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8);
    localStorage.setItem("buyerId", id);
  }
  return id;
}
