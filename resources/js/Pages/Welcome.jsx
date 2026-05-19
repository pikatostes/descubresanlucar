import { useState, useMemo, useCallback } from 'react';
import { Head, Link } from '@inertiajs/react';
import HeroSection from '../Components/HeroSection';
import CategoryMenu from '../Components/CategoryMenu';
import FilterBar from '../Components/FilterBar';
import PlaceCard from '../Components/PlaceCard';
import OwnerCTA from '../Components/OwnerCTA';
import { filterAndSortPlaces } from '../utils/FilterUtils';

export default function Welcome({ auth, places = [], categories = [] }) {
    const [activeCategory, setActiveCategory] = useState('all');
    const [activeTag, setActiveTag] = useState(null);
    const [sortBy, setSortBy] = useState('relevance');
    const [search, setSearch] = useState('');

    const handleCategoryChange = useCallback((slug) => {
        if (slug !== activeCategory) setActiveTag(null);
        setActiveCategory(slug);
    }, [activeCategory]);

    const handleResetFilters = useCallback(() => {
        setSearch('');
        setActiveCategory('all');
        setActiveTag(null);
    }, []);

    const filteredPlaces = useMemo(
        () => filterAndSortPlaces(places, activeCategory, activeTag, sortBy, search),
        [places, activeCategory, activeTag, sortBy, search],
    );

    const featuredPlaces = useMemo(
        () => places.filter((p) => p.featured).slice(0, 3),
        [places],
    );

    const popularPlaces = useMemo(
        () => [...places].sort((a, b) => (b.likes_count ?? 0) - (a.likes_count ?? 0)).slice(0, 6),
        [places],
    );

    const statsData = useMemo(() => ({
        establishments: places.length,
        categories: categories.length,
        reviews: places.reduce((sum, p) => sum + (p.likes_count ?? 0), 0),
    }), [places, categories]);

    const isFiltering = activeCategory !== 'all' || activeTag !== null || search.trim() !== '';

    return (
        <>
            <Head title="DescubreSanlúcar - Guía de lugares de interés en Sanlúcar de Barrameda">
                <meta
                    name="description"
                    content="Descubre los mejores restaurantes, bares, hoteles y actividades en Sanlúcar de Barrameda. Tu guía local con reseñas, mapas y recomendaciones actualizadas."
                />
                <meta name="keywords" content="Sanlúcar de Barrameda, restaurantes, bares, hoteles, guía local, turismo, gastronomía, Cádiz" />
                <meta property="og:title" content="DescubreSanlúcar - Tu guía local de confianza" />
                <meta
                    property="og:description"
                    content="Explora los mejores establecimientos de Sanlúcar de Barrameda. Restaurantes, bares, hoteles y mucho más."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
                <meta property="og:locale" content="es_ES" />
                <meta name="twitter:card" content="summary_large_image" />
                <link rel="canonical" href="/" />
                <script type="application/ld+json">
                    {JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: 'DescubreSanlúcar',
                        url: '/',
                        description: 'Guía de lugares de interés en Sanlúcar de Barrameda',
                        potentialAction: {
                            '@type': 'SearchAction',
                            target: '/explorar?search={search_term_string}',
                            'query-input': 'required name=search_term_string',
                        },
                    })}
                </script>
            </Head>

            <a href="#main-content" className="skip-link">
                Saltar al contenido principal
            </a>

            <main id="main-content">
                    {/* ═══ HERO ═══ */}
                    <HeroSection
                        searchValue={search}
                        onSearchChange={setSearch}
                        onSearch={setSearch}
                        stats={statsData}
                    />

                    {/* ═══ CATEGORÍAS DESTACADAS (estilo TripAdvisor) ═══ */}
                    {!isFiltering && categories.length > 0 && (
                        <section className="featured-categories" aria-label="Categorías principales">
                            <div className="container">
                                <h2 className="section-title">Explora por categoría</h2>
                                <p className="section-subtitle">
                                    Encuentra justo lo que buscas en Sanlúcar
                                </p>
                                <div className="categories-grid">
                                    {categories.slice(0, 12).map((cat) => (
                                        <Link
                                            key={cat.slug}
                                            href={`/explorar/${cat.slug}`}
                                            className="category-card"
                                        >
                                            <span className="category-card__icon">{cat.icon}</span>
                                            <span className="category-card__label">{cat.label}</span>
                                            <span className="category-card__count">
                                                {places.filter((p) => p.category?.slug === cat.slug).length} lugares
                                            </span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ═══ CÓMO FUNCIONA ═══ */}
                    {!isFiltering && (
                        <section className="how-it-works" aria-label="Cómo funciona">
                            <div className="container">
                                <h2 className="section-title">¿Cómo funciona?</h2>
                                <p className="section-subtitle">
                                    Descubre, valora y apoya los negocios locales en 3 pasos
                                </p>
                                <div className="steps-grid">
                                    {[
                                        {
                                            num: '1',
                                            icon: '🔍',
                                            title: 'Busca y descubre',
                                            desc: 'Explora por categoría, busca por nombre o navega por el mapa para encontrar lo que necesitas.',
                                        },
                                        {
                                            num: '2',
                                            icon: '⭐',
                                            title: 'Lee y valora',
                                            desc: 'Consulta las opiniones de otros visitantes y comparte tu propia experiencia con una reseña.',
                                        },
                                        {
                                            num: '3',
                                            icon: '🤝',
                                            title: 'Visita y apoya',
                                            desc: 'Descubre joyas locales, dales tu apoyo y ayuda a otros a encontrar los mejores sitios.',
                                        },
                                    ].map((step) => (
                                        <div key={step.num} className="step-card">
                                            <div className="step-card__number">{step.num}</div>
                                            <span className="step-card__icon">{step.icon}</span>
                                            <h3 className="step-card__title">{step.title}</h3>
                                            <p className="step-card__desc">{step.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ═══ DESTACADOS ═══ */}
                    {!isFiltering && featuredPlaces.length > 0 && (
                        <section className="featured-section" aria-label="Lugares destacados">
                            <div className="container">
                                <div className="section-header">
                                    <div>
                                        <h2 className="section-title">⭐ Lugares destacados</h2>
                                        <p className="section-subtitle">
                                            Los establecimientos mejor valorados de Sanlúcar
                                        </p>
                                    </div>
                                    <Link href="/destacados" className="btn-ghost">
                                        Ver todos →
                                    </Link>
                                </div>
                                <div className="places-grid">
                                    {featuredPlaces.map((place) => (
                                        <PlaceCard key={place.id} place={place} />
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ═══ MAPA CTA ═══ */}
                    {!isFiltering && (
                        <section className="map-cta" aria-label="Explora el mapa">
                            <div className="container">
                                <div className="map-cta__inner">
                                    <div className="map-cta__content">
                                        <h2 className="map-cta__title">Explora Sanlúcar en el mapa</h2>
                                        <p className="map-cta__text">
                                            Descubre establecimientos cerca de ti con nuestro mapa interactivo.
                                            Filtra por categoría, distancia y valoraciones.
                                        </p>
                                        <Link href="/mapa" className="btn-primary btn-lg">
                                            Abrir mapa interactivo →
                                        </Link>
                                    </div>
                                    <div className="map-cta__visual" aria-hidden="true">
                                        <div className="map-placeholder">
                                            <span className="map-placeholder__icon">🗺️</span>
                                            <span className="map-placeholder__label">Mapa interactivo</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ═══ MÁS POPULARES ═══ */}
                    {!isFiltering && popularPlaces.length > 0 && (
                        <section className="popular-section" aria-label="Lugares más populares">
                            <div className="container">
                                <div className="section-header">
                                    <div>
                                        <h2 className="section-title">🔥 Lo más popular</h2>
                                        <p className="section-subtitle">
                                            Los lugares que más gustan a nuestra comunidad
                                        </p>
                                    </div>
                                </div>
                                <div className="places-grid">
                                    {popularPlaces.map((place) => (
                                        <PlaceCard key={place.id} place={place} />
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ═══ LISTADO COMPLETO CON FILTROS ═══ */}
                    <section className="places-section" aria-label="Todos los establecimientos">
                        <div className="container">
                            <h2 className="section-title">
                                {isFiltering
                                    ? 'Resultados de tu búsqueda'
                                    : 'Todos los establecimientos'}
                            </h2>

                            <CategoryMenu
                                categories={categories}
                                activeCategory={activeCategory}
                                activeTag={activeTag}
                                onCategoryChange={handleCategoryChange}
                                onTagChange={setActiveTag}
                            />

                            <FilterBar
                                sortBy={sortBy}
                                onSortChange={setSortBy}
                                totalResults={filteredPlaces.length}
                                activeCategory={activeCategory}
                                activeTag={activeTag}
                                onClearTag={() => setActiveTag(null)}
                            />

                            {filteredPlaces.length > 0 ? (
                                <div className="places-grid">
                                    {filteredPlaces.map((place) => (
                                        <PlaceCard key={place.id} place={place} />
                                    ))}
                                </div>
                            ) : (
                                <div className="empty-state" role="status">
                                    <span className="empty-icon" aria-hidden="true">🔍</span>
                                    <h3>No encontramos resultados</h3>
                                    <p>Prueba con otros términos o cambia la categoría.</p>
                                    <button
                                        type="button"
                                        className="btn-primary"
                                        onClick={handleResetFilters}
                                    >
                                        Ver todos los lugares
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ═══ TESTIMONIOS ═══ */}
                    {!isFiltering && (
                        <section className="testimonials-section" aria-label="Opiniones de usuarios">
                            <div className="container">
                                <h2 className="section-title">Lo que dice nuestra comunidad</h2>
                                <p className="section-subtitle">
                                    Opiniones reales de personas que descubrieron Sanlúcar con nosotros
                                </p>
                                <div className="testimonials-grid">
                                    {[
                                        {
                                            name: 'María G.',
                                            avatar: '👩',
                                            text: 'Gracias a DescubreSanlúcar encontré el mejor chiringuito de la playa. ¡La tortillita de camarones es increíble!',
                                            rating: 5,
                                        },
                                        {
                                            name: 'Antonio R.',
                                            avatar: '👨',
                                            text: 'Perfecto para descubrir rincones que no conocía. El mapa interactivo es muy útil cuando vienes de fuera.',
                                            rating: 5,
                                        },
                                        {
                                            name: 'Laura P.',
                                            avatar: '👩‍🦰',
                                            text: 'Registré mi restaurante y en una semana ya tenía más visitas. La gestión es muy sencilla e intuitiva.',
                                            rating: 5,
                                        },
                                    ].map((t, i) => (
                                        <article key={i} className="testimonial-card">
                                            <div className="testimonial-card__stars" aria-label={`${t.rating} de 5 estrellas`}>
                                                {'★'.repeat(t.rating)}
                                            </div>
                                            <blockquote className="testimonial-card__text">
                                                "{t.text}"
                                            </blockquote>
                                            <div className="testimonial-card__author">
                                                <span className="testimonial-card__avatar">{t.avatar}</span>
                                                <span className="testimonial-card__name">{t.name}</span>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}

                    {/* ═══ OWNER CTA ═══ */}
                    <OwnerCTA />
                </main>
        </>
    );
}
