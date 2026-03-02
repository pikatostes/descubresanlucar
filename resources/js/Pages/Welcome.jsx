import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';
import HeroSection from '../Components/HeroSection';
import CategoryMenu from '../Components/CategoryMenu';
import FilterBar from '../Components/FilterBar';
import PlaceCard from '../Components/PlaceCard';
import OwnerCTA from '../Components/OwnerCTA';
import { MOCK_PLACES } from '../data/Placesdata';
import { filterAndSortPlaces } from '../utils/FilterUtils';
import '../../css/Welcome.css';

/**
 * Welcome - Página de inicio
 *
 * Props (via Inertia desde Laravel):
 * @param {Object} auth - Usuario autenticado
 * @param {Array}  places - Establecimientos desde la BD (cuando exista el controlador)
 */
export default function Welcome({ auth, places = MOCK_PLACES }) {
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState('relevance');
    const [search, setSearch] = useState('');

    const filteredPlaces = useMemo(
        () => filterAndSortPlaces(places, activeCategory, sortBy, search),
        [places, activeCategory, sortBy, search]
    );

    return (
        <>
            <Head title="Descubre Ciudad - Guía de lugares de interés" />

            <div className="page-root">
                <Navbar auth={auth} />

                <HeroSection
                    searchValue={search}
                    onSearchChange={setSearch}
                    onSearch={setSearch}
                />

                {/* Menú de categorías */}
                <CategoryMenu
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />

                {/* Listado principal */}
                <section className="places-section">
                    <div className="container">
                        <FilterBar
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                            totalResults={filteredPlaces.length}
                            activeCategory={activeCategory}
                        />

                        {filteredPlaces.length > 0 ? (
                            <div className="places-grid">
                                {filteredPlaces.map((place) => (
                                    <PlaceCard key={place.id} place={place} />
                                ))}
                            </div>
                        ) : (
                            <div className="empty-state">
                                <span className="empty-icon">🔍</span>
                                <h3>No encontramos resultados</h3>
                                <p>Prueba con otros términos o cambia la categoría.</p>
                                <button
                                    className="btn-primary"
                                    onClick={() => {
                                        setSearch('');
                                        setActiveCategory('all');
                                    }}
                                >
                                    Ver todos los lugares
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA propietarios */}
                <OwnerCTA />

                <Footer
                    sections={[
                        {
                            title: 'Explorar',
                            links: [
                                { label: 'Todos los lugares', href: '/lugares' },
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