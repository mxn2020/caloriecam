import { useState } from "react";
import { Camera, Apple, TrendingUp, History, Utensils, Flame } from "lucide-react";

export default function AppHome() {
    const [dragOver, setDragOver] = useState(false);

    return (
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1rem" }}>
            {/* Hero */}
            <div style={{
                textAlign: "center", marginBottom: "2rem",
                background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.08))",
                borderRadius: 16, padding: "2.5rem 1.5rem", border: "1px solid rgba(245,158,11,0.2)"
            }}>
                <Apple size={48} style={{ color: "var(--color-accent)", marginBottom: 12 }} />
                <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: 8 }}>CalorieCam</h1>
                <p style={{ color: "var(--color-text-secondary)", fontSize: "1.1rem" }}>
                    Snap a photo of your meal — get instant calorie and macro breakdowns
                </p>
            </div>

            {/* Today's Summary */}
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                gap: "0.75rem", marginBottom: "2rem"
            }}>
                {[
                    { label: "Calories", value: "—", icon: Flame, color: "#EF4444" },
                    { label: "Protein", value: "—", icon: TrendingUp, color: "#3B82F6" },
                    { label: "Carbs", value: "—", icon: Utensils, color: "#F59E0B" },
                    { label: "Fat", value: "—", icon: Apple, color: "#10B981" },
                ].map((stat, i) => (
                    <div key={i} style={{
                        padding: "1rem", borderRadius: 12, background: `${stat.color}08`,
                        border: `1px solid ${stat.color}20`, textAlign: "center"
                    }}>
                        <stat.icon size={20} style={{ color: stat.color, marginBottom: 4 }} />
                        <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{stat.value}</div>
                        <div style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)" }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Upload Area */}
            <div
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={e => { e.preventDefault(); setDragOver(false); }}
                style={{
                    padding: "3rem", textAlign: "center", borderRadius: 16, marginBottom: "2rem",
                    border: `2px dashed ${dragOver ? "var(--color-accent)" : "var(--color-border)"}`,
                    background: dragOver ? "rgba(245,158,11,0.05)" : "var(--color-surface)",
                    cursor: "pointer", transition: "all 0.2s"
                }}
            >
                <Camera size={40} style={{ color: "var(--color-accent)", marginBottom: 12 }} />
                <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Snap or upload a meal photo</h3>
                <p style={{ color: "var(--color-text-secondary)", marginBottom: 16 }}>AI will analyze calories, protein, carbs, and fat</p>
                <button style={{
                    padding: "0.6rem 2rem", borderRadius: 10, background: "var(--color-accent)",
                    color: "white", fontWeight: 600, border: "none", cursor: "pointer",
                    display: "inline-flex", alignItems: "center", gap: 6
                }}>
                    <Camera size={16} /> Take Photo
                </button>
            </div>

            {/* Recent Meals */}
            <h2 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: 8 }}>
                <History size={20} /> Today's Meals
            </h2>
            <div style={{
                padding: "2rem", textAlign: "center", borderRadius: 14,
                background: "var(--color-surface)", border: "1px solid var(--color-border)",
                color: "var(--color-text-secondary)"
            }}>
                No meals logged yet today. Snap a photo to get started!
            </div>
        </div>
    );
}
