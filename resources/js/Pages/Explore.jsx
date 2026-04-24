import { Head, Link } from '@inertiajs/react';
import { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import PlaceCard from '../Components/PlaceCard';
import ExploreSearchBar from '../Components/ExploreSearchBar';

export default function Explore({ auth, categories = [], places = [], selectedCategory = null, search = '' }) {
    const [openCategories, setOpenCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(selectedCategory);
    const [activeTag, setActiveTag] = useState(() => {
        if (typeof window === 'undefined') {
            return null;
        }

        const tagParam = new URLSearchParams(window.location.search).get('tag');
        return tagParam ? Number(tagParam) : null;
    });
    const [searchText, setSearchText] = useState(search.trim());
    const [debouncedSearch, setDebouncedSearch] = useState(search.trim());
    const [isSearching, setIsSearching] = useState(false);
    const [searchStatus, setSearchStatus] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);
    const [visibleCount, setVisibleCount] = useState(9);
    const loadMoreRef = useRef(null);

    const activeTagLabel = useMemo(() => {
        if (!activeTag) {
            return null;
        }

        for (const category of categories) {
            const matchedTag = category.tags?.find((tag) => Number(tag.id) === Number(activeTag));
            if (matchedTag) {
                return matchedTag.name;
            }
        }

        return null;
    }, [categories, activeTag]);

    const filteredPlaces = useMemo(() => {
        const normalizedSearch = debouncedSearch.toLowerCase();

        return places.filter((place) => {
            const placeCategoryId = place.category_id ?? place.category?.id ?? null;
            const matchesCategory = activeCategory ? Number(placeCategoryId) === Number(activeCategory) : true;

            const placeName = (place.name || '').toLowerCase();
            const matchesSearch = normalizedSearch ? placeName.includes(normalizedSearch) : true;

            const placeTags = Array.isArray(place.tags) ? place.tags : [];
            const matchesTag = activeTag
                ? placeTags.some((tag) => Number(typeof tag === 'object' ? tag.id : tag) === Number(activeTag))
                : true;

            return matchesCategory && matchesSearch && matchesTag;
        });
    }, [places, activeCategory, debouncedSearch, activeTag]);

    const visiblePlaces = useMemo(
        () => filteredPlaces.slice(0, visibleCount),
        [filteredPlaces, visibleCount]
    );

    const hasMorePlaces = visibleCount < filteredPlaces.length;

    useEffect(() => {
        if (activeCategory) {
            setOpenCategories(prev =>
                prev.includes(activeCategory) ? prev : [...prev, activeCategory]
            );
        }
    }, [activeCategory]);

    useEffect(() => {
        setSearchText(search.trim());
        setDebouncedSearch(search.trim());
        setActiveCategory(selectedCategory);
    }, [search, selectedCategory]);

    useEffect(() => {
        if (!activeTag || !activeCategory) {
            return;
        }

        const currentCategory = categories.find((category) => Number(category.id) === Number(activeCategory));
        const hasActiveTagInCategory = currentCategory?.tags?.some((tag) => Number(tag.id) === Number(activeTag));

        if (!hasActiveTagInCategory) {
            setActiveTag(null);
        }
    }, [categories, activeCategory, activeTag]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 900px)');

        function handleMediaChange(event) {
            setIsMobile(event.matches);
            setIsSidebarVisible(!event.matches);
        }

        setIsMobile(mediaQuery.matches);
        setIsSidebarVisible(!mediaQuery.matches);

        mediaQuery.addEventListener('change', handleMediaChange);

        return () => {
            mediaQuery.removeEventListener('change', handleMediaChange);
        };
    }, []);

    useEffect(() => {
        setIsSearching(true);

        const debounceTimer = setTimeout(() => {
            setDebouncedSearch(searchText.trim());
            setIsSearching(false);
        }, 250);

        return () => {
            clearTimeout(debounceTimer);
        };
    }, [searchText]);

    useEffect(() => {
        setVisibleCount(9);
    }, [activeCategory, activeTag, debouncedSearch]);

    useEffect(() => {
        if (!hasMorePlaces || !loadMoreRef.current) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting) {
                    setVisibleCount((prev) => prev + 9);
                }
            },
            { rootMargin: '200px 0px' }
        );

        observer.observe(loadMoreRef.current);

        return () => observer.disconnect();
    }, [hasMorePlaces]);

    useEffect(() => {
        if (isSearching) {
            return;
        }

        if (!debouncedSearch) {
            setSearchStatus('');
            return;
        }

        setSearchStatus(`${filteredPlaces.length} resultado${filteredPlaces.length !== 1 ? 's' : ''} para "${debouncedSearch}".`);
    }, [isSearching, debouncedSearch, filteredPlaces.length]);

    useEffect(() => {
        const params = new URLSearchParams();
        const currentSearch = searchText.trim();
        const currentCategory = categories.find((category) => Number(category.id) === Number(activeCategory));

        if (currentCategory?.slug) {
            params.set('categoria', currentCategory.slug);
        }

        if (activeTag) {
            params.set('tag', activeTag);
        }

        if (currentSearch) {
            params.set('search', currentSearch);
        }

        const query = params.toString();
        const nextUrl = query ? `/explorar?${query}` : '/explorar';
        window.history.replaceState({}, '', nextUrl);
    }, [activeCategory, activeTag, categories, searchText]);

    function handleSelectCategory(categoryId) {
        const isSameCategory = Number(activeCategory) === Number(categoryId);
        setActiveCategory(isSameCategory ? null : categoryId);
        setActiveTag(null);
        if (isMobile) {
            setIsSidebarVisible(false);
        }
    }

    function handleSelectTag(tagId, categoryId) {
        setActiveCategory(categoryId);
        setActiveTag((prev) => (Number(prev) === Number(tagId) ? null : tagId));
        if (isMobile) {
            setIsSidebarVisible(false);
        }
    }

    function toggleCategory(e, categoryId) {
        e.preventDefault();
        e.stopPropagation();
        setOpenCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    }

    function handleClearFilter(e) {
        e.preventDefault();
        setActiveCategory(null);
        setActiveTag(null);
    }

    function handleClearSearch() {
        setSearchText('');
        setSearchStatus('');
    }

    return (
        <>
            <Head title="DescubreSanlúcar — Explorar" />

            <div className="page-root">
                <Navbar auth={auth} />

                <main className="explore-page">
                    <div className="container">
                        {/* Header */}
                        <div className="explore-header">
                            <Link href="/" className="explore-back">
                                ← Volver al inicio
                            </Link>
                            <h1 className="explore-title">Explorar</h1>
                            <p className="explore-subtitle">
                                Descubre lugares por categoría y etiquetas
                            </p>
                        </div>

                        {/* Grid 30% - 70% */}
                        <div className="explore-grid">
                            {isMobile && (
                                <button
                                    type="button"
                                    onClick={() => setIsSidebarVisible((prev) => !prev)}
                                    className={`explore-sidebar-toggle ${isSidebarVisible ? 'is-open' : ''}`}
                                    aria-label="Mostrar u ocultar categorías"
                                >
                                    ☰
                                </button>
                            )}

                            {isMobile && (
                                <button
                                    type="button"
                                    className={`explore-sidebar-overlay ${isSidebarVisible ? 'is-visible' : ''}`}
                                    onClick={() => setIsSidebarVisible(false)}
                                    aria-label="Cerrar categorías"
                                />
                            )}

                            {/* Columna izquierda - Categorías con tags */}
                            <aside className={`explore-sidebar ${isMobile ? 'is-mobile' : ''} ${isSidebarVisible ? 'is-open' : ''}`}>
                                <div className="categories-panel">
                                    <div className="panel-header">
                                        <h2 className="panel-title">Categorías</h2>
                                        {isMobile && (
                                            <button
                                                type="button"
                                                className="panel-close"
                                                onClick={() => setIsSidebarVisible(false)}
                                                aria-label="Cerrar categorías"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>

                                    {categories.length === 0 ? (
                                        <p className="no-categories">No hay categorías disponibles</p>
                                    ) : (
                                        <div className="categories-list">
                                            {categories.map(category => (
                                                    <div key={category.id} className="category-item">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleSelectCategory(category.id)}
                                                        className={`category-header ${Number(activeCategory) === Number(category.id) ? 'active' : ''}`}
                                                    >
                                                        <span className="category-icon">{category.icon}</span>
                                                        <span className="category-name">{category.label}</span>
                                                        {category.tags && category.tags.length > 0 && (
                                                            <span
                                                                className={`category-arrow ${openCategories.includes(category.id) ? 'open' : ''}`}
                                                                onClick={(e) => toggleCategory(e, category.id)}
                                                            >
                                                                ▼
                                                            </span>
                                                        )}
                                                    </button>

                                                    {category.tags && category.tags.length > 0 && openCategories.includes(category.id) && (
                                                        <div className="tags-dropdown">
                                                            {category.tags.map(tag => (
                                                                <button
                                                                    type="button"
                                                                    key={tag.id}
                                                                    className={`tag-button ${Number(activeTag) === Number(tag.id) ? 'active' : ''}`}
                                                                    onClick={() => handleSelectTag(tag.id, category.id)}
                                                                >
                                                                    {tag.name}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </aside>

                            {/* Columna derecha - Lugares */}
                            <div className="explore-results">
                                <ExploreSearchBar
                                    value={searchText}
                                    onChange={setSearchText}
                                    onClear={handleClearSearch}
                                    isSearching={isSearching}
                                    statusText={searchStatus}
                                />

                                {filteredPlaces.length > 0 ? (
                                    <>
                                        <div className="results-header">
                                            <h2 className="results-title">
                                                {activeTagLabel
                                                    ? `Tag: ${activeTagLabel}`
                                                    : activeCategory
                                                    ? categories.find(c => Number(c.id) === Number(activeCategory))?.label || 'Lugares'
                                                    : 'Todos los lugares'
                                                }
                                            </h2>
                                            <div className="results-actions">
                                                {(activeCategory || activeTag) && (
                                                    <button type="button" onClick={handleClearFilter} className="clear-filter">
                                                        ✕ Limpiar
                                                    </button>
                                                )}
                                                <span className="results-count">
                                                    {filteredPlaces.length} lugar{filteredPlaces.length !== 1 ? 'es' : ''}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="places-grid">
                                            {visiblePlaces.map(place => (
                                                <PlaceCard key={place.id} place={place} />
                                            ))}
                                        </div>
                                        {hasMorePlaces && <div ref={loadMoreRef} className="places-lazy-trigger" aria-hidden="true" />}
                                    </>
                                ) : (
                                    <>
                                        <div className="results-header">
                                            <h2 className="results-title">Resultados</h2>
                                        </div>

                                        <div className="no-results">
                                            <span className="empty-icon">🔍</span>
                                            <h3>No se encontraron lugares</h3>
                                            <p>Prueba con otros filtros o busca por otro nombre</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </main>

                <Footer
                    sections={[
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
                                { label: 'Planes y Tarifas', href: '/precios' },
                                { label: 'Contacto', href: '/contacto' },
                            ],
                        },
                    ]}
                />
            </div>
        </>
    );
}
