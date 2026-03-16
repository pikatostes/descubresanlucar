import { useForm } from '@inertiajs/react';
import { getInitialFormValues, buildSubmitHandler } from '@/Utils/editPlaceUtils';

/**
 * PlaceEditForm
 *
 * Componente de formulario reutilizable para crear o editar un negocio.
 * No incluye ningún wrapper de modal; puede usarse tanto dentro de un modal
 * como en una página propia.
 *
 * Props:
 *  - place      {Object|null}  Negocio a editar. Si es null, actúa como formulario de creación.
 *  - categories {Array}        Lista de categorías disponibles.
 *  - onClose    {Function}     Callback invocado tras guardar con éxito o al pulsar Cancelar.
 */
export default function PlaceEditForm({ place, categories, onClose }) {
    const { data, setData, post, put, processing, errors } = useForm(
        getInitialFormValues(place)
    );

    const handleSubmit = buildSubmitHandler({ place, put, post, onClose });

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4">

            {/* Nombre */}
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Nombre del negocio
                </label>
                <input
                    type="text"
                    value={data.name}
                    onChange={e => setData('name', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Categoría */}
            {categories && categories.length > 0 && (
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Categoría
                    </label>
                    <select
                        value={data.category_id}
                        onChange={e => setData('category_id', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition bg-white"
                    >
                        <option value="">Sin categoría</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                    </select>
                    {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id}</p>}
                </div>
            )}

            {/* Descripción */}
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Descripción
                </label>
                <textarea
                    value={data.description}
                    onChange={e => setData('description', e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition resize-none"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Dirección + Teléfono */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Dirección
                    </label>
                    <input
                        type="text"
                        value={data.address}
                        onChange={e => setData('address', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                        Teléfono
                    </label>
                    <input
                        type="text"
                        value={data.phone}
                        onChange={e => setData('phone', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                    />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
            </div>

            {/* Horario */}
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Horario
                </label>
                <input
                    type="text"
                    value={data.hours}
                    onChange={e => setData('hours', e.target.value)}
                    placeholder="Ej: Lun–Vie 09:00–20:00"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition"
                />
                {errors.hours && <p className="text-red-500 text-xs mt-1">{errors.hours}</p>}
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {processing ? 'Guardando…' : 'Guardar cambios'}
                </button>
            </div>
        </form>
    );
}