// -----------------------------
// Basket handlers
// -----------------------------
export function handleAddToBasket(item, setBasketItems) {
  setBasketItems((prev) => [...prev, item]);
}

export function handleDeleteFromBasket(id, setBasketItems) {
  setBasketItems((prev) => prev.filter((i) => i.id !== id));
}
