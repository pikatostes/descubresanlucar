import { Head, Link } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

export default function Privacidad({ auth }) {
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
                { label: 'Contacto', href: '/contacto' },
            ],
        },
    ];

    return (
        <>
            <Head title="Política de Privacidad" />

            <div className="page-root">
                <Navbar auth={auth} />

                <main className="legal-page">
                    <div className="legal-inner">
                        <Link href="/" className="legal-back">← Volver al inicio</Link>

                        <header className="legal-header">
                            <h1 className="legal-title">Política de Privacidad</h1>
                            <p className="legal-subtitle">
                                En DescubreSanlúcar nos comprometemos a proteger tu información personal.
                                En esta política explicamos qué datos recopilamos y cómo los utilizamos.
                            </p>
                            <p className="legal-last-updated">Última actualización: Marzo 2026</p>
                        </header>

                        <div className="legal-content">
                            <section className="legal-section">
                                <h2>1. Información que recopilamos</h2>
                                <p>
                                    Recopilamos la información que nos proporcionas directamente al
                                    registrarte, crear un perfil o interactuar con la plataforma.
                                </p>
                                <ul>
                                    <li>Nombre, dirección de correo electrónico y contraseña al crear una cuenta</li>
                                    <li>Información de perfil opcional como biografía, foto de avatar o ubicación</li>
                                    <li>Datos de interacción: valoraciones, comentarios y lugares favoritos</li>
                                    <li>Información técnica: dirección IP, tipo de navegador y páginas visitadas</li>
                                </ul>
                            </section>

                            <section className="legal-section">
                                <h2>2. Cómo utilizamos tu información</h2>
                                <p>Utilizamos los datos recopilados para los siguientes propósitos:</p>
                                <ul>
                                    <li>Gestionar tu cuenta y proporcionarte acceso a la plataforma</li>
                                    <li>Mostrar contenido personalizado según tus preferencias y ubicación</li>
                                    <li>Mejorar nuestros servicios, funcionalidades y experiencia de usuario</li>
                                    <li>Enviarte comunicaciones relacionadas con tu cuenta o el servicio</li>
                                    <li>Detectar y prevenir actividades fraudulentas o abusivas</li>
                                </ul>
                            </section>

                            <section className="legal-section">
                                <h2>3. Compartir información con terceros</h2>
                                <p>
                                    No vendemos ni alquilamos tu información personal a terceros.
                                    Podemos compartir datos únicamente en las siguientes situaciones:
                                </p>
                                <ul>
                                    <li>Con proveedores de servicios que nos ayudan a operar la plataforma (alojamiento, analíticas)</li>
                                    <li>Cuando sea requerido por ley o para proteger nuestros derechos legales</li>
                                    <li>Con tu consentimiento explícito para usos específicos</li>
                                </ul>
                            </section>

                            <section className="legal-section">
                                <h2>4. Cookies y tecnologías de seguimiento</h2>
                                <p>
                                    Utilizamos cookies y tecnologías similares para mejorar tu experiencia,
                                    recordar tus preferencias y analizar el uso de la plataforma. Puedes
                                    gestionar las cookies desde la configuración de tu navegador.
                                </p>
                            </section>

                            <section className="legal-section">
                                <h2>5. Seguridad de los datos</h2>
                                <p>
                                    Implementamos medidas de seguridad técnicas y organizativas para
                                    proteger tu información personal contra accesos no autorizados,
                                    alteraciones, divulgaciones o destrucción.
                                </p>
                            </section>

                            <section className="legal-section">
                                <h2>6. Tus derechos</h2>
                                <p>Tienes derecho a:</p>
                                <ul>
                                    <li>Acceder a tus datos personales y obtener una copia de los mismos</li>
                                    <li>Rectificar datos inexactos o incompletos</li>
                                    <li>Solicitar la eliminación de tu cuenta y datos personales</li>
                                    <li>Oponerte al tratamiento de tus datos para determinados fines</li>
                                    <li>Portar tus datos a otro servicio</li>
                                </ul>
                            </section>

                            <section className="legal-section">
                                <h2>7. Contacto</h2>
                                <p>
                                    Si tienes preguntas sobre esta política de privacidad o deseas ejercer
                                    tus derechos, puedes contactarnos a través de{' '}
                                    <Link href="/contacto" style={{ color: 'var(--terracotta)', fontWeight: 700 }}>
                                        nuestra página de contacto
                                    </Link>.
                                </p>
                            </section>
                        </div>
                    </div>
                </main>

                <Footer sections={footerSections} />
            </div>
        </>
    );
}
