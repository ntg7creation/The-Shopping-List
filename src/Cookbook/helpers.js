// -----------------------------
// Add all ingredients from a recipe to the basket
// -----------------------------
export function handleAddRecipeToBasket(recipe, setBasketItems) {
  if (!recipe?.ingredients?.length) return;

  setBasketItems((prev) => {
    // Aggregate recipe ingredients by itemType+unit
    const inc = new Map();
    for (const ing of recipe.ingredients) {
      const key = `${ing.itemType}__${ing.unit ?? ""}`;
      const add = Number(ing.amount ?? 0);
      inc.set(key, (inc.get(key) || 0) + add);
    }

    // Merge with existing basket
    const next = prev.map((it) => ({ ...it })); // shallow copy rows
    for (let i = 0; i < next.length; i++) {
      const it = next[i];
      const key = `${it.itemType}__${it.unit ?? ""}`;
      if (inc.has(key)) {
        next[i] = { ...it, amount: Number(it.amount || 0) + inc.get(key) };
        inc.delete(key);
      }
    }
    // Add remaining new items
    for (const [key, addAmt] of inc) {
      const [itemType, unit] = key.split("__");
      next.push({
        id: `buy-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        itemType,
        unit: unit || undefined,
        amount: addAmt,
      });
    }

    return next;
  });
}
