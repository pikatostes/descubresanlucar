import { useState, useRef, useEffect } from 'react';
import '../../css/tags.css';

export default function CategoryMenu({
    categories = [],
    activeCategory,
    activeTag,
    onCategoryChange,
    onTagChange,
}) {
    const [openCategory, setOpenCategory] = useState(null);
    const menuRef = useRef(null);

    useEffect(() => {
        function handleOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenCategory(null);
            }
        }
        document.addEventListener('click', handleOutside);
        return () => document.removeEventListener('click', handleOutside);
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

        onCategoryChange(slug);

        const cat = allCategories.find((c) => c.slug === slug);
        const hasTags = cat?.tags?.length > 0;

        if (hasTags) {
            setOpenCategory((prev) => (prev === slug ? null : slug));
        } else {
            onTagChange(null);
            setOpenCategory(null);
        }
    }

    function handleTagClick(e, tagSlug) {
        e.stopPropagation();
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

                            {hasTags && isOpen && (
                                <div className="tag-dropdown">
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