import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import Footer from '../Components/Footer';
import Navbar from '../Components/Navbar';
import HeroSection from '../Components/HeroSection';
import CategoryMenu from '../Components/CategoryMenu';
import FilterBar from '../Components/FilterBar';
import PlaceCard from '../Components/PlaceCard';
import OwnerCTA from '../Components/OwnerCTA';
import { filterAndSortPlaces } from '../utils/FilterUtils';
import '../../css/Welcome.css';

export default function Welcome({ auth, places = [], categories = [] }) {
    const [activeCategory, setActiveCategory] = useState('all');
    const [sortBy, setSortBy] = useState('relevance');
    const [search, setSearch] = useState('');

    const filteredPlaces = useMemo(
        () => filterAndSortPlaces(places, activeCategory, sortBy, search),
        [places, activeCategory, sortBy, search]
    );

    return (
        <>
            <Head title="DescubreSanlúcar - Guía de lugares de interés" />

            <div className="page-root">
                <Navbar auth={auth} />

                <HeroSection
                    searchValue={search}
                    onSearchChange={setSearch}
                    onSearch={setSearch}
                />

                <CategoryMenu
                    categories={categories}
                    activeCategory={activeCategory}
                    onCategoryChange={setActiveCategory}
                />

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