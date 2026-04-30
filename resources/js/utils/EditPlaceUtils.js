/**
 * editPlaceUtils.js
 * Lógica reutilizable para el formulario de creación/edición de negocios.
 */

const DAYS_OF_WEEK = [
    { key: 'monday',    label: 'Lun', labelFull: 'Lunes' },
    { key: 'tuesday',   label: 'Mar', labelFull: 'Martes' },
    { key: 'wednesday', label: 'Mié', labelFull: 'Miércoles' },
    { key: 'thursday',  label: 'Jue', labelFull: 'Jueves' },
    { key: 'friday',   label: 'Vie', labelFull: 'Viernes' },
    { key: 'saturday', label: 'Sáb', labelFull: 'Sábado' },
    { key: 'sunday',   label: 'Dom', labelFull: 'Domingo' },
];

const DAY_LABELS_SHORT = {
    monday: 'Lun', tuesday: 'Mar', wednesday: 'Mié',
    thursday: 'Jue', friday: 'Vie', saturday: 'Sáb', sunday: 'Dom'
};

const DAY_LABELS_FULL = {
    monday: 'Lunes', tuesday: 'Martes', wednesday: 'Miércoles',
    thursday: 'Jueves', friday: 'Viernes', saturday: 'Sábado', sunday: 'Domingo'
};

function getDefaultSchedule() {
    return DAYS_OF_WEEK.map(day => ({
        day: day.key,
        closed: false,
        ranges: [{ open: '09:00', close: '20:00' }]
    }));
}

function parseHoursFromJson(hoursJson) {
    if (!hoursJson || typeof hoursJson !== 'object') {
        return getDefaultSchedule();
    }

    return DAYS_OF_WEEK.map(day => {
        if (hoursJson[day.key]) {
            return {
                day: day.key,
                closed: false,
                ranges: hoursJson[day.key]
            };
        }
        return {
            day: day.key,
            closed: true,
            ranges: []
        };
    });
}

function parseHoursFromString(hoursString) {
    if (!hoursString) {
        return getDefaultSchedule();
    }

    const schedule = getDefaultSchedule();
    const timePattern = '(\\d{1,2}:\\d{2})\\s*[–-]\\s*(\\d{1,2}:\\d{2})';
    const timeMatch = hoursString.match(new RegExp(timePattern, 'i'));

    if (!timeMatch) {
        return schedule;
    }

    const openTime = timeMatch[1];
    const closeTime = timeMatch[2];
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
    const targetDays = uniqueDays.length > 0 ? uniqueDays : DAYS_OF_WEEK.map(d => d.key);

    targetDays.forEach(dayKey => {
        const daySchedule = schedule.find(s => s.day === dayKey);
        if (daySchedule) {
            daySchedule.closed = false;
            daySchedule.ranges = [{ open: openTime, close: closeTime }];
        }
    });

    return schedule;
}

function parseHoursField(hoursData) {
    if (Array.isArray(hoursData)) {
        return hoursData;
    }
    if (typeof hoursData === 'object' && hoursData !== null) {
        return parseHoursFromJson(hoursData);
    }
    if (typeof hoursData === 'string') {
        return parseHoursFromString(hoursData);
    }
    return getDefaultSchedule();
}

function formatHoursToJson(schedule) {
    const result = {};
    schedule.forEach(daySchedule => {
        if (!daySchedule.closed && daySchedule.ranges.length > 0) {
            result[daySchedule.day] = daySchedule.ranges;
        }
    });
    return Object.keys(result).length > 0 ? result : null;
}

function formatHoursToString(schedule) {
    const parts = [];

    schedule.forEach(daySchedule => {
        if (daySchedule.closed) return;

        const dayLabel = DAY_LABELS_FULL[daySchedule.day];
        const timeRanges = daySchedule.ranges.map(r => `${r.open}–${r.close}`).join(', ');
        parts.push(`${dayLabel}: ${timeRanges}`);
    });

    return parts.length > 0 ? parts.join(' | ') : '';
}

function getHoursSummary(schedule) {
    const openDays = schedule.filter(d => !d.closed);
    const closedDays = schedule.filter(d => d.closed);

    if (openDays.length === 0) {
        return 'Cerrado';
    }

    if (openDays.length === 7 && closedDays.length === 0) {
        const firstRange = openDays[0].ranges[0];
        if (firstRange) {
            return `Lun–Dom ${firstRange.open}–${firstRange.close}`;
        }
    }

    if (openDays.length === 5) {
        const weekdays = openDays.filter(d => !['saturday', 'sunday'].includes(d.day));
        const weekends = openDays.filter(d => ['saturday', 'sunday'].includes(d.day));

        if (weekdays.length === 5 && weekends.length === 0) {
            const firstRange = openDays[0].ranges[0];
            if (firstRange) {
                return `Lun–Vie ${firstRange.open}–${firstRange.close}`;
            }
        }
    }

    const firstRange = openDays[0].ranges[0];
    if (firstRange) {
        return `${DAY_LABELS_SHORT[openDays[0].day]}–${DAY_LABELS_SHORT[openDays[openDays.length - 1].day]} ${firstRange.open}–${firstRange.close}`;
    }

    return '';
}

export function getInitialFormValues(place) {
    const schedule = parseHoursField(place?.hours);

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
        schedule:      schedule,
        category_id:   place?.category_id  ?? '',
        images:        [],
        deleted_image_ids: [],
        image_order: initialImageOrder,
    };
}

export { DAYS_OF_WEEK, DAY_LABELS_FULL, DAY_LABELS_SHORT, getDefaultSchedule, formatHoursToJson, formatHoursToString, getHoursSummary };

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
            const { schedule, images, image_order, ...rest } = formData;

            const hours = formatHoursToJson(schedule);

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

/**
 * Formatea los horarios para mostrar en el frontend de usuario
 */
export function formatHoursForDisplay(hoursData) {
    const schedule = parseHoursField(hoursData);
    return formatHoursToString(schedule);
}

/**
 * Obtiene un resumen corto de horarios para tarjetas
 */
export function getHoursShortSummary(hoursData) {
    const schedule = parseHoursField(hoursData);
    return getHoursSummary(schedule);
}