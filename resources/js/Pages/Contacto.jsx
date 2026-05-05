import { Head, Link } from '@inertiajs/react';

export default function Contacto({ auth }) {
    return (
        <>
            <Head title="Contacto" />

            <div className="page-root">

                <main className="legal-page">
                    <div className="legal-inner">
                        <Link href="/" className="legal-back">← Volver al inicio</Link>

                        <header className="legal-header">
                            <h1 className="legal-title">Contacto</h1>
                            <p className="legal-subtitle">
                                ¿Tienes preguntas, sugerencias o necesitas ayuda? Estamos aquí para
                                ayudarte. Elige la forma de contacto que prefieras.
                            </p>
                        </header>

                        <div className="legal-content">
                            <section className="legal-section">
                                <h2>Información de contacto</h2>
                                <div className="contact-grid">
                                    <div className="contact-card">
                                        <div className="contact-card-icon">📧</div>
                                        <strong>Correo electrónico</strong>
                                        <a href="mailto:info@descubresanlucar.es">
                                            info@descubresanlucar.es
                                        </a>
                                    </div>
                                    <div className="contact-card">
                                        <div className="contact-card-icon">📍</div>
                                        <strong>Ubicación</strong>
                                        <p>Sanlúcar de Barrameda<br />Cádiz, España</p>
                                    </div>
                                    <div className="contact-card">
                                        <div className="contact-card-icon">🕐</div>
                                        <strong>Horario de atención</strong>
                                        <p>Lunes a viernes<br />9:00 — 18:00</p>
                                    </div>
                                    <div className="contact-card">
                                        <div className="contact-card-icon">🏢</div>
                                        <strong>Para negocios</strong>
                                        <a href="mailto:negocios@descubresanlucar.es">
                                            negocios@descubresanlucar.es
                                        </a>
                                    </div>
                                </div>
                            </section>

                            <section className="legal-section">
                                <div className="contact-form">
                                    <h3 className="contact-form-title">Envíanos un mensaje</h3>
                                    <form>
                                        <div className="form-group">
                                            <label htmlFor="name">Nombre</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                placeholder="Tu nombre"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="email">Correo electrónico</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                placeholder="tu@email.com"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="subject">Asunto</label>
                                            <input
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                placeholder="¿Sobre qué nos escribes?"
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="message">Mensaje</label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                placeholder="Escribe tu mensaje aquí..."
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="form-submit">
                                            <button type="submit" className="btn-primary">
                                                Enviar mensaje
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
