import { useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import MealUpload from "../components/MealUpload";
import NutritionCard from "../components/NutritionCard";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface MealResult {
    mealName: string; totalCalories: number; protein: number; carbs: number; fat: number; fiber: number;
    items: Array<{ name: string; calories: number; protein: number; carbs: number; fat: number; portion: string }>;
    healthScore: number; tip: string;
}

export default function MealAnalysisPage() {
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<MealResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const analyzeMeal = useAction(api.ai.analyzeMeal);
    const saveScan = useMutation(api.functions.saveScan);

    const handleAnalyze = async (imageBase64: string) => {
        setAnalyzing(true); setError(null);
        try {
            const analysis = await analyzeMeal({ imageBase64 }) as MealResult;
            setResult(analysis);
            await saveScan(analysis);
        } catch (err) { setError(err instanceof Error ? err.message : "Analysis failed"); }
        setAnalyzing(false);
    };

    return (
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "2rem 1rem" }}>
            <Link to="/app" style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--color-text-secondary)", textDecoration: "none", marginBottom: "1rem", fontSize: "0.9rem" }}>
                <ArrowLeft size={16} /> Back to Home
            </Link>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>Meal Analysis</h1>
            <MealUpload onAnalyze={handleAnalyze} isAnalyzing={analyzing} />
            {error && (
                <div style={{ marginTop: "1rem", padding: "0.75rem 1rem", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#EF4444" }}>{error}</div>
            )}
            {result && <div style={{ marginTop: "1.5rem" }}><NutritionCard result={result} /></div>}
        </div>
    );
}
