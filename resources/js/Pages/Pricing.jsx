import { Head, Link } from '@inertiajs/react';
import '../../css/Pricing.css';

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
        },
        {
            id: 'premium',
            name: 'Premium',
            price: '59,90€',
            period: '/mes',
            description: 'Para negocios que quieren destacar y atraer más clientes',
            features: [
                'Todo en Estándar',
                'Fotos ilimitadas',
                'Posición preferente en búsquedas',
                'Estadísticas avanzadas',
                'Cupones y promociones',
                '优先Soporte por chat',
            ],
            highlighted: true,
            cta: 'Contratar Plan Premium',
            badge: 'Nuestras Recomendaciones',
        },
        {
            id: 'enterprise',
            name: 'Empresas',
            price: '129,90€',
            period: '/mes',
            description: 'Solución completa para cadenas y grandes establecimientos',
            features: [
                'Todo en Premium',
                'Múltiples ubicaciones',
                'API de integración',
                'Gestor de cuenta dedicado',
                'Informes personalizados',
                'Soporte prioritario 24/7',
            ],
        },
    ];

    return (
        <>
            <Head title="Planes y Tarifas - DescubreSanlúcar" />

            <div className="page-root">
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
                            <div key={plan.id} className={`pricing-card${plan.highlighted ? ' highlighted' : ''}`}>
                                {plan.badge && <span className="pricing-badge">{plan.badge}</span>}
                                <h2 className="pricing-name">{plan.name}</h2>
                                <div className="pricing-price">
                                    {plan.price}
                                    <span className="pricing-period">{plan.period}</span>
                                </div>
                                <p className="pricing-description">{plan.description}</p>
                                <ul className="pricing-features">
                                    {plan.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                                <Link href="/register" className="pricing-cta">
                                    {plan.cta || 'Contratar Plan'}
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="pricing-faq">
                        <h2>Preguntas frecuentes</h2>
                        <div className="pricing-faq-grid">
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
            </div>
        </>
    );
}