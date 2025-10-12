// src/inventory/useInventory.js
import { useMemo, useState } from "react";
import { catalog, inventory as initialInventory } from "../demoData";

// Optional display helper (lets us read a category later if you add one)
function findCatalogByType(itemType) {
  return (catalog || []).find((c) => c.itemType === itemType) || null;
}

export function useInventory() {
  // Use the real export name from demoData.js
  const [entries, setEntries] = useState(initialInventory);
  const [selectedType, setSelectedType] = useState(null); // select by itemType

  // Build grouped view by itemType (what InventoryGrid expects)
  const groups = useMemo(() => {
    const byType = new Map(); // itemType -> { itemType, totalAmount, entries[], displayName, group }
    for (const entry of entries || []) {
      const t = entry?.itemType || "Unknown";
      if (!byType.has(t)) {
        const prod = findCatalogByType(t);
        byType.set(t, {
          itemType: t,
          totalAmount: 0,
          entries: [],
          displayName: t,
          group: prod?.group ?? null,
        });
      }
      const bucket = byType.get(t);
      bucket.totalAmount += Number(entry?.amount ?? 0);
      bucket.entries.push(entry);
    }
    const arr = Array.from(byType.values());
    arr.sort((a, b) => a.itemType.localeCompare(b.itemType));
    return arr;
  }, [entries]);

  // Selection for InfoBar (App passes { groupView: selectedGroup })
  const selectedGroup = useMemo(
    () => groups.find((g) => g.itemType === selectedType) || null,
    [groups, selectedType]
  );

  function selectType(itemType) {
    setSelectedType(itemType ?? null);
  }

  // Keep your Sort A→Z simple and robust—sort by itemType
  function sortByName() {
    setEntries((prev) => {
      const next = prev
        .slice()
        .sort((a, b) => (a.itemType || "").localeCompare(b.itemType || ""));
      return next;
    });
  }

  // Kept for possible future per-entry mode
  function swapEntries(aIdx, bIdx) {
    if (aIdx === bIdx) return;
    setEntries((prev) => {
      const next = prev.slice();
      [next[aIdx], next[bIdx]] = [next[bIdx], next[aIdx]];
      return next;
    });
  }

  function addEntry(entry) {
    // Accepts { id?, itemType, amount, unit, datePurchased?, expirationDays? }
    setEntries((prev) => {
      const id = entry.id ?? `inv-${Date.now()}-${prev.length + 1}`;
      return [...prev, { ...entry, id }];
    });
  }

  return {
    catalog,
    entries,
    groups,
    selectedGroup,
    selectType,
    sortByName,
    swapEntries,
    addEntry,
  };
}

// --- Build a totals map of { [itemType]: totalAmount } from any array of rows that have itemType ---
// Works with inventory rows (uses .amount if present) or plain items (counts as 1 each)
export function buildItemTypeTotals(rows) {
  const totals = Object.create(null);
  for (const r of rows || []) {
    const t = r?.itemType;
    if (!t) continue;
    const amt = Number(r?.amount ?? 1); // default to 1 if no amount field
    totals[t] = (totals[t] || 0) + (Number.isFinite(amt) ? amt : 0);
  }
  return totals;
}

// --- Backwards-compat presence map: { [itemType]: true } ---
// If you prefer booleans, you can still use this, but totals are more useful.
export function buildItemTypePresence(rows) {
  const present = Object.create(null);
  for (const r of rows || []) {
    const t = r?.itemType;
    if (t) present[t] = true;
  }
  return present;
}

// --- Return how much we have for a single itemType from a totals or presence map ---
export function getAmountForItemType(map, itemType) {
  if (!map) return 0;
  const v = map[itemType];
  if (typeof v === "number") return v; // totals map
  if (v === true) return 1; // presence map => treat as 1
  return 0;
}

// --- Score a recipe based on the provided map (totals OR presence) ---
// • If your recipe requires amounts (req.amount), we compare against totals.
// • If req.amount is missing, we treat it as 1.
// • If the map is presence-only (booleans), we treat presence as "have >= 1".
export function scoreRecipePresence(recipe, itemTypeMap) {
  const reqs = recipe?.requires || recipe?.ingredients || []; // accept either field name
  const total = reqs.length;
  if (!total) return { score: 0, haveCount: 0, missingCount: 0 };

  let have = 0;
  for (const r of reqs) {
    const type = r?.itemType;
    if (!type) continue;
    const need = Number(r?.amount ?? 1);
    const haveAmt = getAmountForItemType(itemTypeMap, type);
    if (haveAmt >= need) have += 1;
  }

  const ratio = have / total;
  return { score: ratio, haveCount: have, missingCount: total - have };
}
