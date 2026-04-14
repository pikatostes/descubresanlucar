/**
 * editPlaceUtils.js
 * Lógica reutilizable para el formulario de creación/edición de negocios.
 */

/**
 * Devuelve los valores iniciales del formulario a partir de un place existente
 * o valores vacíos si se está creando uno nuevo.
 *
 * @param {Object|null} place - El negocio a editar, o null para creación.
 * @returns {Object} Valores iniciales compatibles con useForm de Inertia.
 */
const DAYS_OF_WEEK = [
    { key: 'monday',    label: 'Lun' },
    { key: 'tuesday',   label: 'Mar' },
    { key: 'wednesday', label: 'Mié' },
    { key: 'thursday',  label: 'Jue' },
    { key: 'friday',   label: 'Vie' },
    { key: 'saturday', label: 'Sáb' },
    { key: 'sunday',   label: 'Dom' },
];

function parseHoursField(hoursString) {
    if (!hoursString) {
        return { opening_days: [], opening_time: '', closing_time: '' };
    }

    const timePattern = '(\\d{1,2}:\\d{2})\\s*[–-]\\s*(\\d{1,2}:\\d{2})';
    const timeMatch = hoursString.match(new RegExp(timePattern, 'i'));

    if (timeMatch) {
        const timeStart = timeMatch[1];
        const timeEnd = timeMatch[2];
        const dayPart = hoursString.replace(timeMatch[0], '').trim();

        const dayMap = {
            'lun': 'monday', 'mar': 'tuesday', 'mié': 'wednesday', 'miercoles': 'wednesday',
            'jue': 'thursday', 'jueves': 'thursday', 'vie': 'friday', 'viernes': 'friday',
            'sáb': 'saturday', 'sab': 'saturday', 'dom': 'sunday', 'domingo': 'sunday'
        };

        const dayPartLower = dayPart.toLowerCase();
        const selectedDays = [];

        Object.entries(dayMap).forEach(([key, value]) => {
            if (dayPartLower.includes(key)) {
                selectedDays.push(value);
            }
        });

        const uniqueDays = [...new Set(selectedDays)];
        
        return {
            opening_days: uniqueDays.length > 0 ? uniqueDays : DAYS_OF_WEEK.map(d => d.key),
            opening_time: timeStart,
            closing_time: timeEnd
        };
    }

    return { opening_days: [], opening_time: '', closing_time: '' };
}

function formatHoursField(openingDays, openingTime, closingTime) {
    if (!openingDays || openingDays.length === 0 || !openingTime || !closingTime) {
        return '';
    }

    const dayLabels = {
        monday: 'Lun', tuesday: 'Mar', wednesday: 'Mié',
        thursday: 'Jue', friday: 'Vie', saturday: 'Sáb', sunday: 'Dom'
    };

    const sortedDays = DAYS_OF_WEEK.map(d => d.key).filter(d => openingDays.includes(d));
    let dayRange = '';

    if (sortedDays.length === 7) {
        dayRange = 'Lun–Dom';
    } else if (sortedDays.length === 5 &&
               sortedDays.includes('monday') &&
               sortedDays.includes('tuesday') &&
               sortedDays.includes('wednesday') &&
               sortedDays.includes('thursday') &&
               sortedDays.includes('friday')) {
        dayRange = 'Lun–Vie';
    } else if (sortedDays.length === 2 &&
               sortedDays.includes('saturday') &&
               sortedDays.includes('sunday')) {
        dayRange = 'Sáb–Dom';
    } else {
        dayRange = sortedDays.map(d => dayLabels[d]).join(', ');
    }

    return `${dayRange} ${openingTime}–${closingTime}`;
}

export function getInitialFormValues(place) {
    const parsedHours = parseHoursField(place?.hours);
    
    const initialImageOrder = place?.images 
        ? place.images.map((img, idx) => ({
            id: Number(img.id),
            sort_order: img.sort_order ?? idx
          }))
        : [];

    return {
        name:          place?.name          ?? '',
        description:   place?.description   ?? '',
        address:       place?.address       ?? '',
        phone:         place?.phone         ?? '',
        opening_days: parsedHours.opening_days,
        opening_time: parsedHours.opening_time,
        closing_time: parsedHours.closing_time,
        category_id:  place?.category_id  ?? '',
        images:        [],
        deleted_image_ids: [],
        image_order: initialImageOrder,
    };
}

export { DAYS_OF_WEEK };

/**
 * Devuelve la función de envío del formulario (submit handler).
 * Usa forceFormData: true para soportar el envío de archivos (imagen).
 *
 * @param {Object|null} place      - El negocio a editar, o null para creación.
 * @param {Function}    put        - Función put de useForm (Inertia).
 * @param {Function}    post       - Función post de useForm (Inertia).
 * @param {Function}    onClose    - Callback para cerrar el modal tras éxito.
 * @returns {Function} Handler listo para usar en onSubmit del formulario.
 */
export function buildSubmitHandler({ place, put, post, transform, onClose }) {
    return function handleSubmit(e) {
        e.preventDefault();

        const payloadWithoutEmptyImages = (formData) => {
            const { opening_days, opening_time, closing_time, images, image_order, ...rest } = formData;

            const hours = formatHoursField(opening_days, opening_time, closing_time);

            const finalPayload = {
                ...rest,
                hours,
                ...(Array.isArray(images) && images.length > 0 ? { images } : {}),
                ...(Array.isArray(image_order) && image_order.length > 0 ? { image_order } : {}),
            };

            return finalPayload;
        };

        transform(payloadWithoutEmptyImages);

        if (place) {
            post(route('owner.places.update', place.id), {
                forceFormData: true,
                _method: 'PUT',
                onSuccess: () => onClose(),
            });
        } else {
            post(route('owner.places.store'), {
                forceFormData: true,
                onSuccess: () => onClose(),
            });
        }
    };
}

/**
 * Obtiene todos los tags desde el backend
 *
 * @returns {Promise<Array>} Lista de tags
 */
export async function fetchAllTags() {
    try {
        const response = await fetch(route('tags.index'), {
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Error al obtener los tags');
        }

        const tags = await response.json();

        return tags;
    } catch (error) {
        console.error('fetchAllTags error:', error);
        return [];
    }
}

/**
 * Definición declarativa de los campos del formulario.
 * Útil para renderizado dinámico o validación futura.
 * Nota: el campo 'images' se gestiona aparte por su naturaleza especial (File input).
 */
export const PLACE_FORM_FIELDS = [
    { key: 'name',        label: 'Nombre del negocio', type: 'text',     colSpan: 'full' },
    { key: 'description', label: 'Descripción',        type: 'textarea', colSpan: 'full' },
    { key: 'address',     label: 'Dirección',          type: 'text',     colSpan: 'half' },
    { key: 'phone',       label: 'Teléfono',           type: 'text',     colSpan: 'half' },
    { key: 'hours',       label: 'Horario',            type: 'text',     colSpan: 'full', placeholder: 'Ej: Lun–Vie 09:00–20:00' },
];
