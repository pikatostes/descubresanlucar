import { Head, Link } from '@inertiajs/react';
import MainLayout from '../Layouts/MainLayout';

export default function Terminos({ auth }) {
    return (
        <MainLayout>
            <Head title="Términos de Uso" />

            <div className="page-root">
                <main className="legal-page">
                    <div className="legal-inner">
                        <Link href="/" className="legal-back">← Volver al inicio</Link>

                        <header className="legal-header">
                            <h1 className="legal-title">Términos de Uso</h1>
                            <p className="legal-subtitle">
                                Al acceder y utilizar DescubreSanlúcar aceptas los siguientes
                                términos y condiciones. Por favor, léelos detenidamente.
                            </p>
                            <p className="legal-last-updated">Última actualización: Marzo 2026</p>
                        </header>

                        <div className="legal-content">
                            <section className="legal-section">
                                <h2>1. Aceptación de los términos</h2>
                                <p>
                                    Al acceder a DescubreSanlúcar, aceptas cumplir con estos términos
                                    de uso, todas las leyes y regulaciones aplicables. Si no estás de
                                    acuerdo con alguno de estos términos, no debes utilizar este servicio.
                                </p>
                            </section>

                            <section className="legal-section">
                                <h2>2. Descripción del servicio</h2>
                                <p>
                                    DescubreSanlúcar es una plataforma de descubrimiento local que
                                    permite a los usuarios explorar establecimientos, dejar valoraciones
                                    y comentarios, y a los propietarios registrar y gestionar sus negocios.
                                </p>
                            </section>

                            <section className="legal-section">
                                <h2>3. Registro y cuentas de usuario</h2>
                                <ul>
                                    <li>Debes proporcionar información veraz y actualizada al registrarte</li>
                                    <li>Eres responsable de mantener la confidencialidad de tu contraseña</li>
                                    <li>Debes notificarnos inmediatamente sobre cualquier uso no autorizado de tu cuenta</li>
                                    <li>No puedes crear múltiples cuentas ni suplantar la identidad de otros</li>
                                </ul>
                            </section>

                            <section className="legal-section">
                                <h2>4. Contenido del usuario</h2>
                                <p>
                                    Al publicar valoraciones, comentarios u otro contenido en la plataforma:
                                </p>
                                <ul>
                                    <li>Garantizas que eres el autor del contenido y tienes derecho a publicarlo</li>
                                    <li>Otorgas a DescubreSanlúcar una licencia no exclusiva para mostrar dicho contenido</li>
                                    <li>No debes publicar contenido difamatorio, ofensivo, falso o engañoso</li>
                                    <li>Nos reservamos el derecho de eliminar contenido que viole estos términos</li>
                                </ul>
                            </section>

                            <section className="legal-section">
                                <h2>5. Propiedad intelectual</h2>
                                <p>
                                    Todo el contenido de la plataforma — incluyendo diseño, logotipos,
                                    código fuente y textos — es propiedad de DescubreSanlúcar o de sus
                                    licenciantes y está protegido por las leyes de propiedad intelectual.
                                </p>
                            </section>

                            <section className="legal-section">
                                <h2>6. Conducta del usuario</h2>
                                <p>Al utilizar la plataforma te comprometes a no:</p>
                                <ul>
                                    <li>Utilizar la plataforma para fines ilegales o no autorizados</li>
                                    <li>Interferir con el funcionamiento normal del servicio</li>
                                    <li>Intentar acceder a cuentas de otros usuarios</li>
                                    <li>Enviar spam, publicidad no solicitada o contenido malicioso</li>
                                    <li>Extraer datos de la plataforma mediante técnicas de scraping</li>
                                </ul>
                            </section>

                            <section className="legal-section">
                                <h2>7. Limitación de responsabilidad</h2>
                                <p>
                                    DescubreSanlúcar no se hace responsable de la exactitud de la
                                    información proporcionada por los establecimientos o usuarios.
                                    El servicio se ofrece "tal cual" sin garantías de ningún tipo.
                                </p>
                            </section>

                            <section className="legal-section">
                                <h2>8. Modificaciones</h2>
                                <p>
                                    Nos reservamos el derecho de modificar estos términos en cualquier
                                    momento. Los cambios entrarán en vigor desde su publicación en esta
                                    página. El uso continuado de la plataforma constituye la aceptación
                                    de los términos modificados.
                                </p>
                            </section>

                            <section className="legal-section">
                                <h2>9. Ley aplicable</h2>
                                <p>
                                    Estos términos se rigen por la legislación española. Cualquier
                                    disputa será resuelta por los tribunales competentes de Sanlúcar
                                    de Barrameda, Cádiz.
                                </p>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </MainLayout>
    );
}