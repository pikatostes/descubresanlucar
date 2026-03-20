import { Head, Link, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import PlaceCard from '../Components/PlaceCard';
import ExploreSearchBar from '../Components/ExploreSearchBar';
import '../../css/Explore.css';

export default function Explore({ auth, categories = [], places = [], selectedCategory = null, search = '' }) {
    const [openCategories, setOpenCategories] = useState([]);
    const [searchText, setSearchText] = useState(search);
    const [isSearching, setIsSearching] = useState(false);
    const [searchStatus, setSearchStatus] = useState('');
    const [isMobile, setIsMobile] = useState(false);
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    useEffect(() => {
        if (selectedCategory) {
            setOpenCategories(prev =>
                prev.includes(selectedCategory) ? prev : [...prev, selectedCategory]
            );
        }
    }, [selectedCategory]);

    useEffect(() => {
        setSearchText(search);
    }, [search]);

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
        const normalizedText = searchText.trim();

        if (normalizedText === search) {
            return;
        }

        setIsSearching(true);

        const debounceTimer = setTimeout(() => {
            router.get(
                '/explorar',
                {
                    category: selectedCategory || undefined,
                    search: normalizedText || undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['places', 'selectedCategory', 'search'],
                    onFinish: () => setIsSearching(false),
                    onError: () => {
                        setSearchStatus('No se pudo actualizar la búsqueda. Intenta de nuevo.');
                    },
                }
            );
        }, 350);

        return () => {
            clearTimeout(debounceTimer);
        };
    }, [searchText, search, selectedCategory]);

    useEffect(() => {
        if (isSearching) {
            return;
        }

        if (!search) {
            setSearchStatus('');
            return;
        }

        setSearchStatus(`${places.length} resultado${places.length !== 1 ? 's' : ''} para "${search}".`);
    }, [isSearching, search, places.length]);

    function buildExploreHref(categoryId = null) {
        const params = new URLSearchParams();
        const currentSearch = searchText.trim();

        if (categoryId) {
            params.set('category', categoryId);
        }

        if (currentSearch) {
            params.set('search', currentSearch);
        }

        const query = params.toString();
        return query ? `/explorar?${query}` : '/explorar';
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
        router.get(
            '/explorar',
            {
                search: searchText.trim() || undefined,
            },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            }
        );
    }

    function handleClearSearch() {
        setSearchText('');
        setSearchStatus('');
    }

    return (
        <>
            <Head title="Explorar — DescubreSanlúcar" />

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
                                    className="explore-sidebar-toggle"
                                >
                                    {isSidebarVisible ? 'Ocultar categorías' : 'Mostrar categorías'}
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
                                                    <Link
                                                        href={buildExploreHref(category.id)}
                                                        className={`category-header ${selectedCategory === category.id ? 'active' : ''}`}
                                                        preserveScroll
                                                        preserveState
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
                                                    </Link>

                                                    {category.tags && category.tags.length > 0 && openCategories.includes(category.id) && (
                                                        <div className="tags-dropdown">
                                                            {category.tags.map(tag => (
                                                                <Link
                                                                    key={tag.id}
                                                                    href={buildExploreHref(category.id)}
                                                                    className="tag-button"
                                                                    preserveScroll
                                                                    preserveState
                                                                >
                                                                    {tag.name}
                                                                </Link>
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
                                {places.length > 0 ? (
                                    <>
                                        <div className="results-header">
                                            <h2 className="results-title">
                                                {selectedCategory
                                                    ? categories.find(c => c.id === selectedCategory)?.label || 'Lugares'
                                                    : 'Todos los lugares'
                                                }
                                            </h2>
                                            <div className="results-actions">
                                                {selectedCategory && (
                                                    <button type="button" onClick={handleClearFilter} className="clear-filter">
                                                        ✕ Limpiar
                                                    </button>
                                                )}
                                                <span className="results-count">
                                                    {places.length} lugar{places.length !== 1 ? 'es' : ''}
                                                </span>
                                            </div>
                                        </div>

                                        <ExploreSearchBar
                                            value={searchText}
                                            onChange={setSearchText}
                                            onClear={handleClearSearch}
                                            isSearching={isSearching}
                                            statusText={searchStatus}
                                        />

                                        <div className="places-grid">
                                            {places.map(place => (
                                                <PlaceCard key={place.id} place={place} />
                                            ))}
                                        </div>
                                    </>
                                ) : (
                                    <div className="no-results">
                                        <span className="empty-icon">🔍</span>
                                        <h3>No se encontraron lugares</h3>
                                        <p>Selecciona una categoría para ver los lugares</p>
                                        <button type="button" onClick={handleClearFilter} className="btn-reset">
                                            Ver todos los lugares
                                        </button>
                                    </div>
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
                            ],
                        },
                    ]}
                />
            </div>
        </>
    );
}
