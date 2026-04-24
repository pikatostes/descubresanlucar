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
            <Footer
                sections={[
                    {
                        title: 'Explorar',
                        links: [
                            { label: 'Todos los lugares', href: '/lugares' },
                            { label: 'Mapa interactivo', href: '/mapa' },
                            { label: 'Destacados', href: '/destacados' },
                        ],
                    },
                    {
                        title: 'Categorías',
                        links: [
                            { label: 'Restaurantes', href: '/categoria/restaurantes' },
                            { label: 'Bares', href: '/categoria/bares' },
                            { label: 'Hoteles', href: '/categoria/hoteles' },
                        ],
                    },
                    {
                        title: 'Propietarios',
                        links: [
                            { label: 'Registrar negocio', href: '/register' },
                            { label: 'Panel de control', href: '/dashboard' },
                            { label: 'Cómo funciona', href: '/como-funciona' },
                        ],
                    },
                    {
                        title: 'Legal',
                        links: [
                            { label: 'Privacidad', href: '/privacidad' },
                            { label: 'Términos de uso', href: '/terminos' },
                            { label: 'Aviso Legal', href: '/aviso-legal' },
                            { label: 'Contacto', href: '/contacto' },
                        ],
                    },
                ]}
            />
        </>
    );
}