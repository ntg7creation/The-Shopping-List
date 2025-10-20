// src/Basket/Register.jsx
import React from "react";
import "../styles/basket.css";

function todayStrLocal() {
    // YYYY-MM-DD in local time
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

export default function Register({
    stagedItems,
    selectedId,
    onSelect,
    onUnstage,     // (id) => void
    onBuyAll,      // () => void
    registerItems,
    setRegisterItems,
    setBasketItems,
    addEntry,
    catalog,
}) {
    const today = todayStrLocal();

    function handleUnstage(id) {
        const item = registerItems.find(i => i.id === id);
        if (!item) return;
        setRegisterItems(r => r.filter(i => i.id !== id));
        setBasketItems(b => [...b, item]);
    }

    function handleBuyAll() {
        const today = new Date().toISOString().split("T")[0];
        for (const it of registerItems) {
            const cat = catalog.find(c => c.itemType === it.itemType);
            addEntry({ ...it, datePurchased: today, expirationDays: cat?.defaultExpirationDays });
        }
        setRegisterItems([]);
    }


    return (
        <div className="register-panel">
            <div className="register-header">🧾 Register (Checkout)</div>

            <div className="register-list">
                {stagedItems.length === 0 ? (
                    <div className="register-empty">No items staged. Move some from the basket →</div>
                ) : (
                    stagedItems.map((item) => (
                        <div
                            key={item.id}
                            className={`register-item-row ${selectedId === item.id ? "selected" : ""}`}
                        >
                            <button
                                className="register-item"
                                onClick={() => onSelect?.(item)}
                                title={`${item.itemType} • ${item.amount ?? "—"} ${item.unit ?? ""}`}
                            >
                                <div className="register-name">{item.itemType}</div>
                                <div className="register-sub">
                                    <span>{item.amount ?? "—"} {item.unit ?? ""}</span>
                                    <span>• Date: {today}</span>
                                </div>
                            </button>
                            <button
                                className="unstage-btn"
                                title="Return to basket"
                                onClick={() => onUnstage?.(item.id)}
                            >
                                ⟲
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="register-actions">
                <button
                    className="buy-btn"
                    onClick={onBuyAll}
                    disabled={stagedItems.length === 0}
                    title="Buy all staged items → move to inventory"
                >
                    ✅ Buy ({stagedItems.length})
                </button>
            </div>
        </div>
    );
}


export function RegisterInfoBar({ item, onReturnToBasket }) {
    if (!item) return null;

    return (
        <>
            <div className="info-main">
                <div className="info-section">
                    <div className="info-title">🧾 {item.itemType}</div>
                    <div className="item-chips">
                        <span className="pill pill-outline">
                            Amount {item.amount ?? "—"} {item.unit ?? ""}
                        </span>
                    </div>
                </div>
            </div>

            <div className="info-action">
                <button
                    className="action-btn"
                    onClick={() => onReturnToBasket?.(item.id)}
                >
                    ⟲ Return to Basket
                </button>
            </div>
        </>
    );
}
