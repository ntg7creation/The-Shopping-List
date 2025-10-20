// Cookbook.jsx
import { useState } from "react";
import { computeCraftableCount, scoreRecipePresence } from "../inventory/useInventory";


import "../styles/cookbook.css";


function availabilityClass(score) {
    if (score >= 1) return "avail-green";
    if (score <= 0) return "avail-red";
    if (score >= 0.66) return "avail-yellow";
    return "avail-orange";
}


export default function Cookbook({ recipes, typePresentMap, selectedRecipeId, onSelect }) {
    return (
        <div className="cookbook">
            <div className="cookbook-header">📘 Cookbook</div>
            <div className="cookbook-grid">
                {recipes.map((r) => {
                    const { score, haveCount, missingCount } = scoreRecipePresence(r, typePresentMap);
                    const displayName = r.title ?? r.name;
                    const craftable = computeCraftableCount(r, typePresentMap);

                    return (
                        <button
                            key={r.id}
                            className={`recipe-card ${availabilityClass(score)} ${selectedRecipeId === r.id ? "selected" : ""
                                }`}
                            onClick={() => onSelect?.(r)}
                            title={`${displayName} • Have ${haveCount} • Missing ${missingCount}`}
                        >
                            <div className="recipe-name">{displayName}</div>
                            <div className="recipe-sub">
                                Have {haveCount} • Missing {missingCount} • Can make {craftable}x
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}



export function CookbookInfoBar({ recipe, typePresentMap, onAddRecipeToBasket, onCraftRecipe, onAddIngredientToBasket, }) {
    const [craftCount, setCraftCount] = useState(1);
    if (!recipe) return null;

    const { score, haveCount, missingCount } = scoreRecipePresence(recipe, typePresentMap);
    const ingredients = recipe.ingredients ?? [];
    const displayName = recipe.title ?? recipe.name;

    return (
        <>
            <div className="info-main">
                <div className="info-section">
                    <div className="info-title">🍽️ {displayName}</div>

                    <div className="ing-chips">
                        {ingredients.map((req) => {
                            const haveAmt = typePresentMap?.[req.itemType] ?? 0;
                            const needAmt = Number(req.amount ?? 1);
                            const ok = haveAmt >= needAmt;
                            return (
                                <span
                                    key={req.itemType}
                                    className={`chip ${ok ? "chip-have" : "chip-need"}`}
                                    title={`${req.itemType}: need ${needAmt}${req.unit ? ` ${req.unit}` : ""}`}
                                    onClick={() =>
                                        onAddIngredientToBasket?.({
                                            id: `buy-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                                            itemType: req.itemType,
                                            amount: needAmt,
                                            unit: req.unit,
                                        })
                                    }
                                    style={{ cursor: "pointer" }}
                                >
                                    <strong className="chip-name">{req.itemType}</strong>
                                    <span className="chip-meta">
                                        need {needAmt}{req.unit ? ` ${req.unit}` : ""} • {ok ? "have" : "missing"}
                                    </span>
                                </span>
                            );
                        })}
                    </div>

                    <div className="ing-summary">
                        <span className={`pill ${score >= 1 ? "pill-green" : score <= 0 ? "pill-red" : "pill-amber"}`}>
                            Ready {(score * 100).toFixed(0)}%
                        </span>
                        <span className="pill pill-outline">Have {haveCount}</span>
                        <span className="pill pill-outline">Missing {missingCount}</span>
                        <span className="pill pill-outline">Can make {computeCraftableCount(recipe, typePresentMap)}x</span>

                    </div>
                </div>
            </div>

            <div className="info-action">
                {/* Add Ingredients */}
                <button
                    className="action-btn"
                    onClick={() => onAddRecipeToBasket?.(recipe)}
                >
                    🧾 Add Ingredients to Basket
                </button>

                {/* Craft Item */}
                <div className="craft-row" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <button
                        className="action-btn"
                        onClick={() => onCraftRecipe?.(recipe, craftCount)}
                    >
                        🧪 Craft
                    </button>
                    <input
                        type="number"
                        min="1"
                        value={craftCount}
                        onChange={(e) => setCraftCount(Number(e.target.value))}
                        style={{ width: "3rem", textAlign: "center" }}
                    />
                </div>
            </div>
        </>
    );
}