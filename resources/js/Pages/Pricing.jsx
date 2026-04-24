import { Head, Link } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

export default function Pricing({ auth }) {
    const plans = [
        {
            id: 'estandar',
            name: 'Estándar',
            price: '29,90€',
            period: '/mes',
            description: 'Ideal para negocios que comienzan en el mundo digital',
            features: [
                'Perfil de negocio básico',
                'Hasta 5 fotos',
                'Gestión de valoraciones',
                'Posición estándar en búsquedas',
                'Acceso a estadísticas básicas',
                'Soporte por email',
            ],
            highlighted: false,
            cta: 'Contratar Plan Estándar',
        },
        {
            id: 'fundadores',
            name: 'Fundadores',
            price: '19,90€',
            period: '/mes',
            description: 'Precio especial para los primeros negocios en unirse',
            features: [
                'Perfil de negocio completo',
                'Hasta 10 fotos',
                'Gestión de valoraciones',
                'Posición privilegiada en búsquedas',
                'Acceso a estadísticas avanzadas',
                'Soporte prioritario',
                'Badge "Negocio Fundador"',
                'Promoción en redes sociales',
            ],
            highlighted: true,
            cta: 'Ser Fundador',
            badge: 'Mejor valor',
        },
        {
            id: 'premium',
            name: 'Premium',
            price: '49,90€',
            period: '/mes',
            description: 'Máxima visibilidad y beneficios exclusivos',
            features: [
                'Perfil de negocio premium',
                'Fotos ilimitadas',
                'Gestión de valoraciones',
                'Posición destacados en búsquedas',
                'Estadísticas completas en tiempo real',
                'Soporte telefónico preferente',
                'Badge "Nuestras Recomendaciones"',
                'Promoción en portada',
                'Video promocional',
                'API de integración',
            ],
            highlighted: true,
            cta: 'Contratar Plan Premium',
            badge: 'Nuestras Recomendaciones',
        },
    ];

    const footerSections = [
        {
            title: 'Explorar',
            links: [
                { label: 'Todos los lugares', href: '/' },
                { label: 'Categorías', href: '/categorias' },
                { label: 'Explorar', href: '/explorar' },
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
    ];

    return (
        <>
            <Head title="Planes y Tarifas - DescubreSanlúcar" />

            <div className="page-root">
                <Navbar auth={auth} />

                <main className="pricing-page">
                    <div className="pricing-header">
                        <Link href="/" className="pricing-back">← Volver al inicio</Link>
                        <h1 className="pricing-title">Planes y Tarifas</h1>
                        <p className="pricing-subtitle">
                            Elige el plan que mejor se adapte a tu negocio
                        </p>
                    </div>

                    <div className="pricing-grid">
                        {plans.map((plan) => (
                            <div 
                                key={plan.id} 
                                className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}
                            >
                                {plan.badge && (
                                    <div className="pricing-badge">{plan.badge}</div>
                                )}
                                <h2 className="pricing-plan-name">{plan.name}</h2>
                                <div className="pricing-price">
                                    <span className="pricing-amount">{plan.price}</span>
                                    <span className="pricing-period">{plan.period}</span>
                                </div>
                                <p className="pricing-description">{plan.description}</p>
                                <ul className="pricing-features">
                                    {plan.features.map((feature, index) => (
                                        <li key={index} className="pricing-feature">
                                            <span className="pricing-check">✓</span>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`pricing-cta ${plan.highlighted ? 'primary' : 'secondary'}`}>
                                    {plan.cta}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="pricing-faq">
                        <h2>Preguntas Frecuentes</h2>
                        <div className="faq-grid">
                            <div className="faq-item">
                                <h3>¿Puedo cambiar de plan más adelante?</h3>
                                <p>Sí, puedes ascender o descender de plan en cualquier momento. Los cambios se aplicarán en el siguiente ciclo de facturación.</p>
                            </div>
                            <div className="faq-item">
                                <h3>¿Qué métodos de pago aceptan?</h3>
                                <p>Aceptamos tarjetas de crédito/débito, transferencia bancaria y PayPal.</p>
                            </div>
                            <div className="faq-item">
                                <h3>¿Hay período de prueba?</h3>
                                <p>Todos los planes incluyen 14 días de prueba gratuita sin compromiso.</p>
                            </div>
                            <div className="faq-item">
                                <h3>¿Puedo cancelar en cualquier momento?</h3>
                                <p>Sí, puedes cancelar tu suscripción cuando quieras desde tu panel de control.</p>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer sections={footerSections} />
            </div>

            <style>{`
                .pricing-page {
                    min-height: 70vh;
                    padding: 2rem 1rem 4rem;
                    background: #f8fafc;
                }

                .pricing-header {
                    text-align: center;
                    margin-bottom: 3rem;
                }

                .pricing-back {
                    display: inline-block;
                    color: #e8572a;
                    font-size: 0.9rem;
                    font-weight: 500;
                    text-decoration: none;
                    margin-bottom: 1.5rem;
                    transition: color 0.2s;
                }

                .pricing-back:hover {
                    color: #c94420;
                }

                .pricing-title {
                    font-size: clamp(2rem, 5vw, 3rem);
                    font-weight: 800;
                    color: #1a1a2e;
                    margin: 0 0 0.5rem;
                }

                .pricing-subtitle {
                    font-size: 1.2rem;
                    color: #666;
                    margin: 0;
                }

                .pricing-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    max-width: 1100px;
                    margin: 0 auto 4rem;
                    align-items: start;
                }

                .pricing-card {
                    background: white;
                    border-radius: 20px;
                    padding: 2rem;
                    border: 2px solid #eaeaea;
                    position: relative;
                    transition: all 0.3s ease;
                }

                .pricing-card:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                }

                .pricing-card.highlighted {
                    border-color: #e8572a;
                    box-shadow: 0 10px 30px rgba(232, 87, 42, 0.15);
                }

                .pricing-badge {
                    position: absolute;
                    top: -12px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #e8572a;
                    color: white;
                    padding: 6px 16px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    white-space: nowrap;
                }

                .pricing-plan-name {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #1a1a2e;
                    margin: 0.5rem 0 1rem;
                    text-align: center;
                }

                .pricing-price {
                    text-align: center;
                    margin-bottom: 1rem;
                }

                .pricing-amount {
                    font-size: 2.5rem;
                    font-weight: 800;
                    color: #1a1a2e;
                }

                .pricing-period {
                    font-size: 1rem;
                    color: #666;
                }

                .pricing-description {
                    text-align: center;
                    color: #666;
                    margin-bottom: 1.5rem;
                    font-size: 0.95rem;
                }

                .pricing-features {
                    list-style: none;
                    padding: 0;
                    margin: 0 0 2rem;
                }

                .pricing-feature {
                    display: flex;
                    align-items: flex-start;
                    gap: 10px;
                    padding: 0.6rem 0;
                    font-size: 0.95rem;
                    color: #444;
                    border-bottom: 1px solid #f0f0f0;
                }

                .pricing-feature:last-child {
                    border-bottom: none;
                }

                .pricing-check {
                    color: #10b981;
                    font-weight: bold;
                    flex-shrink: 0;
                }

                .pricing-cta {
                    width: 100%;
                    padding: 14px 24px;
                    border-radius: 12px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    border: none;
                }

                .pricing-cta.primary {
                    background: #e8572a;
                    color: white;
                }

                .pricing-cta.primary:hover {
                    background: #c94420;
                }

                .pricing-cta.secondary {
                    background: #f3f4f6;
                    color: #1a1a2e;
                    border: 2px solid #eaeaea;
                }

                .pricing-cta.secondary:hover {
                    background: #e5e7eb;
                }

                .pricing-faq {
                    max-width: 900px;
                    margin: 0 auto;
                }

                .pricing-faq h2 {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #1a1a2e;
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .faq-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 2rem;
                }

                .faq-item {
                    background: white;
                    padding: 1.5rem;
                    border-radius: 12px;
                    border: 1px solid #eaeaea;
                }

                .faq-item h3 {
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: #1a1a2e;
                    margin: 0 0 0.75rem;
                }

                .faq-item p {
                    font-size: 0.95rem;
                    color: #666;
                    margin: 0;
                    line-height: 1.6;
                }

                @media (max-width: 640px) {
                    .pricing-grid {
                        grid-template-columns: 1fr;
                    }

                    .faq-grid {
                        grid-template-columns: 1fr;
                    }

                    .pricing-card.highlighted {
                        order: -1;
                    }
                }
            `}</style>
        </>
    );
}