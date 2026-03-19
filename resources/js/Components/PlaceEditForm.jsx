import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { getInitialFormValues, buildSubmitHandler, fetchAllTags } from '@/Utils/editPlaceUtils';

export default function PlaceEditForm({ place, categories, onClose }) {
    const { data, setData, post, put, transform, processing, errors } = useForm({
        ...getInitialFormValues(place),
        tags: place?.tags?.map(t => Number(t.id)) ?? [], // importante para edición
    });

    const handleSubmit = buildSubmitHandler({ place, put, post, transform, onClose });

    const [tags, setTags] = useState([]);

    // 🔹 Cargar todos los tags
    useEffect(() => {
        fetchAllTags().then(setTags);
    }, []);

    // 🔹 Filtrar por categoría seleccionada
    const filteredTags = tags.filter(tag => tag.category_id == data.category_id);

    // 🔹 Manejar selección de tags
    const toggleTag = (tagId) => {
        const normalizedTagId = Number(tagId);

        if (data.tags.includes(normalizedTagId)) {
            setData('tags', data.tags.filter(id => id !== normalizedTagId));
        } else {
            setData('tags', [...data.tags, normalizedTagId]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">

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
                        onChange={e => {
                            setData('category_id', e.target.value);
                            setData('tags', []);
                        }}
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

            {/* Tags dinámicos */}
            {data.category_id && (
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                        Tags
                    </label>

                    {filteredTags.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {filteredTags.map(tag => {
                                const isSelected = data.tags.includes(tag.id);

                                return (
                                    <button
                                        type="button"
                                        key={tag.id}
                                        onClick={() => toggleTag(tag.id)}
                                        className={`px-3 py-1 text-xs rounded-full border transition
                                            ${isSelected
                                                ? 'bg-amber-500 text-white border-amber-500'
                                                : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'
                                            }`}
                                    >
                                        {tag.name}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-xs text-gray-400">No hay tags para esta categoría</p>
                    )}

                    {errors.tags && <p className="text-red-500 text-xs mt-1">{errors.tags}</p>}
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

            {/* Imagen */}
            <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Imagen del negocio
                </label>

                {place?.image && !data.image && (
                    <div className="mb-2">
                        <img
                            src={`${place.image}`}
                            alt="Imagen actual"
                            className="h-24 w-auto rounded-lg object-cover border border-gray-200"
                        />
                    </div>
                )}

                {data.image && (
                    <div className="mb-2">
                        <img
                            src={URL.createObjectURL(data.image)}
                            alt="Nueva imagen"
                            className="h-24 w-auto rounded-lg object-cover border border-amber-300"
                        />
                    </div>
                )}

                <input
                    type="file"
                    accept="image/*"
                    onChange={e => setData('image', e.target.files[0] ?? null)}
                    className="w-full text-sm text-gray-600"
                />
                {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-gray-600"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={processing}
                    className="px-5 py-2 bg-amber-500 text-white text-sm font-semibold rounded-lg"
                >
                    {processing ? 'Guardando…' : 'Guardar cambios'}
                </button>
            </div>
        </form>
    );
}
