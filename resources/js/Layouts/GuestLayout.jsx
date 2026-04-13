import Footer from '@/Components/Footer';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <>
            <div className="auth-page">
                <div className="auth-sidebar">
                    <Link href="/" className="auth-logo">
                        <span className="auth-logo-icon">📍</span>
                        <span className="auth-logo-text">
                            Descubre<strong>Sanlúcar</strong>
                        </span>
                    </Link>
                    <div className="auth-sidebar-content">
                        <h2 className="auth-sidebar-title">Tu guía local</h2>
                        <p className="auth-sidebar-text">
                            Descubre los mejores restaurantes, bares, hoteles y actividades en Sanlúcar de Barrameda.
                        </p>
                        <div className="auth-sidebar-features">
                            <span>🔍</span>
                            <span>⭐</span>
                            <span>❤️</span>
                        </div>
                    </div>
                </div>

                <div className="auth-main">
                    <div className="auth-card">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}