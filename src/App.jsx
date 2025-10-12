// App.jsx
import { useEffect, useState } from "react";
import { handleAddToBasket, handleDeleteFromBasket } from "./Basket/helpers.js";
import Register from "./Basket/Register.jsx";
import ShoppingBasket from "./Basket/ShoppingBasket.jsx";
import InfoBar from "./components/InfoBar.jsx";
import Cookbook from "./Cookbook/Cookbook.jsx";
import { handleAddRecipeToBasket } from "./Cookbook/helpers.js";

import { recipes, shoppingBasket } from "./demoData.js";
import InventoryGrid from "./inventory/InventoryGrid.jsx";
import { buildItemTypeTotals, useInventory } from "./inventory/useInventory.js";
import "./styles/globals.css";
import "./styles/panels.css";

export default function App() {
  const {
    groups,
    selectedGroup,
    selectType,
    sortByName,
    entries,
    catalog,
    addEntry,
  } = useInventory();

  // -----------------------------
  // Selection state
  // -----------------------------
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [selectedBasketItem, setSelectedBasketItem] = useState(null);
  const [selectedRegisterItem, setSelectedRegisterItem] = useState(null);
  const [selectedSource, setSelectedSource] = useState("inventory");

  // -----------------------------
  // Basket (persistent)
  // -----------------------------
  const [basketItems, setBasketItems] = useState(() => {
    const saved = localStorage.getItem("shoppingBasket");
    return saved ? JSON.parse(saved) : [...shoppingBasket];
  });

  useEffect(() => {
    localStorage.setItem("shoppingBasket", JSON.stringify(basketItems));
  }, [basketItems]);

  // -----------------------------
  // Register (persistent)
  // -----------------------------
  const [registerItems, setRegisterItems] = useState(() => {
    const saved = localStorage.getItem("registerItems");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("registerItems", JSON.stringify(registerItems));
  }, [registerItems]);





  // -----------------------------
  // Derived data
  // -----------------------------
  const typeTotals = buildItemTypeTotals(entries);

  // -----------------------------
  // Selection handlers
  // -----------------------------
  function handleSelectInventory(type) {
    setSelectedRecipe(null);
    setSelectedBasketItem(null);
    setSelectedRegisterItem(null);
    setSelectedSource("inventory");
    selectType(type);
  }

  function handleSelectRecipe(recipe) {
    setSelectedBasketItem(null);
    setSelectedRegisterItem(null);
    setSelectedSource("recipe");
    setSelectedRecipe(recipe);
  }

  function handleSelectBasketItem(item) {
    setSelectedRecipe(null);
    selectType(null);
    setSelectedRegisterItem(null);
    setSelectedSource("basket");
    setSelectedBasketItem(item);
  }

  function handleSelectRegisterItem(item) {
    setSelectedRecipe(null);
    selectType(null);
    setSelectedBasketItem(null);
    setSelectedSource("register");
    setSelectedRegisterItem(item);
  }

  // -----------------------------
  // Basket handlers
  // -----------------------------
  // function handleAddToBasket(item, setBasketItems) {
  //   setBasketItems((prev) => [...prev, item]);
  // }

  // function handleDeleteFromBasket(id) {
  //   setBasketItems((prev) => prev.filter((i) => i.id !== id));
  // }

  // -----------------------------
  // Stage / Unstage (Basket ↔ Register)
  // -----------------------------
  // Move from Basket → Register
  function handleStageFromBasket(id) {
    const item = basketItems.find((i) => i.id === id);
    if (!item) return;

    // remove from basket
    const updatedBasket = basketItems.filter((i) => i.id !== id);
    // add to register
    const updatedRegister = [...registerItems, item];

    setBasketItems(updatedBasket);
    setRegisterItems(updatedRegister);
    setSelectedSource("register");
  }

  // Move from Register → Basket
  function handleUnstageToBasket(id) {
    const item = registerItems.find((i) => i.id === id);
    if (!item) return;

    const updatedRegister = registerItems.filter((i) => i.id !== id);
    const updatedBasket = [...basketItems, item];

    setRegisterItems(updatedRegister);
    setBasketItems(updatedBasket);
    setSelectedSource("basket");
  }


  // -----------------------------
  // BUY (commit staged items → inventory)
  // -----------------------------
  function todayStrLocal() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function handleBuyAll() {
    if (!registerItems.length) return;
    const today = todayStrLocal();

    for (const it of registerItems) {
      const cat = (catalog || []).find((c) => c.itemType === it.itemType);
      const expirationDays = cat?.defaultExpirationDays; // may be undefined → unknown

      addEntry({
        itemType: it.itemType,
        amount: it.amount,
        unit: it.unit,
        datePurchased: today,
        expirationDays, // unknown remains undefined
      });
    }

    // clear register
    setRegisterItems([]);
    setSelectedRegisterItem(null);
    setSelectedSource("inventory");
  }




  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="app">
      {/* Top info bar */}
      <InfoBar
        selectedItem={
          selectedSource === "basket"
            ? { ...selectedBasketItem, source: "basket" }
            : selectedSource === "register"
              ? { ...selectedRegisterItem, source: "register" }
              : selectedSource === "inventory"
                ? { ...selectedGroup, source: "inventory" }
                : null
        }
        selectedRecipe={selectedSource === "recipe" ? selectedRecipe : null}
        typePresentMap={typeTotals}
        onAction={(type, payload) => {
          if (type === "moveToRegister") handleStageFromBasket(payload.id, payload.amount);
          else if (type === "returnToBasket") handleUnstageToBasket(payload.id);
          else if (type === "addToBasket") handleAddToBasket(payload, setBasketItems);
          else if (type === "addRecipeToBasket") handleAddRecipeToBasket(payload, setBasketItems);

        }}
      />



      {/* 3-column content */}
      <div className="content">
        {/* INVENTORY */}
        <section className="panel inventory inventory-panel">
          <h2>Inventory</h2>
          <div className="controls">
            <button className="button" onClick={sortByName}>
              Sort A→Z
            </button>
          </div>
          <div className="inventory-wrap">
            <InventoryGrid groups={groups} onSelect={handleSelectInventory} />
          </div>
        </section>

        {/* COOKBOOK */}
        <section className="panel cookbook">
          <Cookbook
            recipes={recipes}
            typePresentMap={typeTotals}
            selectedRecipeId={selectedRecipe?.id ?? null}
            onSelect={handleSelectRecipe}
          />
        </section>

        {/* BASKET + REGISTER */}
        <section className="panel basket">
          <ShoppingBasket
            basketItems={basketItems}
            selectedItemId={selectedBasketItem?.id ?? null}
            onSelect={handleSelectBasketItem}
            onAdd={(item) => handleAddToBasket(item, setBasketItems)}
            onDelete={(item) => handleDeleteFromBasket(item, setBasketItems)}
            onStage={handleStageFromBasket}
          />

          <Register
            stagedItems={registerItems}
            selectedId={selectedRegisterItem?.id ?? null}
            onSelect={handleSelectRegisterItem}
            onUnstage={handleUnstageToBasket}
            onBuyAll={handleBuyAll}
          />
        </section>
      </div>
    </div>
  );
}
