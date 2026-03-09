import { useState, useRef, useEffect } from 'react';
// import '../../css/tags.css'

/**
 * CategoryMenu
 *
 * Props nuevas respecto a la versión anterior:
 *  - activeTag: string | null
 *  - onTagChange: (slug: string | null) => void
 *
 * Cada categoría puede tener tags: [{ id, slug, label }]
 * Si una categoría tiene etiquetas, el botón muestra un chevron
 * y al pulsarlo se despliega el listado de etiquetas.
 */
export default function CategoryMenu({
    categories = [],
    activeCategory,
    activeTag,
    onCategoryChange,
    onTagChange,
}) {
    const [openCategory, setOpenCategory] = useState(null);
    const menuRef = useRef(null);

    // Cerrar desplegable al hacer clic fuera del menú
    useEffect(() => {
        function handleOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenCategory(null);
            }
        }
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, []);

    const allCategories = [
        { id: 'all', slug: 'all', label: 'Todos', icon: '🏙️', tags: [] },
        ...categories.map((cat) => ({ ...cat, id: cat.slug })),
    ];

    function handleCategoryClick(slug) {
        if (slug === 'all') {
            onCategoryChange('all');
            onTagChange(null);
            setOpenCategory(null);
            return;
        }

        // Activar la categoría siempre
        onCategoryChange(slug);

        const cat = allCategories.find((c) => c.slug === slug);
        const hasTags = cat?.tags?.length > 0;

        if (hasTags) {
            // Alternar el desplegable; si ya estaba abierto, lo cierra
            setOpenCategory((prev) => (prev === slug ? null : slug));
        } else {
            onTagChange(null);
            setOpenCategory(null);
        }
    }

    function handleTagClick(e, tagSlug) {
        e.stopPropagation();
        // Pulsar la etiqueta activa la deselecciona
        onTagChange(activeTag === tagSlug ? null : tagSlug);
        setOpenCategory(null);
    }

    return (
        <div className="category-menu" ref={menuRef}>
            <div className="category-menu-inner">
                {allCategories.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    const isOpen   = openCategory === cat.slug;
                    const hasTags  = cat.tags?.length > 0;

                    return (
                        <div key={cat.id} className="category-menu__item">
                            <button
                                className={`category-pill ${isActive ? 'active' : ''}`}
                                onClick={() => handleCategoryClick(cat.slug)}
                                aria-pressed={isActive}
                                aria-expanded={hasTags ? isOpen : undefined}
                            >
                                <span className="cat-icon">{cat.icon}</span>
                                <span className="cat-label">{cat.label}</span>
                                {hasTags && (
                                    <span
                                        className={`cat-chevron ${isOpen ? 'cat-chevron--open' : ''}`}
                                        aria-hidden="true"
                                    >
                                        ▾
                                    </span>
                                )}
                            </button>

                            {/* Desplegable de etiquetas */}
                            {hasTags && isOpen && (
                                <div className="tag-dropdown">
                                    <p className="tag-dropdown__title">Filtrar por etiqueta</p>
                                    <div className="tag-dropdown__list">
                                        {cat.tags.map((tag) => (
                                            <button
                                                key={tag.slug}
                                                className={`tag-chip ${activeTag === tag.slug ? 'tag-chip--active' : ''}`}
                                                onClick={(e) => handleTagClick(e, tag.slug)}
                                            >
                                                {tag.label}
                                                {activeTag === tag.slug && (
                                                    <span className="tag-chip__remove" aria-label="Quitar filtro">×</span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}