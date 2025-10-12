// inventory/InventoryGrid.jsx
import React, { useEffect, useRef, useState } from 'react';
import "../styles/inventory.css";

const SLOT = 80; // match CSS --slot
const WALL = 8;  // match CSS --wall

function initials(name) {
    if (!name) return '?';
    return name.trim().charAt(0).toUpperCase();
}

export default function InventoryGrid({ groups, onSelect, onSwap }) {
    const wrapRef = useRef(null);
    const dragFrom = useRef(null);

    const [cols, setCols] = useState(1);
    const [rows, setRows] = useState(1);

    // Maintain a local order mirror so DnD works even if parent doesn't provide onSwap
    const [ordered, setOrdered] = useState(groups);

    // Keep local order in sync with incoming groups when they change externally
    useEffect(() => {
        setOrdered(groups);
    }, [groups]);

    // Measure wrapper only (prevents self-expansion loops)
    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;

        const compute = () => {
            const contentW = el.clientWidth;
            const contentH = el.clientHeight;
            const c = Math.max(1, Math.floor((contentW + WALL) / (SLOT + WALL)));
            const r = Math.max(1, Math.floor((contentH + WALL) / (SLOT + WALL)));
            setCols(c);
            setRows(r);
        };

        compute();
        const ro = new ResizeObserver(compute);
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    const capacity = cols * rows;

    // Build the visible window (filled with nulls for empty slots)
    const view = (ordered || []).slice(0, capacity);
    if (view.length < capacity) view.push(...Array(capacity - view.length).fill(null));

    // ---- DnD handlers ----
    function handleDragStart(e, fromIdx) {
        dragFrom.current = fromIdx;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', String(fromIdx));
    }

    function handleDragOver(e) {
        // allow drop
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }

    function handleDrop(e, toIdx) {
        e.preventDefault();
        // Prefer the ref; fall back to dataTransfer for cross-browser
        let fromIdx = dragFrom.current;
        if (fromIdx == null) {
            const parsed = Number(e.dataTransfer.getData('text/plain'));
            if (Number.isInteger(parsed)) fromIdx = parsed;
        }
        dragFrom.current = null;
        if (!Number.isInteger(fromIdx) || fromIdx === toIdx) return;

        if (typeof onSwap === 'function') {
            // Let parent own the data if provided
            onSwap(fromIdx, toIdx);
        } else {
            // Local reorder fallback so it still "just works"
            setOrdered(prev => {
                const next = prev.slice(0, capacity); // operate on the visible window bounds
                // pad if needed (in case prev shorter than capacity)
                while (next.length < capacity) next.push(null);

                const a = next[fromIdx];
                const b = next[toIdx];
                next[fromIdx] = b || null;
                next[toIdx] = a || null;

                // merge back with the remainder beyond capacity
                const remainder = prev.slice(capacity);
                // compact nulls at the end (so we don't grow unintended nulls)
                const compact = [...next.filter(v => v != null), ...remainder];
                return compact;
            });
        }
    }

    function handleDragEnd() {
        dragFrom.current = null;
    }

    // Helper to render a filled slot (draggable)
    function FilledSlot({ g, idx }) {
        const name = g.displayName;
        return (
            <div
                key={g.itemType}
                className="slot filled"
                draggable
                onDragStart={(e) => handleDragStart(e, idx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                onClick={() => onSelect && onSelect(g.itemType)}
                title={`${name} • total: ${g.totalAmount}`}
                // Prevent text selection from interfering with drag, without changing global CSS
                style={{ userSelect: 'none', WebkitUserSelect: 'none', cursor: 'grab' }}
            >
                <div className="amount-badge" style={{ pointerEvents: 'none' }}>{g.totalAmount}</div>
                <div className="item-icon">{initials(name)}</div>
                <div className="item-name">{name}</div>
            </div>
        );
    }

    // Helper to render an empty slot (drop target)
    function EmptySlot({ idx }) {
        return (
            <div
                key={`empty-${idx}`}
                className="slot empty"
                title="Empty slot"
                onClick={() => onSelect && onSelect(null)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
                // Keeps target "active" for drops
                style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
            />
        );
    }

    return (
        <div ref={wrapRef} className="inventory-grid-wrap">
            <div
                className="inventory-grid"
                style={{ gridTemplateColumns: `repeat(${cols}, var(--slot))` }}
            >
                {view.map((g, idx) =>
                    g ? <FilledSlot key={g.itemType} g={g} idx={idx} /> : <EmptySlot key={`empty-${idx}`} idx={idx} />
                )}
            </div>
        </div>
    );
}
