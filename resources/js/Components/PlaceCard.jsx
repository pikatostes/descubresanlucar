import { Link } from '@inertiajs/react';
import { getCategoryColor } from '@/utils/filterUtils';
import { useLike } from '@/hooks/useLike';
import { getHoursShortSummary } from '@/utils/hoursUtils.jsx';

export default function PlaceCard({ place }) {
    const { liked, count, toggle } = useLike(place.id, place.is_liked ?? false, place.likes_count ?? 0);
    const bgColor = getCategoryColor(place.category);
    const mainImage = place.image ?? place.images?.[0]?.url ?? null;

    return (
        <article className="place-card">
            <div className="card-image" style={{ backgroundColor: bgColor }}>
                {mainImage ? (
                    <img src={mainImage} alt={place.name} className="card-img" />
                ) : (
                    <div className="card-img-placeholder">
                        <span className="placeholder-icon">{place.category?.icon || '📍'}</span>
                    </div>
                )}
                <div className="card-category-tag">{place.category?.label}</div>
                <button 
                    className={`favorite-btn ${liked ? 'liked' : ''}`}
                    onClick={toggle}
                    aria-label={liked ? 'Quitar de favoritos' : 'Añadir a favoritos'}
                >
                    <svg 
                        className="heart-icon" 
                        viewBox="0 0 24 24" 
                        fill={liked ? '#e74c3c' : 'none'}
                        stroke={liked ? '#e74c3c' : '#fff'}
                        strokeWidth="2"
                    >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    {count > 0 && <span className="like-count">{count}</span>}
                </button>
            </div>

            <div className="card-body">
                <h3 className="card-title">{place.name}</h3>
                <p className="card-description">{place.description}</p>

                <div className="card-tags">
                    {place.tags?.slice(0, 3).map((tag, index) => {
                        const tagLabel = typeof tag === 'object' ? tag.name : tag;
                        const tagId = typeof tag === 'object' ? tag.id : tag;

                        return (
                            <span key={`${place.id}-tag-${tagId}-${index}`} className="tag">
                                {tagLabel}
                            </span>
                        );
                    })}
                </div>

                <div className="card-footer">
                    <div className="card-info">
                        <span className="info-item">📍 {place.address}</span>
                        <span className="info-item">🕐 {getHoursShortSummary(place.hours)}</span>
                    </div>
                    <Link href={`/lugares/${place.category?.slug}/${place.slug}`} className="card-btn">
                        Ver más →
                    </Link>
                </div>
            </div>
        </article>
    );
}
