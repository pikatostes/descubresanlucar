import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import { getCategoryColor } from '@/utils/filterUtils';
import { useLike } from '@/hooks/useLike';

export default function PlaceShow({ auth, place }) {
    const bgColor = getCategoryColor(place.category);
    const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(place.rating || 0));
    const mainImage = place.image ?? place.images?.[0]?.url ?? null;
    const [galleryIndex, setGalleryIndex] = useState(0);
    const { liked, count, toggle } = useLike(place.id, place.is_liked ?? false, place.likes_count ?? 0);

    const galleryImages = place.gallery ?? [];

    const goToPreviousImage = () => {
        setGalleryIndex((currentIndex) => {
            if (galleryImages.length === 0) {
                return 0;
            }

            return (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        });
    };

    const goToNextImage = () => {
        setGalleryIndex((currentIndex) => {
            if (galleryImages.length === 0) {
                return 0;
            }

            return (currentIndex + 1) % galleryImages.length;
        });
    };

    return (
        <>
            <Head title={`${place.name}`} />

            <div className="page-root">
                <Navbar auth={auth} />

                <main className="place-show">

                    {/* ── HERO ── */}
                    <section
                        className="place-hero"
                        style={{
                            backgroundImage: mainImage ? `url(${mainImage})` : 'none',
                            backgroundColor: mainImage ? undefined : bgColor,
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
                                {place.hours && <span>🕐 {place.hours}</span>}
                            </div>

                            {place.rating != null && (
                                <div className="place-hero__rating">
                                    {stars.map((filled, i) => (
                                        <span key={i} className={`star ${filled ? 'star--filled' : ''}`}>★</span>
                                    ))}
                                    <span className="rating-value">{Number(place.rating).toFixed(1)}</span>
                                </div>
                            )}

                            <button 
                                className={`place-hero__like-btn ${liked ? 'liked' : ''}`}
                                onClick={toggle}
                                aria-label={liked ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                            >
                                <svg 
                                    className="heart-icon" 
                                    viewBox="0 0 24 24" 
                                    fill={liked ? '#e74c3c' : 'none'}
                                    stroke={liked ? '#e74c3c' : '#fff'}
                                    strokeWidth="2"
                                >
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                                <span>{liked ? 'Guardado' : 'Guardar'}</span>
                                {count > 0 && <span className="like-count">{count}</span>}
                            </button>
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

{galleryImages.length > 0 && (
                                <section className="place-section">
                                    <h2 className="place-section__title">Galería</h2>

                                    <div className="place-gallery-carousel">
                                        <div className="place-gallery-carousel__main">
                                            <img
                                                src={galleryImages[galleryIndex]}
                                                alt={`${place.name} ${galleryIndex + 1}`}
                                                loading="lazy"
                                                className="place-gallery-carousel__image"
                                                key={galleryIndex}
                                            />
                                            <button
                                                type="button"
                                                className="place-gallery-carousel__arrow place-gallery-carousel__arrow--prev"
                                                onClick={goToPreviousImage}
                                                aria-label="Imagen anterior"
                                            />
                                            <button
                                                type="button"
                                                className="place-gallery-carousel__arrow place-gallery-carousel__arrow--next"
                                                onClick={goToNextImage}
                                                aria-label="Imagen siguiente"
                                            />
                                            <div className="place-gallery-carousel__counter">
                                                {galleryIndex + 1} / {galleryImages.length}
                                            </div>
                                        </div>

                                        {galleryImages.length > 1 && (
                                            <div className="place-gallery-carousel__thumbnails">
                                                {galleryImages.map((img, i) => (
                                                    <button
                                                        key={i}
                                                        type="button"
                                                        className={`place-gallery-carousel__thumb ${galleryIndex === i ? 'is-active' : ''}`}
                                                        onClick={() => setGalleryIndex(i)}
                                                    >
                                                        <img src={img} alt="" loading="lazy" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
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
                                {place.tags && place.tags.length > 0 && (
                                    <section className="place-section">
                                        <div className="place-tags">
                                            {place.tags.map((tag) => (
                                                <span key={tag.id || tag.name} className="tag">
                                                    {typeof tag === 'object' ? tag.name : tag}
                                                </span>
                                            ))}
                                        </div>
                                    </section>
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
