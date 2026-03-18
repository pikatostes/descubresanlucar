import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Footer from '@/Components/Footer';
import PlaceEditModal from '@/Components/PlaceEditModal';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

function IconEdit() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828A2 2 0 0110 16H8v-2a2 2 0 01.586-1.414z" />
        </svg>
    );
}

function IconStore() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 9l1-5h16l1 5M3 9h18M3 9v11a1 1 0 001 1h4v-5h8v5h4a1 1 0 001-1V9" />
        </svg>
    );
}

function IconPlus() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
    );
}

function PlaceCard({ place, onEdit }) {
    return (
        <div className="group relative bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            <div className="h-32 bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center overflow-hidden">
                {place.image
                    ? <img src={`${place.image}`} alt={place.name}
                        className="w-full h-full object-cover" />
                    : <span className="text-4xl opacity-30"><IconStore /></span>
                }
            </div>

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
                    <div className="justify-self-end flex flex-col items-end gap-2 transition-opacity">
                        <button
                            onClick={() => onEdit(place)}
                            className="flex-shrink-0 flex items-center gap-1 text-xs text-gray-500 hover:text-amber-600 border border-gray-200 hover:border-amber-300 rounded-lg px-2 py-1.5 transition"
                        >
                            <IconEdit />
                            Editar
                        </button>
                        <Link href={`/lugares/${place.id}`} className="card-btn">
                            Ver página
                        </Link>
                    </div>
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

export default function Dashboard({ ownerPlaces = [], categories = [] }) {
    const { auth } = usePage().props;
    const isOwner = auth.user?.role === 'owner';
    const user = auth.user;

    const [editingPlace, setEditingPlace]     = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    console.log(user)

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="DescubreSanlúcar" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                        {/* Columna izquierda (30%) — Perfil del usuario */}
                        <div className="lg:col-span-1">
                            <div className="bg-white shadow-sm rounded-xl overflow-hidden">
                                <div className="p-6 text-center">
                                    <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                                        {user.profile_photo_url || user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <h3 className="font-semibold text-gray-800 text-lg">{user.name}</h3>
                                    <p className="text-sm text-gray-500">{user.email}</p>
                                    <div className="mt-4 inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full capitalize">
                                        {user.role || 'usuario'}
                                    </div>
                                </div>
                                <div className="border-t border-gray-100 px-6 py-4">
                                    <p className="text-xs text-gray-400 text-center">
                                        Miembro desde {new Date(user.created_at).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Columna derecha (70%) — Negocios del owner */}
                        <div className="lg:col-span-4">
                            {isOwner && (
                                <div className="bg-white shadow-sm sm:rounded-xl overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
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
                                        <button
                                            onClick={() => setShowCreateModal(true)}
                                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold rounded-lg transition"
                                        >
                                            <IconPlus />
                                            Añadir negocio
                                        </button>
                                    </div>

                                    <div className="p-6">
                                        {ownerPlaces.length === 0 ? (
                                            <div className="text-center py-12 text-gray-400">
                                                <div className="text-5xl mb-3 opacity-20">🏪</div>
                                                <p className="text-sm">Aún no tienes negocios asociados.</p>
                                                <p className="text-xs mt-1">Haz clic en "Añadir negocio" para crear el primero.</p>
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {ownerPlaces.map(place => (
                                                    <PlaceCard
                                                        key={place.id}
                                                        place={place}
                                                        onEdit={setEditingPlace}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {!isOwner && (
                                <div className="bg-white shadow-sm rounded-xl overflow-hidden">
                                    <div className="p-12 text-center text-gray-400">
                                        <div className="text-5xl mb-3 opacity-20">🔐</div>
                                        <p className="text-sm">No tienes permisos de propietario.</p>
                                        <p className="text-xs mt-1">Contacta con el administrador para obtener acceso.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
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

            {/* Modal de creación */}
            {showCreateModal && (
                <PlaceEditModal
                    place={null}
                    categories={categories}
                    onClose={() => setShowCreateModal(false)}
                />
            )}

            <Footer />
        </AuthenticatedLayout>
    );
}