import { Link } from '@inertiajs/react';
import { getCategoryColor } from '@/utils/filterUtils';
import { CATEGORIES } from '@/data/placesData';

function StarRating({ rating }) {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return (
        <div className="stars" aria-label={`${rating} de 5 estrellas`}>
            {Array.from({ length: 5 }).map((_, i) => (
                <span
                    key={i}
                    className={`star ${i < full ? 'filled' : i === full && half ? 'half' : ''}`}
                >
                    ★
                </span>
            ))}
            <span className="rating-number">{rating.toFixed(1)}</span>
        </div>
    );
}

export default function PlaceCard({ place }) {
    const categoryInfo = CATEGORIES.find((c) => c.id === place.category);
    const bgColor = getCategoryColor(place.category);

    return (
        <article className={`place-card ${place.featured ? 'featured' : ''}`}>
            {/* Imagen / Placeholder */}
            <div className="card-image" style={{ backgroundColor: bgColor }}>
                {place.image ? (
                    <img src={place.image} alt={place.name} className="card-img" />
                ) : (
                    <div className="card-img-placeholder">
                        <span className="placeholder-icon">{categoryInfo?.icon || '📍'}</span>
                    </div>
                )}
                {place.featured && (
                    <div className="featured-badge">⭐ Destacado</div>
                )}
                <div className="card-category-tag">{categoryInfo?.label}</div>
            </div>

            {/* Contenido */}
            <div className="card-body">
                <h3 className="card-title">{place.name}</h3>
                <p className="card-description">{place.description}</p>

                {/* Tags */}
                <div className="card-tags">
                    {place.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag">{tag}</span>
                    ))}
                </div>

                {/* Rating */}
                <div className="card-meta">
                    <StarRating rating={place.rating} />
                    <span className="reviews-count">({place.reviews} reseñas)</span>
                </div>

                {/* Footer */}
                <div className="card-footer">
                    <div className="card-info">
                        <span className="info-item">📍 {place.address}</span>
                        <span className="info-item">🕐 {place.hours}</span>
                    </div>
                    <Link href={`/lugares/${place.id}`} className="card-btn">
                        Ver más →
                    </Link>
                </div>
            </div>
        </article>
    );
}