import { useState, useCallback, useRef, useEffect } from 'react';
import { useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

interface MealResult {
    mealName: string;
    totalCalories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    items: { name: string; calories: number; protein: number; carbs: number; fat: number; portion: string }[];
    healthScore: number;
    tip: string;
}

function ImageUploader({ onSelect, preview, onClear }: { onSelect: (b64: string) => void; preview: string | null; onClear: () => void }) {
    const [dragging, setDragging] = useState(false);
    const ref = useRef<HTMLInputElement>(null);
    const handle = useCallback((f: File) => {
        if (!f.type.startsWith('image/')) return;
        const r = new FileReader();
        r.onload = (e) => onSelect(e.target?.result as string);
        r.readAsDataURL(f);
    }, [onSelect]);

    if (preview) return (
        <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
            <img src={preview} alt="Meal" style={{ width: '100%', maxHeight: 320, objectFit: 'cover', display: 'block' }} />
            <button className="btn btn--ghost" onClick={onClear} style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', borderRadius: 'var(--radius-full)', width: 32, height: 32, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>
    );

    return (
        <div
            className={`roomiq-dropzone ${dragging ? 'active' : ''}`}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handle(f); }}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onClick={() => ref.current?.click()}
        >
            <span style={{ fontSize: '3rem' }}>🍽️</span>
            <p style={{ fontWeight: 600, marginTop: 'var(--space-sm)' }}>Drop your meal photo or click to upload</p>
            <p style={{ color: 'var(--color-smoke-gray)', fontSize: '0.85rem' }}>JPG, PNG, WebP</p>
            <input ref={ref} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); }} />
        </div>
    );
}

export default function AppHome() {
    const [img, setImg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<MealResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loadIdx, setLoadIdx] = useState(0);

    const analyze = useAction(api.ai.analyzeMeal);
    const save = useMutation(api.functions.saveScan);

    const msgs = ["Identifying food items…", "Calculating macros…", "Analyzing nutritional value…", "Almost ready…"];
    useEffect(() => {
        if (!loading) return;
        const i = setInterval(() => setLoadIdx(n => (n + 1) % msgs.length), 2500);
        return () => clearInterval(i);
    }, [loading]);

    const handleScan = useCallback(async () => {
        if (!img) return;
        setLoading(true);
        setError(null);
        try {
            const r = await analyze({ imageBase64: img });
            setResult(r);
            await save(r);
        } catch (e: any) {
            setError(e.message || 'Analysis failed');
        } finally {
            setLoading(false);
        }
    }, [img, analyze, save]);

    const reset = () => { setImg(null); setResult(null); setError(null); };

    const getColor = (score: number) => score >= 7 ? '#22c55e' : score >= 4 ? '#f59e0b' : '#ef4444';

    if (loading) {
        return (
            <div className="roomiq-page animate-fade-in">
                <div className="card" style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', padding: 'var(--space-2xl)' }}>
                    <div className="animate-spin" style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>🍽️</div>
                    <h2 style={{ marginBottom: 'var(--space-sm)' }}>Analyzing Your Meal</h2>
                    <p style={{ color: 'var(--color-smoke-gray)' }}>{msgs[loadIdx]}</p>
                </div>
            </div>
        );
    }

    if (result) {
        return (
            <div className="roomiq-page animate-fade-in">
                <div className="card" style={{ maxWidth: 680, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                        <span style={{ fontSize: '2rem' }}>🥗</span>
                        <h2>{result.mealName}</h2>
                    </div>

                    {/* Macro Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
                            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-accent)' }}>{result.totalCalories}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-smoke-gray)' }}>Calories</div>
                        </div>
                        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
                            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#3b82f6' }}>{result.protein}<span style={{ fontSize: '0.8rem' }}>g</span></div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-smoke-gray)' }}>Protein</div>
                        </div>
                        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
                            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f59e0b' }}>{result.carbs}<span style={{ fontSize: '0.8rem' }}>g</span></div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-smoke-gray)' }}>Carbs</div>
                        </div>
                        <div className="card" style={{ textAlign: 'center', padding: 'var(--space-md)' }}>
                            <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#ef4444' }}>{result.fat}<span style={{ fontSize: '0.8rem' }}>g</span></div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-smoke-gray)' }}>Fat</div>
                        </div>
                    </div>

                    {/* Items Breakdown */}
                    <h3 style={{ marginBottom: 'var(--space-md)', fontSize: '1rem' }}>Breakdown</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)' }}>
                        {result.items.map((item, i) => (
                            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 'var(--space-sm) var(--space-md)', borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--color-border)' }}>
                                <div>
                                    <span style={{ fontWeight: 600 }}>{item.name}</span>
                                    <br /><span style={{ fontSize: '0.8rem', color: 'var(--color-smoke-gray)' }}>{item.portion}</span>
                                </div>
                                <span style={{ fontWeight: 600, color: 'var(--color-accent)' }}>{item.calories} cal</span>
                            </div>
                        ))}
                    </div>

                    {/* Health Score */}
                    <div style={{ marginBottom: 'var(--space-lg)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Health Score</span>
                            <span style={{ fontWeight: 700, color: getColor(result.healthScore) }}>{result.healthScore}/10</span>
                        </div>
                        <div style={{ height: 8, borderRadius: 'var(--radius-full)', background: 'var(--color-border)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${result.healthScore * 10}%`, background: getColor(result.healthScore), borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease' }} />
                        </div>
                    </div>

                    {/* Tip */}
                    <div className="card" style={{ padding: 'var(--space-md)', background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
                        <span style={{ marginRight: 'var(--space-sm)' }}>💡</span>
                        <span style={{ fontSize: '0.9rem', color: 'var(--color-smoke-gray)' }}>{result.tip}</span>
                    </div>

                    <div style={{ marginTop: 'var(--space-xl)', textAlign: 'center' }}>
                        <button className="btn btn--primary" onClick={reset}>📸 Scan Another Meal</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="roomiq-page animate-fade-in">
            <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
                <h1 style={{ marginBottom: 'var(--space-md)' }}>
                    Scan Your <span style={{ color: 'var(--color-accent)' }}>Meal</span>
                </h1>
                <p style={{ color: 'var(--color-smoke-gray)', fontSize: '1.05rem', marginBottom: 'var(--space-xl)', lineHeight: 1.7 }}>
                    Snap a photo of your food and get instant calorie and macro breakdowns powered by AI.
                </p>

                <ImageUploader onSelect={setImg} preview={img} onClear={() => setImg(null)} />

                {error && (
                    <p style={{ color: 'var(--color-hot-red)', marginTop: 'var(--space-md)', fontSize: '0.9rem' }}>{error}</p>
                )}

                <button className="btn btn--primary btn--lg" disabled={!img} onClick={handleScan} style={{ marginTop: 'var(--space-lg)' }}>
                    📊 Analyze Meal
                </button>
            </div>
        </div>
    );
}
