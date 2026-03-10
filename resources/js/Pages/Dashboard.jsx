import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

// ─── Icono de lápiz ───────────────────────────────────────────────────────────
function IconEdit() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16H8v-2a2 2 0 01.586-1.414z" />
        </svg>
    );
}

// ─── Icono de negocio ─────────────────────────────────────────────────────────
function IconStore() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 9l1-5h16l1 5M3 9h18M3 9v11a1 1 0 001 1h4v-5h8v5h4a1 1 0 001-1V9" />
        </svg>
    );
}

// ─── Modal de edición ─────────────────────────────────────────────────────────
function PlaceEditModal({ place, categories, onClose }) {
    const { data, setData, put, processing, errors } = useForm({
        name:        place.name        ?? '',
        description: place.description ?? '',
        address:     place.address     ?? '',
        phone:       place.phone       ?? '',
        hours:       place.hours       ?? '',
        category_id: place.category_id ?? '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        put(route('owner.places.update', place.id), {
            onSuccess: () => onClose(),
        });
    }

    return (
        // Backdrop
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* Panel */}
            <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden">

                {/* Cabecera */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <IconStore />
                        <span className="font-semibold text-lg truncate max-w-xs">{place.name}</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white transition-colors text-xl leading-none"
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>
                </div>

                {/* Formulario */}
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

                    {/* Dirección + Teléfono en fila */}
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

                    {/* Botones */}
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
            </div>
        </div>
    );
}

// ─── Tarjeta de negocio ───────────────────────────────────────────────────────
function PlaceCard({ place, categories, onEdit }) {
    return (
        <div className="group relative bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">

            {/* Imagen o placeholder */}
            <div className="h-32 bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center overflow-hidden">
                {place.image
                    ? <img src={`/storage/${place.image}`} alt={place.name}
                           className="w-full h-full object-cover" />
                    : <span className="text-4xl opacity-30"><IconStore /></span>
                }
            </div>

            {/* Info */}
            <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h3 className="font-semibold text-gray-800 text-sm truncate">{place.name}</h3>
                        {place.category && (
                            <span className="inline-block mt-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                                {place.category.label}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={() => onEdit(place)}
                        className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-500 hover:text-amber-600 border border-gray-200 hover:border-amber-300 rounded-lg px-2 py-1.5 transition"
                    >
                        <IconEdit />
                        Editar
                    </button>
                </div>

                {place.address && (
                    <p className="mt-2 text-xs text-gray-400 truncate">📍 {place.address}</p>
                )}
                {place.phone && (
                    <p className="text-xs text-gray-400 truncate">📞 {place.phone}</p>
                )}
                {place.hours && (
                    <p className="text-xs text-gray-400 truncate">🕐 {place.hours}</p>
                )}
            </div>

            {/* Badge de estado */}
            {place.status && (
                <div className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    place.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                }`}>
                    {place.status === 'active' ? 'Activo' : place.status}
                </div>
            )}
        </div>
    );
}

// ─── Dashboard principal ──────────────────────────────────────────────────────
export default function Dashboard({ ownerPlaces = [], categories = [] }) {
    const { auth } = usePage().props;
    const isOwner = auth.user?.role === 'owner';

    const [editingPlace, setEditingPlace] = useState(null);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">

                    {/* ── Bienvenida general ─────────────────────────────── */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            ¡Bienvenido, <strong>{auth.user.name}</strong>!
                        </div>
                    </div>

                    {/* ── Panel de propietario ───────────────────────────── */}
                    {isOwner && (
                        <div className="bg-white shadow-sm sm:rounded-xl overflow-hidden">

                            {/* Cabecera del panel */}
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-600">
                                    <IconStore />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">Mis negocios</h3>
                                    <p className="text-xs text-gray-400">
                                        {ownerPlaces.length === 0
                                            ? 'No tienes negocios registrados'
                                            : `${ownerPlaces.length} negocio${ownerPlaces.length > 1 ? 's' : ''} registrado${ownerPlaces.length > 1 ? 's' : ''}`
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Grid de negocios */}
                            <div className="p-6">
                                {ownerPlaces.length === 0 ? (
                                    <div className="text-center py-12 text-gray-400">
                                        <div className="text-5xl mb-3 opacity-20">🏪</div>
                                        <p className="text-sm">Aún no tienes negocios asociados.</p>
                                        <p className="text-xs mt-1">Contacta con el administrador para añadir uno.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {ownerPlaces.map(place => (
                                            <PlaceCard
                                                key={place.id}
                                                place={place}
                                                categories={categories}
                                                onEdit={setEditingPlace}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de edición */}
            {editingPlace && (
                <PlaceEditModal
                    place={editingPlace}
                    categories={categories}
                    onClose={() => setEditingPlace(null)}
                />
            )}
        </AuthenticatedLayout>
    );
}