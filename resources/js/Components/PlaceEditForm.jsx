import { useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
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

    const selectedImagePreviews = useMemo(() => {
        if (!Array.isArray(data.images) || data.images.length === 0) {
            return [];
        }

        return data.images.map((imageFile) => URL.createObjectURL(imageFile));
    }, [data.images]);

    useEffect(() => {
        return () => {
            selectedImagePreviews.forEach((previewUrl) => URL.revokeObjectURL(previewUrl));
        };
    }, [selectedImagePreviews]);

    const existingImages = useMemo(() => {
        if (!Array.isArray(place?.images)) {
            return place?.image ? [{ id: 'legacy-image', url: place.image }] : [];
        }

        return place.images;
    }, [place]);

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

            <div className="space-y-4 lg:grid lg:grid-cols-[260px_1fr] lg:gap-6 lg:space-y-0">
                <div className="space-y-4 lg:order-2">
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
                </div>

                <div className="space-y-3 lg:order-1 lg:sticky lg:top-0 lg:self-start">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Imágenes del negocio
                    </label>

                    <div className="rounded-xl border border-gray-200 p-3 space-y-3">
                        <p className="text-xs font-medium text-gray-500">Imágenes del negocio</p>

                        {selectedImagePreviews.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {selectedImagePreviews.map((previewUrl, index) => (
                                    <div key={`new-image-${index}`} className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border border-dashed border-gray-300">
                                        <img
                                            src={previewUrl}
                                            alt={`Nueva imagen ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : existingImages.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {existingImages.map((existingImage, index) => (
                                    <div key={existingImage.id ?? `existing-image-${index}`} className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border border-dashed border-gray-300">
                                        <img
                                            src={existingImage.url}
                                            alt={`Imagen actual ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center">
                                <span className="text-xs text-gray-400 px-3 text-center">Sin imagen seleccionada</span>
                            </div>
                        )}

                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={e => setData('images', Array.from(e.target.files ?? []))}
                            className="w-full text-sm text-gray-600"
                        />
                    </div>

                    {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
                    {errors['images.0'] && <p className="text-red-500 text-xs mt-1">{errors['images.0']}</p>}
                </div>
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
