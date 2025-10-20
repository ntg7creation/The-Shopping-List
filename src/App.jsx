// App.jsx
import { useEffect, useState } from "react";
import { handleAddToBasket, handleDeleteFromBasket } from "./Basket/helpers.js";
import Register, { RegisterInfoBar } from "./Basket/Register.jsx";
import ShoppingBasket, { BasketInfoBar } from "./Basket/ShoppingBasket.jsx";
import InfoBar from "./components/InfoBar.jsx";
import Cookbook, { CookbookInfoBar } from "./Cookbook/Cookbook.jsx";
import { handleAddRecipeToBasket } from "./Cookbook/helpers.js";
import { recipes, shoppingBasket } from "./demoData.js";
import LoginButton from "./Google/LoginButton.jsx";
import InventoryGrid, { InventoryInfoBar } from "./inventory/InventoryGrid.jsx";
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
    removeIngredients,
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

  function handleCraftRecipe(recipe, count = 1) {
    if (!recipe || !Array.isArray(recipe.ingredients)) return;

    // Use the hook’s inventory mutator instead of manual subtraction
    removeIngredients(recipe.ingredients, count, { partial: true });

    console.log(`Crafted ${count}x ${recipe.title}`);
  }



  // -----------------------------
  // Stage / Unstage (Basket ↔ Register)
  // -----------------------------
  // Move from Basket → Register (optional new amount)
  function handleStageFromBasket(id, nextAmount) {
    const item = basketItems.find((i) => i.id === id);
    if (!item) return;

    const updatedBasket = basketItems.filter((i) => i.id !== id);
    const itemForRegister =
      nextAmount != null && Number.isFinite(nextAmount)
        ? { ...item, amount: nextAmount }
        : item;
    const updatedRegister = [...registerItems, itemForRegister];

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
      const expirationDays = cat?.defaultExpirationDays;

      addEntry({
        itemType: it.itemType,
        amount: it.amount,
        unit: it.unit,
        datePurchased: today,
        expirationDays,
      });
    }

    setRegisterItems([]);
    setSelectedRegisterItem(null);
    setSelectedSource("inventory");
  }

  // -----------------------------
  // Choose InfoBar plugin
  // -----------------------------
  const renderInfoBar = () => {
    if (selectedSource === "recipe" && selectedRecipe) {
      return (
        <CookbookInfoBar
          recipe={selectedRecipe}
          typePresentMap={typeTotals}
          onAddRecipeToBasket={(r) => handleAddRecipeToBasket(r, setBasketItems)}
          onCraftRecipe={handleCraftRecipe}
          onAddIngredientToBasket={(item) => handleAddToBasket(item, setBasketItems)}
        />
      );
    }


    if (selectedSource === "inventory" && selectedGroup) {
      const cat = (catalog || []).find((c) => c.itemType === selectedGroup.itemType);
      return (
        <InventoryInfoBar
          group={selectedGroup}
          unit={cat?.unit}
          onAddToBasket={(item) => handleAddToBasket(item, setBasketItems)}
        />
      );
    }

    if (selectedSource === "basket" && selectedBasketItem) {
      return (
        <BasketInfoBar
          item={selectedBasketItem}
          onMoveToRegister={(id, amt) => handleStageFromBasket(id, amt)}
        />
      );
    }

    if (selectedSource === "register" && selectedRegisterItem) {
      return (
        <RegisterInfoBar
          item={selectedRegisterItem}
          onReturnToBasket={(id) => handleUnstageToBasket(id)}
        />
      );
    }

    return null;
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="app">
      {/* Top info bar */}
      <InfoBar>{renderInfoBar()}</InfoBar>

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
