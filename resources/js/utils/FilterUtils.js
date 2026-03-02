/**
 * Filtra y ordena los lugares según los criterios dados.
 * En producción, esto se haría en el servidor vía Inertia/Laravel.
 *
 * @param {Array} places - Lista de establecimientos
 * @param {string} category - Categoría seleccionada ('all' para todas)
 * @param {string} sortBy - Criterio de ordenación
 * @param {string} search - Término de búsqueda
 * @returns {Array} Lista filtrada y ordenada
 */
export function filterAndSortPlaces(places, category = 'all', sortBy = 'relevance', search = '') {
    let result = [...places];

    // Filtrar por categoría
    if (category && category !== 'all') {
        result = result.filter((p) => p.category === category);
    }

    // Filtrar por búsqueda
    if (search.trim()) {
        const term = search.toLowerCase();
        result = result.filter(
            (p) =>
                p.name.toLowerCase().includes(term) ||
                p.description.toLowerCase().includes(term) ||
                p.tags.some((t) => t.toLowerCase().includes(term))
        );
    }

    // Ordenar
    result = sortPlaces(result, sortBy);

    return result;
}

/**
 * Ordena la lista de lugares según el criterio indicado.
 */
export function sortPlaces(places, sortBy) {
    const sorted = [...places];

    switch (sortBy) {
        case 'rating_desc':
            return sorted.sort((a, b) => b.rating - a.rating);
        case 'rating_asc':
            return sorted.sort((a, b) => a.rating - b.rating);
        case 'name_asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name_desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'newest':
            return sorted.sort((a, b) => b.id - a.id);
        case 'relevance':
        default:
            // Featured primero, luego por rating
            return sorted.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return b.rating - a.rating;
            });
    }
}

/**
 * Genera el color de fondo de la categoría para los placeholders de imagen.
 */
export const CATEGORY_COLORS = {
    restaurantes: '#C1440E',
    bares: '#8B4513',
    cafeterias: '#A0522D',
    hoteles: '#CD853F',
    tiendas: '#D2691E',
    ocio: '#B8860B',
    cultura: '#DAA520',
    naturaleza: '#6B8E23',
    all: '#A0522D',
};

export function getCategoryColor(category) {
    return CATEGORY_COLORS[category] || CATEGORY_COLORS.all;
}