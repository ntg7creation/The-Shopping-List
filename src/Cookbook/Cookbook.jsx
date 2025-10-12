// Cookbook.jsx
import React from "react";
import { scoreRecipePresence } from "../inventory/useInventory";
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
                                Have {haveCount} • Missing {missingCount}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
