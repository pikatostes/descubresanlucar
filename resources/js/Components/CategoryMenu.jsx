import { CATEGORIES } from '../data/Placesdata';

export default function CategoryMenu({ activeCategory, onCategoryChange }) {
    return (
        <div className="category-menu">
            <div className="category-menu-inner">
                {CATEGORIES.map((cat) => (
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