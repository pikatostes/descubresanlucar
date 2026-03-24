import { Link } from '@inertiajs/react';
import { getCategoryColor } from '@/utils/filterUtils';

export default function PlaceCard({ place }) {
    const bgColor = getCategoryColor(place.category);
    const mainImage = place.image ?? place.images?.[0]?.url ?? null;

    return (
        <article className="place-card">
            {/* Imagen / Placeholder */}
            <div className="card-image" style={{ backgroundColor: bgColor }}>
                {mainImage ? (
                    <img src={mainImage} alt={place.name} className="card-img" />
                ) : (
                    <div className="card-img-placeholder">
                        <span className="placeholder-icon">{place.category?.icon || '📍'}</span>
                    </div>
                )}
                <div className="card-category-tag">{place.category?.label}</div>
            </div>

            {/* Contenido */}
            <div className="card-body">
                <h3 className="card-title">{place.name}</h3>
                <p className="card-description">{place.description}</p>

                {/* Tags */}
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
