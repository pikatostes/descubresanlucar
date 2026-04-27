import { useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import { getInitialFormValues, buildSubmitHandler, fetchAllTags, DAYS_OF_WEEK, getDefaultSchedule } from '@/Utils/editPlaceUtils';

function ScheduleEditor({ schedule, onChange }) {
    const updateDay = (dayKey, updates) => {
        const newSchedule = schedule.map(day =>
            day.day === dayKey ? { ...day, ...updates } : day
        );
        onChange(newSchedule);
    };

    const addTimeRange = (dayKey) => {
        const newSchedule = schedule.map(day => {
            if (day.day === dayKey) {
                return {
                    ...day,
                    ranges: [...day.ranges, { open: '09:00', close: '20:00' }]
                };
            }
            return day;
        });
        onChange(newSchedule);
    };

    const removeTimeRange = (dayKey, rangeIndex) => {
        const newSchedule = schedule.map(day => {
            if (day.day === dayKey) {
                const newRanges = day.ranges.filter((_, idx) => idx !== rangeIndex);
                return { ...day, ranges: newRanges };
            }
            return day;
        });
        onChange(newSchedule);
    };

    const updateTimeRange = (dayKey, rangeIndex, field, value) => {
        const newSchedule = schedule.map(day => {
            if (day.day === dayKey) {
                const newRanges = day.ranges.map((range, idx) => {
                    if (idx === rangeIndex) {
                        return { ...range, [field]: value };
                    }
                    return range;
                });
                return { ...day, ranges: newRanges };
            }
            return day;
        });
        onChange(newSchedule);
    };

    const copyScheduleToAll = (fromDay) => {
        const sourceDay = schedule.find(d => d.day === fromDay);
        if (!sourceDay) return;

        const newSchedule = schedule.map(day => ({
            day: day.day,
            closed: sourceDay.closed,
            ranges: sourceDay.closed ? [] : sourceDay.ranges.map(r => ({ ...r }))
        }));
        onChange(newSchedule);
    };

    const copyWeekdaysToWeekends = () => {
        const weekdays = schedule.filter(d => ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(d.day));
        const weekdaysAreEqual = weekdays.every(d =>
            d.closed === weekdays[0].closed &&
            d.ranges.length === weekdays[0].ranges.length &&
            d.ranges.every((r, i) => r.open === weekdays[0].ranges[i]?.open && r.close === weekdays[0].ranges[i]?.close)
        );

        if (weekdaysAreEqual && !weekdays[0].closed) {
            const newSchedule = schedule.map(day => {
                if (['saturday', 'sunday'].includes(day.day)) {
                    return {
                        day: day.day,
                        closed: weekdays[0].closed,
                        ranges: weekdays[0].ranges.map(r => ({ ...r }))
                    };
                }
                return day;
            });
            onChange(newSchedule);
        }
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Horario</p>
                <div className="flex gap-2">
                    <select
                        onChange={(e) => {
                            if (e.target.value) {
                                copyScheduleToAll(e.target.value);
                                e.target.value = '';
                            }
                        }}
                        className="text-xs border border-gray-200 rounded px-2 py-1 bg-white"
                    >
                        <option value="">Copiar a todos...</option>
                        {DAYS_OF_WEEK.map(day => (
                            <option key={day.key} value={day.key}>{day.labelFull}</option>
                        ))}
                    </select>
                    <button
                        type="button"
                        onClick={copyWeekdaysToWeekends}
                        className="text-xs border border-gray-200 rounded px-2 py-1 bg-white hover:bg-gray-50"
                    >
                        Copiar Lun–Vie a Sáb–Dom
                    </button>
                </div>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
                {DAYS_OF_WEEK.map(day => {
                    const daySchedule = schedule.find(s => s.day === day.key) || {
                        day: day.key,
                        closed: true,
                        ranges: []
                    };

                    return (
                        <div key={day.key} className="flex items-start gap-2 p-2 border border-gray-100 rounded-lg">
                            <div className="w-16 flex-shrink-0">
                                <span className="text-xs font-medium text-gray-700">{day.labelFull}</span>
                            </div>

                            <div className="flex items-center">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={!daySchedule.closed}
                                        onChange={(e) => updateDay(day.key, {
                                            closed: !e.target.checked,
                                            ranges: !e.target.checked && daySchedule.ranges.length === 0
                                                ? [{ open: '09:00', close: '20:00' }]
                                                : daySchedule.ranges
                                        })}
                                        className="sr-only peer"
                                    />
                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                                </label>
                            </div>

                            <div className="flex-1 min-w-0">
                                {daySchedule.closed ? (
                                    <span className="text-xs text-gray-400 italic">Cerrado</span>
                                ) : (
                                    <div className="space-y-1">
                                        {daySchedule.ranges.map((range, rangeIndex) => (
                                            <div key={rangeIndex} className="flex items-center gap-1">
                                                <input
                                                    type="time"
                                                    value={range.open}
                                                    onChange={(e) => updateTimeRange(day.key, rangeIndex, 'open', e.target.value)}
                                                    className="w-20 text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-400"
                                                />
                                                <span className="text-xs text-gray-400">–</span>
                                                <input
                                                    type="time"
                                                    value={range.close}
                                                    onChange={(e) => updateTimeRange(day.key, rangeIndex, 'close', e.target.value)}
                                                    className="w-20 text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-amber-400"
                                                />
                                                {daySchedule.ranges.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTimeRange(day.key, rangeIndex)}
                                                        className="text-red-400 hover:text-red-600 text-xs"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={() => addTimeRange(day.key)}
                                            className="text-xs text-amber-600 hover:text-amber-700"
                                        >
                                            + Añadir franja
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function PlaceEditForm({ place, categories, onClose }) {
    const { data, setData, post, put, transform, processing, errors } = useForm({
        ...getInitialFormValues(place),
        tags: place?.tags?.map(t => Number(t.id)) ?? [],
    });

    const handleSubmit = buildSubmitHandler({ place, put, post, transform, onClose });

    const [tags, setTags] = useState([]);

    useEffect(() => {
        fetchAllTags().then(setTags);
    }, []);

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

    const visibleExistingImages = useMemo(() => {
        let images = existingImages;

        if (Array.isArray(data.image_order) && data.image_order.length > 0) {
            const orderMap = new Map(data.image_order.map(item => [item.id, item.sort_order]));
            images = [...existingImages].sort((a, b) => {
                const orderA = orderMap.get(Number(a.id)) ?? 0;
                const orderB = orderMap.get(Number(b.id)) ?? 0;
                return orderA - orderB;
            });
        }

        if (!Array.isArray(data.deleted_image_ids) || data.deleted_image_ids.length === 0) {
            return images;
        }

        return images.filter((existingImage) => {
            return !data.deleted_image_ids.includes(Number(existingImage.id));
        });
    }, [existingImages, data.deleted_image_ids, data.image_order]);

    const markExistingImageForDeletion = (imageId) => {
        if (!Number.isInteger(imageId)) return;

        if (data.deleted_image_ids.includes(imageId)) return;

        setData('deleted_image_ids', [...data.deleted_image_ids, imageId]);
    };

    const moveImageUp = (index) => {
        if (index === 0) return;

        const currentImages = [...visibleExistingImages];
        const temp = currentImages[index];
        currentImages[index] = currentImages[index - 1];
        currentImages[index - 1] = temp;

        const imageOrder = currentImages
            .map((img, idx) => {
                const numericId = Number(img.id);
                if (!Number.isInteger(numericId)) return null;
                return { id: numericId, sort_order: idx };
            })
            .filter(item => item !== null);

        setData('image_order', imageOrder);
    };

    const moveImageDown = (index) => {
        if (index === visibleExistingImages.length - 1) return;

        const currentImages = [...visibleExistingImages];
        const temp = currentImages[index];
        currentImages[index] = currentImages[index + 1];
        currentImages[index + 1] = temp;

        const imageOrder = currentImages
            .map((img, idx) => {
                const numericId = Number(img.id);
                if (!Number.isInteger(numericId)) return null;
                return { id: numericId, sort_order: idx };
            })
            .filter(item => item !== null);

        setData('image_order', imageOrder);
    };

    const toggleTag = (tagId) => {
        const normalizedTagId = Number(tagId);

        if (data.tags.includes(normalizedTagId)) {
            setData('tags', data.tags.filter(id => id !== normalizedTagId));
        } else {
            setData('tags', [...data.tags, normalizedTagId]);
        }
    };

    const updateSchedule = (newSchedule) => {
        setData('schedule', newSchedule);
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
                    <ScheduleEditor
                        schedule={data.schedule}
                        onChange={updateSchedule}
                    />
                </div>

                <div className="space-y-3 lg:order-1 lg:sticky lg:top-0 lg:self-start">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Imágenes del negocio
                    </label>

                    <div className="rounded-xl border border-gray-200 p-3 space-y-3">
                        <p className="text-xs font-medium text-gray-500">Imágenes del negocio</p>

                        {visibleExistingImages.length > 0 && (
                            <>
                                <p className="text-xs font-medium text-gray-500">Imágenes actuales</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {visibleExistingImages.map((existingImage, index) => {
                                        const numericImageId = Number(existingImage.id);
                                        const canDelete = Number.isInteger(numericImageId);
                                        const isFirst = index === 0;
                                        const isLast = index === visibleExistingImages.length - 1;

                                        return (
                                            <div
                                                key={existingImage.id ?? `existing-image-${index}`}
                                                className="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border border-dashed border-gray-300"
                                            >
                                                {canDelete && (
                                                    <button
                                                        type="button"
                                                        onClick={() => markExistingImageForDeletion(numericImageId)}
                                                        className="absolute top-1.5 right-1.5 z-10 h-6 w-6 rounded-full bg-black/70 text-white text-sm leading-none flex items-center justify-center hover:bg-black"
                                                        aria-label={`Eliminar imagen ${index + 1}`}
                                                    >
                                                        ×
                                                    </button>
                                                )}

                                                {canDelete && (
                                                    <div className="absolute left-1.5 top-1.5 z-10 flex flex-col gap-0.5">
                                                        <button
                                                            type="button"
                                                            onClick={() => moveImageUp(index)}
                                                            disabled={isFirst}
                                                            className={`h-5 w-5 rounded-full flex items-center justify-center text-xs transition ${
                                                                isFirst
                                                                    ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                                                                    : 'bg-black/70 text-white hover:bg-black'
                                                            }`}
                                                            aria-label="Subir"
                                                        >
                                                            ▲
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => moveImageDown(index)}
                                                            disabled={isLast}
                                                            className={`h-5 w-5 rounded-full flex items-center justify-center text-xs transition ${
                                                                isLast
                                                                    ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
                                                                    : 'bg-black/70 text-white hover:bg-black'
                                                            }`}
                                                            aria-label="Bajar"
                                                        >
                                                            ▼
                                                        </button>
                                                    </div>
                                                )}

                                                <span className="absolute top-1.5 right-8 z-10 h-5 w-5 rounded-full bg-black/50 text-white text-xs flex items-center justify-center">
                                                    {index + 1}
                                                </span>

                                                <img
                                                    src={existingImage.url}
                                                    alt={`Imagen actual ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {selectedImagePreviews.length > 0 && (
                            <>
                                <p className="text-xs font-medium text-gray-500">Nuevas imágenes</p>
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
                            </>
                        )}

                        {visibleExistingImages.length === 0 && selectedImagePreviews.length === 0 && (
                            <div className="w-full aspect-[4/3] rounded-lg overflow-hidden bg-gray-100 border border-dashed border-gray-300 flex items-center justify-center">
                                <span className="text-xs text-gray-400 px-3 text-center">Sin imagen seleccionada</span>
                            </div>
                        )}

                        {data.deleted_image_ids.length > 0 && (
                            <p className="text-xs text-amber-600">
                                {data.deleted_image_ids.length} imagen(es) se eliminarán al guardar cambios.
                            </p>
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
                    {errors.deleted_image_ids && <p className="text-red-500 text-xs mt-1">{errors.deleted_image_ids}</p>}
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