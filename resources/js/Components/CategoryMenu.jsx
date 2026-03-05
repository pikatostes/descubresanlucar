export default function CategoryMenu({ categories = [], activeCategory, onCategoryChange }) {
    const allCategories = [
        { id: 'all', slug: 'all', label: 'Todos', icon: '🏙️' },
        ...categories.map(cat => ({ ...cat, id: cat.slug })),
    ];

    return (
        <div className="category-menu">
            <div className="category-menu-inner">
                {allCategories.map((cat) => (
                    <button
                        key={cat.id}
                        className={`category-pill ${activeCategory === cat.id ? 'active' : ''}`}
                        onClick={() => onCategoryChange(cat.id)}
                        aria-pressed={activeCategory === cat.id}
                    >
                        <span className="cat-icon">{cat.icon}</span>
                        <span className="cat-label">{cat.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}