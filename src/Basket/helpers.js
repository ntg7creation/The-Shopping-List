// -----------------------------
// Basket handlers
// -----------------------------

// Add a single item to basket (auto-stack by itemType+unit)
export function handleAddToBasket(item, setBasketItems) {
  if (!item?.itemType || !item?.amount) return;

  setBasketItems((prev) => {
    const key = `${item.itemType}__${item.unit ?? ""}`;
    const next = [...prev];
    let found = false;

    for (let i = 0; i < next.length; i++) {
      const it = next[i];
      const itKey = `${it.itemType}__${it.unit ?? ""}`;
      if (itKey === key) {
        // Stack quantities
        next[i] = { ...it, amount: Number(it.amount || 0) + Number(item.amount || 0) };
        found = true;
        break;
      }
    }

    // If not found, add as new item
    if (!found) {
      next.push({
        id: `buy-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        ...item,
      });
    }

    return next;
  });
}


export function handleDeleteFromBasket(id, setBasketItems) {
  setBasketItems((prev) => prev.filter((i) => i.id !== id));
}
