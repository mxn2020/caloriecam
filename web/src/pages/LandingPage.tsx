import { useNavigate } from 'react-router-dom'
import { Camera, Zap, TrendingUp, Shield, Apple, BarChart3 } from 'lucide-react'

export default function LandingPage() {
    const navigate = useNavigate()

    return (
        <div className="landing-page">
            <section className="landing-hero">
                <div className="landing-hero__content">
                    <h1 className="landing-hero__title">
                        <Camera size={40} style={{ color: 'var(--color-accent)' }} />
                        <span>CalorieIq</span>
                    </h1>
                    <p className="landing-hero__tagline">
                        Snap a photo of your meal and get instant calorie counts, macro breakdowns, and nutrition insights — powered by AI.
                    </p>
                    <div className="landing-hero__actions">
                        <button className="btn btn--primary btn--lg" onClick={() => navigate('/app')}>
                            📸 Scan Your Meal
                        </button>
                        <button className="btn btn--secondary btn--lg" onClick={() => navigate('/pricing')}>
                            View Plans
                        </button>
                    </div>
                </div>
            </section>

            <section className="landing-features">
                <h2 className="landing-section__title">How It Works</h2>
                <div className="landing-features__grid">
                    <div className="landing-feature">
                        <div className="landing-feature__icon"><Camera size={32} /></div>
                        <h3>Snap a Photo</h3>
                        <p>Take a picture of any meal — breakfast, lunch, dinner, or snack.</p>
                    </div>
                    <div className="landing-feature">
                        <div className="landing-feature__icon"><Apple size={32} /></div>
                        <h3>AI Identifies Food</h3>
                        <p>Our AI recognizes individual ingredients, portions, and preparation methods.</p>
                    </div>
                    <div className="landing-feature">
                        <div className="landing-feature__icon"><BarChart3 size={32} /></div>
                        <h3>Get Macro Breakdown</h3>
                        <p>Instantly see calories, protein, carbs, fat, fiber, and a health score for every meal.</p>
                    </div>
                </div>
            </section>

            <section className="landing-features">
                <h2 className="landing-section__title">Enterprise Ready</h2>
                <div className="landing-features__grid">
                    <div className="landing-feature">
                        <Shield size={28} style={{ color: 'var(--color-accent)' }} />
                        <h3>Secure by Default</h3>
                        <p>Authentication, authorization, and audit logging built in.</p>
                    </div>
                    <div className="landing-feature">
                        <Zap size={28} style={{ color: 'var(--color-warm-amber)' }} />
                        <h3>Lightning Fast</h3>
                        <p>Real-time serverless backend ensures instant meal analysis.</p>
                    </div>
                    <div className="landing-feature">
                        <TrendingUp size={28} style={{ color: 'var(--color-neon-emerald)' }} />
                        <h3>Stripe Billing</h3>
                        <p>Subscription management with Stripe checkout and portal.</p>
                    </div>
                </div>
            </section>

            <section className="landing-cta">
                <h2>Ready to track your nutrition?</h2>
                <p>Join today and make healthier food choices with AI-powered insights.</p>
                <button className="btn btn--primary btn--lg" onClick={() => navigate('/login')}>
                    🚀 Sign Up Free
                </button>
            </section>
        </div>
    )
}
