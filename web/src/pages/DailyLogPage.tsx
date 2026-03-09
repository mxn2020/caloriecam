import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import { Clock, Flame, ArrowLeft, Apple } from "lucide-react";

export default function DailyLogPage() {
    const scans = useQuery(api.functions.getRecentScans);
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
    const todayScans = scans?.filter((s: any) => s.createdAt >= todayStart.getTime()) ?? [];
    const totalCals = todayScans.reduce((a: number, s: any) => a + (s.totalCalories || 0), 0);
    const totalProtein = todayScans.reduce((a: number, s: any) => a + (s.protein || 0), 0);
    const totalCarbs = todayScans.reduce((a: number, s: any) => a + (s.carbs || 0), 0);
    const totalFat = todayScans.reduce((a: number, s: any) => a + (s.fat || 0), 0);

    return (
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
            <Link to="/app" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--color-text-secondary)", textDecoration: "none", marginBottom: "1rem", fontSize: "0.9rem" }}>
                <ArrowLeft size={16} /> Back to Home
            </Link>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem" }}>Daily Log</h1>

            {/* Today summary */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", marginBottom: "1.5rem" }}>
                {[
                    { label: "Calories", value: totalCals, color: "#EF4444" },
                    { label: "Protein", value: `${totalProtein}g`, color: "#3B82F6" },
                    { label: "Carbs", value: `${totalCarbs}g`, color: "#F59E0B" },
                    { label: "Fat", value: `${totalFat}g`, color: "#10B981" },
                ].map((s) => (
                    <div key={s.label} style={{ textAlign: "center", padding: "0.75rem", borderRadius: 12, background: `${s.color}08`, border: `1px solid ${s.color}15` }}>
                        <div style={{ fontSize: "1.3rem", fontWeight: 700 }}>{s.value}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)" }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* All scans */}
            <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.75rem" }}>All Meals</h2>
            {!scans ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-secondary)" }}>Loading...</div>
            ) : scans.length === 0 ? (
                <div style={{ textAlign: "center", padding: "3rem", borderRadius: 14, background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
                    <Apple size={40} style={{ color: "var(--color-text-secondary)", marginBottom: 12 }} />
                    <p style={{ color: "var(--color-text-secondary)", marginBottom: 16 }}>No meals logged yet.</p>
                    <Link to="/analyze" style={{ padding: "0.5rem 1.5rem", borderRadius: 8, background: "var(--color-accent)", color: "white", fontWeight: 600, textDecoration: "none" }}>
                        Log your first meal
                    </Link>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    {scans.map((scan: any) => (
                        <div key={scan._id} style={{
                            padding: "1rem 1.25rem", borderRadius: 12, background: "var(--color-surface)", border: "1px solid var(--color-border)",
                            display: "flex", justifyContent: "space-between", alignItems: "center"
                        }}>
                            <div>
                                <span style={{ fontWeight: 600 }}>{scan.mealName}</span>
                                <div style={{ fontSize: "0.8rem", color: "var(--color-text-secondary)", marginTop: 2 }}>
                                    P: {scan.protein}g · C: {scan.carbs}g · F: {scan.fat}g
                                </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontWeight: 700, color: "var(--color-accent)", display: "flex", alignItems: "center", gap: 4 }}>
                                    <Flame size={16} /> {scan.totalCalories}
                                </div>
                                <div style={{ fontSize: "0.75rem", color: "var(--color-text-secondary)", display: "flex", alignItems: "center", gap: 4 }}>
                                    <Clock size={12} /> {new Date(scan.createdAt).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
