// src/utils/units.js
// Define a simple "enum"-like object for metric measurement units

export const UnitType = Object.freeze({
  GRAM: "g", // grams
  KILOGRAM: "kg", // kilograms
  MILLILITER: "ml", // milliliters
  LITER: "L", // liters
  PIECE: "pcs", // pieces (eggs, apples, onions, etc.)
  CLOVE: "cloves", // garlic
  LOAF: "loaf", // bread
  UNIT: "unit", // generic count
});

// Optional: conversion helpers (basic metric only)
export const UnitConversions = {
  [UnitType.KILOGRAM]: { to: UnitType.GRAM, factor: 1000 },
  [UnitType.LITER]: { to: UnitType.MILLILITER, factor: 1000 },
};

// Helper to convert values between compatible units
export function convert(value, from, to) {
  if (from === to) return value;
  const conv = UnitConversions[from];
  if (conv && conv.to === to) return value * conv.factor;
  // inverse conversion
  const inv = Object.entries(UnitConversions).find(
    ([, v]) =>
      v.to === from &&
      to ===
        Object.keys(UnitConversions).find((k) => UnitConversions[k].to === from)
  );
  if (inv && inv[1]) return value / inv[1].factor;
  console.warn(`No direct conversion from ${from} → ${to}`);
  return value;
}

export const UnitGroup = Object.freeze({
  MASS: "mass",
  VOLUME: "volume",
  COUNT: "count",
});

export const UnitToGroup = {
  [UnitType.GRAM]: UnitGroup.MASS,
  [UnitType.KILOGRAM]: UnitGroup.MASS,
  [UnitType.MILLILITER]: UnitGroup.VOLUME,
  [UnitType.LITER]: UnitGroup.VOLUME,
  [UnitType.PIECE]: UnitGroup.COUNT,
  [UnitType.CLOVE]: UnitGroup.COUNT,
  [UnitType.LOAF]: UnitGroup.COUNT,
};
