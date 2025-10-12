// src/Basket/ShoppingBasket.jsx
import React, { useState } from "react";
import "../styles/basket.css";
import { UnitType } from "../utils/units.js";



export default function ShoppingBasket({
    basketItems,
    selectedItemId,
    onSelect,
    onAdd,
    onDelete,
    onStage,  // (id) => void
}) {
    const [newItem, setNewItem] = useState({
        itemType: "",
        amount: "",
        unit: UnitType.PIECE,
    });


    function handleAdd() {
        if (!newItem.itemType.trim() || !newItem.amount) return;
        onAdd?.({
            id: `buy-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            itemType: newItem.itemType.trim(),
            amount: Number(newItem.amount),
            unit: newItem.unit,
        });
        setNewItem({ itemType: "", amount: "", unit: UnitType.PIECE });
    }

    return (
        <div className="basket-panel">
            <div className="basket-header">🛒 Shopping Basket</div>

            {/* Add Item Section */}
            <div className="basket-add">
                <input
                    type="text"
                    placeholder="Item name"
                    value={newItem.itemType}
                    onChange={(e) =>
                        setNewItem((s) => ({ ...s, itemType: e.target.value }))
                    }
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={newItem.amount}
                    onChange={(e) =>
                        setNewItem((s) => ({ ...s, amount: e.target.value }))
                    }
                />
                <select
                    value={newItem.unit}
                    onChange={(e) =>
                        setNewItem((s) => ({ ...s, unit: e.target.value }))
                    }
                >
                    {Object.values(UnitType).map((u) => (
                        <option key={u} value={u}>
                            {u}
                        </option>
                    ))}
                </select>
                <button className="add-btn" onClick={handleAdd} title="Add item">
                    ➕
                </button>
            </div>

            {/* List of Items */}
            <div className="basket-list">
                {basketItems.map((item) => (
                    <div

                        key={item.id}
                        className={`basket-item-row ${selectedItemId === item.id ? "selected" : ""}`}
                    >
                        <button
                            className="basket-item"
                            onClick={() => onSelect?.(item)}
                            title={`${item.itemType} • ${item.amount} ${item.unit}`}
                        >
                            <div className="basket-item-name">{item.itemType}</div>
                            <div className="basket-item-sub">
                                {item.amount} {item.unit}
                            </div>
                        </button>

                        <button
                            className="stage-btn"
                            title="Move to register"
                            onClick={() => onStage?.(item.id)}
                        >
                            ➜
                        </button>

                        <button
                            className="delete-btn"
                            title="Delete item"
                            onClick={() => onDelete?.(item.id)}
                        >
                            🗑
                        </button>
                    </div>
                ))}
            </div>

        </div>
    );
}
