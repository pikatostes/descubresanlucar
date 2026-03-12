import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';
import PlaceCard from '../Components/PlaceCard';
import '../../css/Explore.css';

export default function Explore({ auth, categories = [], places = [], selectedCategory = null }) {
    const [openCategories, setOpenCategories] = useState([]);

    useEffect(() => {
        if (selectedCategory) {
            setOpenCategories(prev => 
                prev.includes(selectedCategory) ? prev : [...prev, selectedCategory]
            );
        }
    }, [selectedCategory]);

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
        window.location.href = '/explorar';
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
                            {/* Columna izquierda - Categorías con tags */}
                            <aside className="explore-sidebar">
                                <div className="categories-panel">
                                    <h2 className="panel-title">Categorías</h2>
                                    
                                    {categories.length === 0 ? (
                                        <p className="no-categories">No hay categorías disponibles</p>
                                    ) : (
                                        <div className="categories-list">
                                            {categories.map(category => (
                                                <div key={category.id} className="category-item">
                                                    <Link 
                                                        href={`/explorar?category=${category.id}`}
                                                        className={`category-header ${selectedCategory === category.id ? 'active' : ''}`}
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
                                                                    href={`/explorar?category=${category.id}`}
                                                                    className="tag-button"
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
