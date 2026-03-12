import { Head, Link } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { getCategoryColor } from '@/utils/filterUtils';
import '../../css/PlaceShow.css';

export default function PlaceShow({ auth, place }) {
    const bgColor = getCategoryColor(place.category);
    const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(place.rating || 0));

    return (
        <>
            <Head title={`${place.name} — DescubreSanlúcar`} />

            <div className="page-root">
                <Navbar auth={auth} />

                <main className="place-show">

                    {/* ── HERO ── */}
                    <section
                        className="place-hero"
                        style={{
                            backgroundImage: place.image ? `url(${place.image})` : 'none',
                            backgroundColor: place.image ? undefined : bgColor,
                        }}
                    >
                        <div className="place-hero__overlay" />

                        <div className="place-hero__content container">
                            <Link href="/" className="place-back">
                                ← Volver a todos los lugares
                            </Link>

                            {place.category && (
                                <span className="place-badge">
                                    {place.category.icon} {place.category.label}
                                </span>
                            )}

                            <h1 className="place-hero__title">{place.name}</h1>

                            <div className="place-hero__meta">
                                {place.address && <span>📍 {place.address}</span>}
                                {place.hours  && <span>🕐 {place.hours}</span>}
                            </div>

                            {place.rating != null && (
                                <div className="place-hero__rating">
                                    {stars.map((filled, i) => (
                                        <span key={i} className={`star ${filled ? 'star--filled' : ''}`}>★</span>
                                    ))}
                                    <span className="rating-value">{Number(place.rating).toFixed(1)}</span>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ── BODY ── */}
                    <div className="place-body container">

                        {/* ── columna principal ── */}
                        <div className="place-main">

                            {place.description && (
                                <section className="place-section">
                                    <h2 className="place-section__title">Sobre el lugar</h2>
                                    <p className="place-section__text">{place.description}</p>
                                </section>
                            )}

                            {/* Google Maps Embed */}
                            {place.address && (
                                <section className="place-section">
                                    <h2 className="place-section__title">Ubicación</h2>
                                    <div className="place-map-embed">
                                        <iframe
                                            width="100%"
                                            height="350"
                                            style={{ border: 0, borderRadius: '8px' }}
                                            loading="lazy"
                                            allowFullScreen
                                            referrerPolicy="no-referrer-when-downgrade"
                                            title={`Mapa de ${place.name}`}
                                            src={`https://maps.google.com/maps?q=${encodeURIComponent(place.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                        />
                                    </div>
                                    <a
                                        className="btn-map mt-3"
                                        href={
                                            place.latitude && place.longitude
                                                ? `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`
                                                : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.address)}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        Cómo llegar
                                    </a>
                                </section>
                            )}

                            {place.tags && place.tags.length > 0 && (
                                <section className="place-section">
                                    <h2 className="place-section__title">Etiquetas</h2>
                                    <div className="place-tags">
                                        {place.tags.map((tag) => (
                                            <span key={tag} className="tag">{tag}</span>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {place.gallery && place.gallery.length > 0 && (
                                <section className="place-section">
                                    <h2 className="place-section__title">Galería</h2>
                                    <div className="place-gallery">
                                        {place.gallery.map((img, i) => (
                                            <div key={i} className="place-gallery__item">
                                                <img src={img} alt={`${place.name} ${i + 1}`} loading="lazy" />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>

                        {/* ── sidebar ── */}
                        <aside className="place-sidebar">
                            <div className="place-infocard">
                                <h3 className="place-infocard__title">Información</h3>

                                {place.address && (
                                    <div className="place-infocard__row">
                                        <span className="info-icon">📍</span>
                                        <span>{place.address}</span>
                                    </div>
                                )}
                                {place.hours && (
                                    <div className="place-infocard__row">
                                        <span className="info-icon">🕐</span>
                                        <span>{place.hours}</span>
                                    </div>
                                )}
                                {place.phone && (
                                    <div className="place-infocard__row">
                                        <span className="info-icon">📞</span>
                                        <a href={`tel:${place.phone}`} className="info-link">{place.phone}</a>
                                    </div>
                                )}
                                {place.email && (
                                    <div className="place-infocard__row">
                                        <span className="info-icon">✉️</span>
                                        <a href={`mailto:${place.email}`} className="info-link">{place.email}</a>
                                    </div>
                                )}
                                {place.website && (
                                    <div className="place-infocard__row">
                                        <span className="info-icon">🌐</span>
                                        <a href={place.website} target="_blank" rel="noopener noreferrer" className="info-link">
                                            Visitar web
                                        </a>
                                    </div>
                                )}
                                {place.price_range && (
                                    <div className="place-infocard__row">
                                        <span className="info-icon">💶</span>
                                        <span className="price-range">{place.price_range}</span>
                                    </div>
                                )}
                            </div>
                        </aside>
                    </div>
                </main>

                <Footer
                    sections={[
                        {
                            title: 'Explorar',
                            links: [
                                { label: 'Todos los lugares', href: '/' },
                                { label: 'Mapa interactivo', href: '/mapa' },
                                { label: 'Destacados', href: '/destacados' },
                            ],
                        },
                        {
                            title: 'Categorías',
                            links: [
                                { label: 'Restaurantes', href: '/categoria/restaurantes' },
                                { label: 'Bares', href: '/categoria/bares' },
                                { label: 'Hoteles', href: '/categoria/hoteles' },
                            ],
                        },
                        {
                            title: 'Propietarios',
                            links: [
                                { label: 'Registrar negocio', href: '/register' },
                                { label: 'Panel de control', href: '/dashboard' },
                                { label: 'Cómo funciona', href: '/como-funciona' },
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
                    ]}
                />
            </div>
        </>
    );
}