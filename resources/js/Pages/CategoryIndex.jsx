import { Head, Link } from '@inertiajs/react';
import Navbar from '../Components/Navbar';
import Footer from '../Components/Footer';

export default function CategoryIndex({ auth, categories = [] }) {
    return (
        <>
            <Head title="Categorías" />

            <div className="page-root">
                <Navbar auth={auth} />

                <main className="categories-page">
                    <div className="container">
                        {/* Header */}
                        <div className="categories-header">
                            <Link href="/" className="categories-back">
                                ← Volver al inicio
                            </Link>
                            <h1 className="categories-title">Categorías</h1>
                            <p className="categories-subtitle">
                                Explora los lugares por categoría
                            </p>
                        </div>

                        {/* Grid de categorías */}
                        {categories.length > 0 ? (
                            <div className="categories-grid">
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={`/explorar?categoria=${category.slug}`}
                                        className="category-card"
                                    >
                                        <span className="category-icon">{category.icon}</span>
                                        <span className="category-label">{category.label}</span>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="categories-empty">
                                <span className="empty-icon">📂</span>
                                <h3>No hay categorías disponibles</h3>
                                <p>Próximamente añadiremos categorías.</p>
                            </div>
                        )}
                    </div>
                </main>

                <Footer
                    sections={[
                        {
                            title: 'Explorar',
                            links: [
                                { label: 'Todos los lugares', href: '/' },
                                { label: 'Categorías', href: '/categorias' },
                                { label: 'Destacados', href: '/destacados' },
                            ],
                        },
{
                            title: 'Legal',
                            links: [
                                { label: 'Privacidad', href: '/privacidad' },
                                { label: 'Términos de uso', href: '/terminos' },
                                { label: 'Aviso Legal', href: '/aviso-legal' },
                                { label: 'Contacto', href: '/contacto' },
                            ],
                        },
                    ]}
                />
            </div>
        </>
    );
}
