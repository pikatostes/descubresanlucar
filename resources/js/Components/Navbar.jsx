import { Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import '../../css/Navbar.css';

export default function Navbar({ auth }) {
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setMenuOpen(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [menuOpen]);

    return (
        <nav className="navbar relative">
            <div className="navbar-inner">
                {/* Logo */}
                <Link href="/" className="navbar-logo" onClick={() => setMenuOpen(false)}>
                    <span className="logo-icon">📍</span>
                    <span className="logo-text">
                        Descubre<strong>Sanlúcar</strong>
                    </span>
                </Link>

                {/* Links centrales — ocultos en móvil */}
                <div className="nav-links-group hidden md:flex">
                    <Link href="/lugares" className="nav-link">Explorar</Link>
                    <Link href="/categorias" className="nav-link">Categorías</Link>
                    <Link href="/mapa" className="nav-link">Mapa</Link>
                </div>

                {/* Auth — oculto en móvil */}
                <div className="nav-auth-group hidden md:flex">
                    {auth?.user ? (
                        <Link href={route('dashboard')} className="btn-primary">
                            Mi Panel
                        </Link>
                    ) : (
                        <>
                            <Link href={route('login')} className="btn-primary">
                                Iniciar Sesión
                            </Link>
                            <Link href={route('register')} className="btn-secondary">
                                Registrarse
                            </Link>
                        </>
                    )}
                </div>

                {/* Botón hamburguesa — visible solo en móvil */}
                <button
                    className="md:hidden flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-md focus:outline-none"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
                    aria-expanded={menuOpen}
                >
                    <svg
                        className={menuOpen ? 'hidden' : 'block'}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <svg
                        className={menuOpen ? 'block' : 'hidden'}
                        xmlns="http://www.w3.org/2000/svg"
                        width="24" height="24"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Menú móvil desplegable */}
            <div className={`md:hidden absolute top-full left-0 w-full z-50 shadow-lg bg-white overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col gap-2 px-4 pb-4 pt-2">
                    <Link href="/lugares" className="nav-link py-2 border-b border-gray-100" onClick={() => setMenuOpen(false)}>
                        Explorar
                    </Link>
                    <Link href="/categorias" className="nav-link py-2 border-b border-gray-100" onClick={() => setMenuOpen(false)}>
                        Categorías
                    </Link>
                    <Link href="/mapa" className="nav-link py-2 border-b border-gray-100" onClick={() => setMenuOpen(false)}>
                        Mapa
                    </Link>

                    <div className="flex flex-col gap-2 pt-2">
                        {auth?.user ? (
                            <Link href={route('dashboard')} className="btn-primary text-center" onClick={() => setMenuOpen(false)}>
                                Mi Panel
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="btn-primary text-center" onClick={() => setMenuOpen(false)}>
                                    Iniciar Sesión
                                </Link>
                                <Link href={route('register')} className="btn-secondary text-center" onClick={() => setMenuOpen(false)}>
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}