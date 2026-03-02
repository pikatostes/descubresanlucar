export default function HeroSection({ onSearch, searchValue, onSearchChange }) {
    return (
        <section className="hero">
            <div className="hero-bg-shapes">
                <div className="shape shape-1" />
                <div className="shape shape-2" />
                <div className="shape shape-3" />
            </div>

            <div className="hero-content">
                <p className="hero-eyebrow">Tu guía local de confianza</p>
                <h1 className="hero-title">
                    Descubre los mejores
                    <span className="hero-accent"> lugares</span>
                    <br />de tu ciudad
                </h1>
                <p className="hero-subtitle">
                    Restaurantes, bares, hoteles y mucho más. Encuentra y apoya
                    los negocios locales que hacen única tu ciudad.
                </p>

                {/* Buscador */}
                <form
                    className="hero-search"
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSearch && onSearch(searchValue);
                    }}
                >
                    <div className="search-input-wrap">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="¿Qué estás buscando? Restaurantes, cafés..."
                            className="search-input"
                            value={searchValue}
                            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="search-btn">
                        Buscar
                    </button>
                </form>

                <div className="hero-stats">
                    <div className="stat">
                        <strong>+200</strong>
                        <span>Establecimientos</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat">
                        <strong>12</strong>
                        <span>Categorías</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat">
                        <strong>+1.500</strong>
                        <span>Reseñas</span>
                    </div>
                </div>
            </div>
        </section>
    );
}