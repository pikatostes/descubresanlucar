import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

export default function Navbar({ auth }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    // Cierra el dropdown de usuario al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setUserDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

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
                    <Link href="/explorar" className="nav-link">Explorar</Link>
                    <Link href="/categorias" className="nav-link">Categorías</Link>
                    <Link href="/mapa" className="nav-link">Mapa</Link>
                </div>

                {/* Auth — oculto en móvil */}
                <div className="nav-auth-group hidden md:flex">
                    {auth?.user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                type="button"
                                className="btn-primary inline-flex items-center gap-1"
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                            >
                                {auth.user.name}
                                <svg
                                    className={`h-4 w-4 transition-transform duration-150 ${userDropdownOpen ? 'rotate-180' : ''}`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </button>

{userDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white border border-gray-100 py-1 z-50">
                                    <Link
                                        href={route('dashboard')}
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => setUserDropdownOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                        onClick={() => setUserDropdownOpen(false)}
                                    >
                                        Cerrar Sesión
                                    </Link>
                                </div>
                            )}
                        </div>
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
            <div className={`md:hidden absolute top-full left-0 w-full z-[10000] shadow-lg bg-white overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col gap-2 px-4 pb-4 pt-2">
                    <Link href="/explorar" className="nav-link py-2 border-b border-gray-100" onClick={() => setMenuOpen(false)}>
                        Explorar
                    </Link>
                    <Link href="/categorias" className="nav-link py-2 border-b border-gray-100" onClick={() => setMenuOpen(false)}>
                        Categorías
                    </Link>
                    <Link href="/mapa" className="nav-link py-2 border-b border-gray-100" onClick={() => setMenuOpen(false)}>
                        Mapa
                    </Link>

{auth?.user && (
                                <>
                                    <Link
                                        href={route('dashboard')}
                                        className="nav-link py-2 border-b border-gray-100"
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                </>
                            )}

                    <div className="flex flex-col gap-2 pt-2">
                        {auth?.user ? (
                            <>
                                <div className="text-sm text-gray-500 px-1">{auth.user.email}</div>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="btn-secondary text-center"
                                    onClick={() => setMenuOpen(false)}
                                >
                                    Cerrar Sesión
                                </Link>
                            </>
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
