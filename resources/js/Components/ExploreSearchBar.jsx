export default function ExploreSearchBar({
    value,
    onChange,
    onClear,
    isSearching = false,
    statusText = '',
}) {
    return (
        <div className="explore-search" role="search">
            <div className="explore-search-input-wrap">
                <span className="explore-search-icon" aria-hidden="true">🔎</span>
                <input
                    type="search"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="explore-search-input"
                    placeholder="Buscar por nombre del lugar"
                    aria-label="Buscar lugares por nombre"
                />
                {value && (
                    <button
                        type="button"
                        onClick={onClear}
                        className="explore-search-clear"
                        aria-label="Limpiar búsqueda"
                    >
                        ×
                    </button>
                )}
            </div>

            <p className={`explore-search-status ${isSearching ? 'is-loading' : ''}`} aria-live="polite">
                {isSearching ? 'Buscando lugares...' : statusText}
            </p>
        </div>
    );
}
