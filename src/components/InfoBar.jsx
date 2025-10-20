// src/components/InfoBar.jsx
import "../styles/infobar.css";

export default function InfoBar({ children }) {
    return (
        <div className="info-bar two-rows">
            {children ?? (
                <div className="info-row">
                    <span className="pill pill-outline">Select a recipe or an item</span>
                </div>
            )}
        </div>
    );
}
