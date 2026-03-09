import { Beef, Wheat, Droplets, Leaf, Heart } from "lucide-react";

interface MealItem {
    name: string; calories: number; protein: number; carbs: number; fat: number; portion: string;
}

interface MealResult {
    mealName: string; totalCalories: number; protein: number; carbs: number; fat: number; fiber: number;
    items: MealItem[]; healthScore: number; tip: string;
}

export default function NutritionCard({ result }: { result: MealResult }) {
    const macroColor = { protein: "#3B82F6", carbs: "#F59E0B", fat: "#EF4444", fiber: "#10B981" };
    const totalMacros = result.protein + result.carbs + result.fat;

    return (
        <div style={{ borderRadius: 16, background: "var(--color-surface)", border: "1px solid var(--color-border)", overflow: "hidden" }}>
            <div style={{
                padding: "1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center",
                background: "linear-gradient(135deg, rgba(245,158,11,0.1), rgba(239,68,68,0.05))", borderBottom: "1px solid var(--color-border)"
            }}>
                <div>
                    <h3 style={{ fontWeight: 700, fontSize: "1.1rem" }}>{result.mealName}</h3>
                    <span style={{ fontSize: "0.85rem", color: "var(--color-text-secondary)" }}>
                        <Heart size={14} style={{ display: "inline", verticalAlign: -2, color: result.healthScore >= 7 ? "#10B981" : result.healthScore >= 4 ? "#F59E0B" : "#EF4444" }} /> Health: {result.healthScore}/10
                    </span>
                </div>
                <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-accent)" }}>{result.totalCalories}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>calories</div>
                </div>
            </div>

            {/* Macro bars */}
            <div style={{ padding: "1rem 1.25rem", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem" }}>
                {([
                    { label: "Protein", value: result.protein, icon: <Beef size={16} />, color: macroColor.protein },
                    { label: "Carbs", value: result.carbs, icon: <Wheat size={16} />, color: macroColor.carbs },
                    { label: "Fat", value: result.fat, icon: <Droplets size={16} />, color: macroColor.fat },
                    { label: "Fiber", value: result.fiber, icon: <Leaf size={16} />, color: macroColor.fiber },
                ] as const).map((m) => (
                    <div key={m.label} style={{ textAlign: "center", padding: "0.5rem", borderRadius: 10, background: `${m.color}08`, border: `1px solid ${m.color}15` }}>
                        <div style={{ color: m.color, marginBottom: 2 }}>{m.icon}</div>
                        <div style={{ fontWeight: 700, fontSize: "1.1rem" }}>{m.value}g</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--color-text-secondary)" }}>{m.label}</div>
                    </div>
                ))}
            </div>

            {/* Macro pie (simple bar) */}
            {totalMacros > 0 && (
                <div style={{ padding: "0 1.25rem 0.75rem", display: "flex", gap: 2, height: 8, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${(result.protein / totalMacros) * 100}%`, background: macroColor.protein, borderRadius: 4 }} />
                    <div style={{ width: `${(result.carbs / totalMacros) * 100}%`, background: macroColor.carbs, borderRadius: 4 }} />
                    <div style={{ width: `${(result.fat / totalMacros) * 100}%`, background: macroColor.fat, borderRadius: 4 }} />
                </div>
            )}

            {/* Items */}
            <div style={{ padding: "0.5rem 1.25rem 1rem" }}>
                <h4 style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "0.9rem" }}>Items</h4>
                {result.items.map((item, i) => (
                    <div key={i} style={{
                        display: "flex", justifyContent: "space-between", padding: "0.4rem 0",
                        borderBottom: i < result.items.length - 1 ? "1px solid var(--color-border)" : "none", fontSize: "0.85rem"
                    }}>
                        <span>{item.name} <span style={{ color: "var(--color-text-secondary)" }}>({item.portion})</span></span>
                        <span style={{ fontWeight: 600 }}>{item.calories} cal</span>
                    </div>
                ))}
            </div>

            {/* Tip */}
            <div style={{ padding: "0.75rem 1.25rem", background: "rgba(16,185,129,0.06)", borderTop: "1px solid var(--color-border)", fontSize: "0.85rem" }}>
                💡 <strong>Tip:</strong> {result.tip}
            </div>
        </div>
    );
}
