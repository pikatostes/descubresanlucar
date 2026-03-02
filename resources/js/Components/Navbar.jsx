import { Link } from '@inertiajs/react';

export default function Navbar({ auth }) {
    return (
        <nav className="navbar">
            <div className="navbar-inner">
                {/* Logo */}
                <Link href="/" className="navbar-logo">
                    <span className="logo-icon">📍</span>
                    <span className="logo-text">
                        Descubre<strong>Ciudad</strong>
                    </span>
                </Link>

                {/* Links centrales */}
                <div className="navbar-links">
                    <Link href="/lugares" className="nav-link">Explorar</Link>
                    <Link href="/categorias" className="nav-link">Categorías</Link>
                    <Link href="/mapa" className="nav-link">Mapa</Link>
                </div>

                {/* Auth */}
                <div className="navbar-auth">
                    {auth?.user ? (
                        <Link href={route('dashboard')} className="btn-primary">
                            Mi Panel
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="btn-ghost">
                                Entrar
                            </Link>
                            <Link href={route('register')} className="btn-primary">
                                Anunciar mi negocio
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}