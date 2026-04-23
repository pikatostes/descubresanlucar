import { Link } from '@inertiajs/react';

export default function OwnerCTA() {
    return (
        <section className="owner-cta">
            <div className="cta-inner">
                <div className="cta-content">
                    <span className="cta-eyebrow">¿Eres propietario?</span>
                    <h2 className="cta-title">
                        Haz visible tu negocio
                        <br />en nuestra guía
                    </h2>
                    <p className="cta-text">
                        Regístrate como propietario y consigue que miles de personas
                        descubran tu establecimiento. Gestiona tu perfil, responde reseñas
                        y destaca entre la competencia.
                    </p>
                    <div className="cta-actions">
                        <Link href={route('register')} className="cta-btn-primary">
                            Registrar mi negocio
                        </Link>
                        <Link href="/como-funciona" className="cta-btn-ghost">
                            Cómo funciona →
                        </Link>
                    </div>
                </div>
                <div className="cta-features">
                    {[
                        { icon: '📊', title: 'Estadísticas', desc: 'Conoce cuántas personas ven tu negocio' },
                        { icon: '💬', title: 'Reseñas', desc: 'Responde a las opiniones de tus clientes' },
                        { icon: '🎯', title: 'Destaca', desc: 'Aparece en los primeros resultados' },
                    ].map((f) => (
                        <div key={f.title} className="cta-feature">
                            <span className="feature-icon">{f.icon}</span>
                            <div>
                                <strong>{f.title}</strong>
                                <p>{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}