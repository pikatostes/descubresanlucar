export function filterAndSortPlaces(places, category = 'all', sortBy = 'relevance', search = '') {
    let result = [...places];

    // Filtrar por categoría — ahora place.category es un objeto { slug, label, icon }
    if (category && category !== 'all') {
        result = result.filter((p) => p.category?.slug === category);
    }

    // Filtrar por búsqueda
    if (search.trim()) {
        const term = search.toLowerCase();
        result = result.filter(
            (p) =>
                p.name.toLowerCase().includes(term) ||
                p.description?.toLowerCase().includes(term) ||
                p.tags?.some((t) => t.toLowerCase().includes(term))
        );
    }

    result = sortPlaces(result, sortBy);

    return result;
}

export function sortPlaces(places, sortBy) {
    const sorted = [...places];

    switch (sortBy) {
        case 'name_asc':
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
        case 'name_desc':
            return sorted.sort((a, b) => b.name.localeCompare(a.name));
        case 'newest':
            return sorted.sort((a, b) => b.id - a.id);
        case 'relevance':
        default:
            return sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
}

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

// Ahora recibe el objeto category completo o solo el slug
export function getCategoryColor(category) {
    const slug = typeof category === 'object' ? category?.slug : category;
    return CATEGORY_COLORS[slug] || CATEGORY_COLORS.all;
}