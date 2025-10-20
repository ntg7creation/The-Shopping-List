// InfoBar.jsx
import { useState } from "react";
import { scoreRecipePresence } from "../inventory/useInventory";
import "../styles/infobar.css";

export default function InfoBar({
    selectedItem,
    selectedRecipe,
    typePresentMap,
    onAction, // callback for actions
}) {
    const [customAmount, setCustomAmount] = useState("");

    const hasRecipe = !!selectedRecipe;
    const hasItem = !!selectedItem;
    const active = hasRecipe ? selectedRecipe : selectedItem;

    if (!active)
        return (
            <div className="info-bar two-rows">
                <div className="info-row">
                    <span className="pill pill-outline">Select a recipe or an item</span>
                </div>
            </div>
        );

    // --- Contextual button logic ---
    let actionLabel = null;
    let actionHandler = null;
    let showAmountInput = false;

    const amountValue =
        customAmount.trim() === "" ? selectedItem?.amount ?? null : Number(customAmount);

    if (selectedRecipe) {
        actionLabel = "🧾 Add Ingredients to Basket";
        actionHandler = () => onAction?.("addRecipeToBasket", selectedRecipe);
    } else if (selectedItem?.source === "basket") {
        actionLabel = "➜ Add to Register";
        showAmountInput = true;
        actionHandler = () => {
            const newItem = {
                ...selectedItem,
                amount: amountValue,
            };
            onAction?.("moveToRegister", newItem);
        };
    } else if (selectedItem?.source === "register") {
        actionLabel = "⟲ Return to Basket";
        actionHandler = () => onAction?.("returnToBasket", selectedItem);
    } else if (selectedItem?.source === "inventory") {
        actionLabel = "🛒 Add to Basket";
        showAmountInput = true;
        actionHandler = () => {
            const newItem = {
                ...selectedItem,
                amount: amountValue,
            };
            onAction?.("addToBasket", newItem);
        };
    }

    return (
        <div className="info-bar two-rows">
            <div className="info-main">
                {hasRecipe ? (
                    <RecipeInfo recipe={selectedRecipe} typePresentMap={typePresentMap} />
                ) : (
                    <ItemInfo item={selectedItem} />
                )}
            </div>

            {actionLabel && (
                <div className="info-action">
                    {showAmountInput && (
                        <input
                            type="number"
                            className="action-input"
                            placeholder={String(selectedItem?.amount ?? 1)}
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                        />
                    )}
                    <button type="button" className="action-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            actionHandler();
                        }}

                    >
                        {actionLabel}
                    </button>
                </div>
            )}
        </div>
    );
}

function RecipeInfo({ recipe, typePresentMap }) {
    const { score, haveCount, missingCount } = scoreRecipePresence(
        recipe,
        typePresentMap
    );
    const ingredients = recipe.ingredients ?? [];
    const displayName = recipe.title ?? recipe.name;

    return (
        <div className="info-section">
            <div className="info-title">🍽️ {displayName}</div>
            <div className="info-subtitle">Ingredients</div>
            <div className="ing-chips">
                {ingredients.map((req) => {
                    const haveAmt = typePresentMap?.[req.itemType] ?? 0;
                    const needAmt = Number(req.amount ?? 1);
                    const ok = haveAmt >= needAmt;
                    return (
                        <span
                            key={req.itemType}
                            className={`chip ${ok ? "chip-have" : "chip-need"}`}
                            title={`${req.itemType}: need ${needAmt}${req.unit ? ` ${req.unit}` : ""
                                }`}
                        >
                            <strong className="chip-name">{req.itemType}</strong>
                            <span className="chip-meta">
                                need {needAmt}
                                {req.unit ? ` ${req.unit}` : ""} • {ok ? "have" : "missing"}
                            </span>
                        </span>
                    );
                })}
            </div>
            <div className="ing-summary">
                <span
                    className={`pill ${score >= 1 ? "pill-green" : score <= 0 ? "pill-red" : "pill-amber"
                        }`}
                >
                    Ready {(score * 100).toFixed(0)}%
                </span>
                <span className="pill pill-outline">Have {haveCount}</span>
                <span className="pill pill-outline">Missing {missingCount}</span>
            </div>
        </div>
    );
}

function ItemInfo({ item }) {
    const displayName = item.displayName ?? item.itemType;
    return (
        <div className="info-section">
            <div className="info-title">ℹ️ {displayName}</div>
            <div className="item-chips">
                <span className="pill pill-outline">Type {item.itemType}</span>
                {item.group && <span className="pill pill-outline">Group {item.group}</span>}
                <span className="pill pill-outline">
                    Amount {item.totalAmount ?? item.amount ?? "—"}
                    {item.unit ? ` ${item.unit}` : ""}
                </span>
            </div>
        </div>
    );
}
