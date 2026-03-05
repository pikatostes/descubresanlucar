const SORT_OPTIONS = [
    { value: 'relevance', label: 'Más relevantes' },
    { value: 'name_asc',  label: 'Nombre A-Z' },
    { value: 'name_desc', label: 'Nombre Z-A' },
    { value: 'newest',    label: 'Más recientes' },
];

export default function FilterBar({ sortBy, onSortChange, totalResults, activeCategory }) {
    return (
        <div className="filter-bar">
            <p className="results-count">
                <strong>{totalResults}</strong>{' '}
                {totalResults === 1 ? 'establecimiento encontrado' : 'establecimientos encontrados'}
            </p>

            <div className="filter-controls">
                <label className="filter-label" htmlFor="sort-select">
                    Ordenar por:
                </label>
                <select
                    id="sort-select"
                    className="sort-select"
                    value={sortBy}
                    onChange={(e) => onSortChange(e.target.value)}
                >
                    {SORT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}