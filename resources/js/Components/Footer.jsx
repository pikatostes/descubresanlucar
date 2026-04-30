import { Link } from '@inertiajs/react';

export default function Footer({ sections = [] }) {
    return (
        <footer className="site-footer height-100 d-flex flex-column justify-center">
            <div className="footer-inner d-flex align-center">
                {/* Logo y descripción */}
                <div className="footer-brand">
                    <Link href="/" className="footer-logo">
                        <span>📍</span>
                        <span className="footer-logo-text">
                            Descubre<strong>Sanlúcar</strong>
                        </span>
                    </Link>
                    <p className="footer-tagline">
                        Tu guía local de confianza. Descubre los mejores
                        establecimientos y apoya los negocios de tu ciudad.
                    </p>
                </div>

                {/* Secciones de links */}
                <div className="footer-sections">
                    {sections.map((section, index) => (
                        <div key={index} className="footer-section">
                            <h4 className="footer-section-title">{section.title}</h4>
                            <ul className="footer-links">
                                {section.links.map((link, idx) => (
                                    <li key={idx}>
                                        {link.href ? (
                                            <Link href={link.href} className="footer-link">
                                                {link.label}
                                            </Link>
                                        ) : (
                                            <span className="footer-link-plain">{link.label}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom bar */}
            <div className="footer-bottom">
                <span>© {new Date().getFullYear()} DescubreSanlúcar. Todos los derechos reservados.</span>
                <div className="footer-bottom-links">
                    <Link href="/privacidad" className="footer-bottom-link">Privacidad</Link>
                    <span className="footer-dot">·</span>
                    <Link href="/terminos" className="footer-bottom-link">Términos</Link>
                    <span className="footer-dot">·</span>
                    <Link href="/contacto" className="footer-bottom-link">Contacto</Link>
                </div>
            </div>
            this is a test
        </footer>
    );
}
