import { Head, Link } from '@inertiajs/react';

export default function CategoryIndex({ auth, categories = [] }) {
    return (
        <>
            <Head title="Categorías" />

            <div className="page-root">

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
                                        href={`/explorar/${category.slug}`}
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
            </div>
        </>
    );
}
