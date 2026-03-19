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
export function getInitialFormValues(place) {
    return {
        name:        place?.name        ?? '',
        description: place?.description ?? '',
        address:     place?.address     ?? '',
        phone:       place?.phone       ?? '',
        hours:       place?.hours       ?? '',
        category_id: place?.category_id ?? '',
        image:       null, // File object — nunca se pre-pobla desde el servidor
    };
}

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

        const payloadWithoutNullImage = (formData) => {
            if (formData.image == null) {
                const { image, ...payload } = formData;
                return payload;
            }

            return formData;
        };

        transform(payloadWithoutNullImage);

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
 * Nota: el campo 'image' se gestiona aparte por su naturaleza especial (File input).
 */
export const PLACE_FORM_FIELDS = [
    { key: 'name',        label: 'Nombre del negocio', type: 'text',     colSpan: 'full' },
    { key: 'description', label: 'Descripción',        type: 'textarea', colSpan: 'full' },
    { key: 'address',     label: 'Dirección',          type: 'text',     colSpan: 'half' },
    { key: 'phone',       label: 'Teléfono',           type: 'text',     colSpan: 'half' },
    { key: 'hours',       label: 'Horario',            type: 'text',     colSpan: 'full', placeholder: 'Ej: Lun–Vie 09:00–20:00' },
];
