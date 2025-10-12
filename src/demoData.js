// src/inventory/demoData.js
import { UnitType } from "./utils/units.js";

// Expanded demo catalog
export const catalog = [
  {
    id: "cat-eggs",
    itemType: "Eggs",
    unit: UnitType.PIECE,
    defaultExpirationDays: 14,
  },
  {
    id: "cat-milk-3",
    itemType: "Milk 3%",
    unit: UnitType.LITER,
    defaultExpirationDays: 7,
  },
  {
    id: "cat-flour",
    itemType: "Flour",
    unit: UnitType.KILOGRAM,
    defaultExpirationDays: 365,
  },
  {
    id: "cat-sugar",
    itemType: "Sugar",
    unit: UnitType.KILOGRAM,
    defaultExpirationDays: 365,
  },
  {
    id: "cat-butter",
    itemType: "Butter",
    unit: UnitType.GRAM,
    defaultExpirationDays: 90,
  },
  {
    id: "cat-salt",
    itemType: "Salt",
    unit: UnitType.GRAM,
    defaultExpirationDays: 3650,
  },
  {
    id: "cat-pepper",
    itemType: "Black Pepper",
    unit: UnitType.GRAM,
    defaultExpirationDays: 3650,
  },
  {
    id: "cat-oil",
    itemType: "Olive Oil",
    unit: UnitType.MILLILITER,
    defaultExpirationDays: 365,
  },
  {
    id: "cat-onion",
    itemType: "Onion",
    unit: UnitType.PIECE,
    defaultExpirationDays: 30,
  },
  {
    id: "cat-garlic",
    itemType: "Garlic",
    unit: UnitType.CLOVE,
    defaultExpirationDays: 60,
  },
  {
    id: "cat-tomato",
    itemType: "Tomato",
    unit: UnitType.PIECE,
    defaultExpirationDays: 7,
  },
  {
    id: "cat-pasta",
    itemType: "Pasta",
    unit: UnitType.GRAM,
    defaultExpirationDays: 365,
  },
  {
    id: "cat-chicken",
    itemType: "Chicken Breast",
    unit: UnitType.GRAM,
    defaultExpirationDays: 2,
  },
  {
    id: "cat-cheese",
    itemType: "Cheddar Cheese",
    unit: UnitType.GRAM,
    defaultExpirationDays: 14,
  },
  {
    id: "cat-yeast",
    itemType: "Baking Powder",
    unit: UnitType.GRAM,
    defaultExpirationDays: 365,
  },
  {
    id: "cat-cocoa",
    itemType: "Cocoa Powder",
    unit: UnitType.GRAM,
    defaultExpirationDays: 365,
  },
  {
    id: "cat-banana",
    itemType: "Banana",
    unit: UnitType.PIECE,
    defaultExpirationDays: 5,
  },
  {
    id: "cat-bread",
    itemType: "Bread",
    unit: UnitType.LOAF,
    defaultExpirationDays: 3,
  },
  {
    id: "cat-apple",
    itemType: "Apple",
    unit: UnitType.PIECE,
    defaultExpirationDays: 14,
  },
  {
    id: "cat-carrot",
    itemType: "Carrot",
    unit: UnitType.PIECE,
    defaultExpirationDays: 21,
  },
];

// Expanded demo inventory
export const inventory = [
  {
    id: "inv-1",
    itemType: "Eggs",
    amount: 8,
    unit: UnitType.PIECE,
    datePurchased: "2025-09-01",
    expirationDays: 14,
  },
  {
    id: "inv-2",
    itemType: "Milk 3%",
    amount: 1,
    unit: UnitType.LITER,
    datePurchased: "2025-09-05",
    expirationDays: 7,
  },
  {
    id: "inv-3",
    itemType: "Flour",
    amount: 1.5,
    unit: UnitType.KILOGRAM,
    datePurchased: "2025-08-20",
    expirationDays: 365,
  },
  {
    id: "inv-4",
    itemType: "Sugar",
    amount: 0.4,
    unit: UnitType.KILOGRAM,
    datePurchased: "2025-07-18",
    expirationDays: 365,
  },
  {
    id: "inv-5",
    itemType: "Butter",
    amount: 120,
    unit: UnitType.GRAM,
    datePurchased: "2025-09-03",
    expirationDays: 90,
  },
  {
    id: "inv-6",
    itemType: "Onion",
    amount: 3,
    unit: UnitType.PIECE,
    datePurchased: "2025-09-04",
    expirationDays: 30,
  },
  {
    id: "inv-7",
    itemType: "Garlic",
    amount: 5,
    unit: UnitType.CLOVE,
    datePurchased: "2025-09-02",
    expirationDays: 60,
  },
  {
    id: "inv-8",
    itemType: "Olive Oil",
    amount: 300,
    unit: UnitType.MILLILITER,
    datePurchased: "2025-08-28",
    expirationDays: 365,
  },
  {
    id: "inv-9",
    itemType: "Pasta",
    amount: 500,
    unit: UnitType.GRAM,
    datePurchased: "2025-09-01",
    expirationDays: 365,
  },
  {
    id: "inv-10",
    itemType: "Tomato",
    amount: 2,
    unit: UnitType.PIECE,
    datePurchased: "2025-09-05",
    expirationDays: 7,
  },
  {
    id: "inv-11",
    itemType: "Apple",
    amount: 4,
    unit: UnitType.PIECE,
    datePurchased: "2025-09-03",
    expirationDays: 14,
  },
  {
    id: "inv-12",
    itemType: "Bread",
    amount: 1,
    unit: UnitType.LOAF,
    datePurchased: "2025-09-06",
    expirationDays: 3,
  },
];

// Expanded demo recipes
export const recipes = [
  {
    id: "rcp-omelet",
    title: "Simple Omelet",
    steps: [
      "Crack eggs into a bowl, whisk with salt and pepper.",
      "Melt butter in a pan, pour eggs, fold once set.",
    ],
    ingredients: [
      { itemType: "Eggs", amount: 2, unit: UnitType.PIECE },
      { itemType: "Butter", amount: 10, unit: UnitType.GRAM },
      { itemType: "Salt", amount: 2, unit: UnitType.GRAM },
      { itemType: "Black Pepper", amount: 1, unit: UnitType.GRAM },
    ],
  },
  {
    id: "rcp-pasta-pomodoro",
    title: "Pasta al Pomodoro",
    steps: [
      "Boil pasta to al dente.",
      "Sauté garlic and onion in olive oil; add chopped tomato; simmer.",
      "Toss pasta with sauce; season to taste.",
    ],
    ingredients: [
      { itemType: "Pasta", amount: 200, unit: UnitType.GRAM },
      { itemType: "Olive Oil", amount: 15, unit: UnitType.MILLILITER },
      { itemType: "Garlic", amount: 2, unit: UnitType.CLOVE },
      { itemType: "Onion", amount: 1, unit: UnitType.PIECE },
      { itemType: "Tomato", amount: 2, unit: UnitType.PIECE },
      { itemType: "Salt", amount: 3, unit: UnitType.GRAM },
      { itemType: "Black Pepper", amount: 1, unit: UnitType.GRAM },
    ],
  },
  {
    id: "rcp-banana-bread",
    title: "Banana Bread",
    steps: [
      "Mash ripe bananas and mix with flour, sugar, and butter.",
      "Bake until golden brown.",
    ],
    ingredients: [
      { itemType: "Banana", amount: 3, unit: UnitType.PIECE },
      { itemType: "Flour", amount: 250, unit: UnitType.GRAM },
      { itemType: "Sugar", amount: 100, unit: UnitType.GRAM },
      { itemType: "Butter", amount: 50, unit: UnitType.GRAM },
    ],
  },
  {
    id: "rcp-grilled-cheese",
    title: "Grilled Cheese Sandwich",
    steps: [
      "Butter two slices of bread.",
      "Place cheese between them and grill until melted.",
    ],
    ingredients: [
      { itemType: "Bread", amount: 2, unit: UnitType.LOAF },
      { itemType: "Cheddar Cheese", amount: 50, unit: UnitType.GRAM },
      { itemType: "Butter", amount: 10, unit: UnitType.GRAM },
    ],
  },
  {
    id: "rcp-apple-salad",
    title: "Apple Salad",
    steps: ["Chop apples and carrots.", "Mix with salt and pepper to taste."],
    ingredients: [
      { itemType: "Apple", amount: 2, unit: UnitType.PIECE },
      { itemType: "Carrot", amount: 1, unit: UnitType.PIECE },
      { itemType: "Salt", amount: 1, unit: UnitType.GRAM },
      { itemType: "Black Pepper", amount: 1, unit: UnitType.GRAM },
    ],
  },
];

// Demo shopping basket
export const shoppingBasket = [
  { id: "buy-1", itemType: "Milk 3%", amount: 2, unit: UnitType.LITER },
  { id: "buy-2", itemType: "Cheddar Cheese", amount: 200, unit: UnitType.GRAM },
  { id: "buy-3", itemType: "Banana", amount: 6, unit: UnitType.PIECE },
  { id: "buy-4", itemType: "Tomato", amount: 5, unit: UnitType.PIECE },
  { id: "buy-5", itemType: "Butter", amount: 250, unit: UnitType.GRAM },
];
