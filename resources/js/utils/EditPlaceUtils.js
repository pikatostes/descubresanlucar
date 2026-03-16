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
    };
}

/**
 * Devuelve la función de envío del formulario (submit handler).
 * Encapsula la lógica de decidir entre PUT (editar) y POST (crear),
 * así como la llamada a onClose tras el éxito.
 *
 * @param {Object|null} place      - El negocio a editar, o null para creación.
 * @param {Function}    put        - Función put de useForm (Inertia).
 * @param {Function}    post       - Función post de useForm (Inertia).
 * @param {Function}    onClose    - Callback para cerrar el modal tras éxito.
 * @returns {Function} Handler listo para usar en onSubmit del formulario.
 */
export function buildSubmitHandler({ place, put, post, onClose }) {
    return function handleSubmit(e) {
        e.preventDefault();

        if (place) {
            put(route('owner.places.update', place.id), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route('owner.places.store'), {
                onSuccess: () => onClose(),
            });
        }
    };
}

/**
 * Definición declarativa de los campos del formulario.
 * Útil para renderizado dinámico o validación futura.
 */
export const PLACE_FORM_FIELDS = [
    { key: 'name',        label: 'Nombre del negocio', type: 'text',     colSpan: 'full' },
    { key: 'description', label: 'Descripción',        type: 'textarea', colSpan: 'full' },
    { key: 'address',     label: 'Dirección',          type: 'text',     colSpan: 'half' },
    { key: 'phone',       label: 'Teléfono',           type: 'text',     colSpan: 'half' },
    { key: 'hours',       label: 'Horario',            type: 'text',     colSpan: 'full', placeholder: 'Ej: Lun–Vie 09:00–20:00' },
];