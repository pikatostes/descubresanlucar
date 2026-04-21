import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Footer from '@/Components/Footer';
import PlaceEditModal from '@/Components/PlaceEditModal';
import PlaceCard from '@/Components/PlaceCard';
import DeleteUserForm from '@/Pages/Profile/Partials/DeleteUserForm';
import UpdatePasswordForm from '@/Pages/Profile/Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from '@/Pages/Profile/Partials/UpdateProfileInformationForm';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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

function IconHeart() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    );
}

function IconCreditCard() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
    );
}

function OwnerPlaceCard({ place, onEdit }) {
    const mainImage = place.image ?? place.images?.[0]?.url ?? null;

    return (
        <div className="group relative bg-white border rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden" style={{ borderColor: 'var(--brown-pale)' }}>
            <div className="h-32 flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--cream) 0%, var(--cream-dark) 100%)' }}>
                {mainImage
                    ? <img src={`${mainImage}`} alt={place.name}
                        className="w-full h-full object-cover" />
                    : <span className="text-4xl opacity-30"><IconStore /></span>
                }
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--text-dark)' }}>{place.name}</h3>
                        {place.category && (
                            <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--cream)', color: 'var(--terracotta)' }}>
                                {place.category.label}
                            </span>
                        )}
                    </div>
                    <div className="justify-self-end flex flex-col items-end gap-2 transition-opacity">
                        <button
                            onClick={() => onEdit(place)}
                            className="flex-shrink-0 flex items-center gap-1 text-xs border rounded-lg px-2 py-1.5 transition"
                            style={{ color: 'var(--text-mid)', borderColor: 'var(--brown-pale)' }}
                        >
                            <IconEdit />
                            Editar
                        </button>
                        <Link href={`/lugares/${place.slug}`} className="card-btn">
                            Ver página
                        </Link>
                    </div>
                </div>

                {place.address && (
                    <p className="mt-2 text-xs truncate" style={{ color: 'var(--text-light)' }}>📍 {place.address}</p>
                )}
                {place.phone && (
                    <p className="text-xs truncate" style={{ color: 'var(--text-light)' }}>📞 {place.phone}</p>
                )}
                {place.hours && (
                    <p className="text-xs truncate" style={{ color: 'var(--text-light)' }}>🕐 {place.hours}</p>
                )}
            </div>

            {place.status && (
                <div className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${place.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                    }`}>
                    {place.status === 'active' ? 'Activo' : place.status}
                </div>
            )}
        </div>
    );
}

export default function Dashboard({ ownerPlaces = [], likedPlaces = [], categories = [], mustVerifyEmail = false, status = null, activeTab: initialActiveTab = 'perfil', bankData = [] }) {
    const { auth } = usePage().props;
    const isOwner = auth.user?.role === 'owner';
    const isAdmin = auth.user?.role === 'admin';
    const user = auth.user;

    const [editingPlace, setEditingPlace] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [activeTab, setActiveTab] = useState(initialActiveTab);
    const [likedFilter, setLikedFilter] = useState('');

    useEffect(() => {
        setActiveTab(initialActiveTab);
    }, [initialActiveTab]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (activeTab === 'perfil') {
            params.set('tab', 'perfil');
        } else {
            params.set('tab', activeTab);
        }

        const query = params.toString();
        const nextUrl = query ? `/dashboard?${query}` : '/dashboard';
        window.history.replaceState({}, '', nextUrl);
    }, [activeTab]);

    const filteredLikedPlaces = likedPlaces.filter(place => {
        if (!likedFilter) return true;
        const search = likedFilter.toLowerCase();
        return (
            place.name?.toLowerCase().includes(search) ||
            place.category?.label?.toLowerCase().includes(search) ||
            place.address?.toLowerCase().includes(search)
        );
    });

    const likedCategories = [...new Set(
        likedPlaces
            .map(p => p.category?.label)
            .filter(Boolean)
    )].sort();

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-dark)' }}>
                    Dashboard
                </h2>
            }
        >
            <Head title="DescubreSanlúcar" />

            <div className="py-12 min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                        {/* Columna izquierda — Perfil */}
                        <div className="lg:col-span-1">
                            <div className="bg-white shadow-sm rounded-xl overflow-hidden" style={{ border: '1px solid var(--brown-pale)' }}>
                                <div className="p-4 sm:p-6">

                                    {/* Mobile horizontal / Desktop vertical */}
                                    <div className="grid grid-cols-12 lg:grid-cols-1 gap-4 items-center text-center lg:text-center">

                                        {/* Avatar */}
                                        <div className="col-span-3 lg:col-span-1 flex justify-center">
                                            <div className="w-14 h-14 lg:w-24 lg:h-24 rounded-full flex items-center justify-center text-white text-lg lg:text-3xl font-bold overflow-hidden"
                                                style={{ background: 'linear-gradient(135deg, var(--terracotta) 0%, var(--terra-dark) 100%)' }}>
                                                {user.profile_photo_url || user.name.charAt(0).toUpperCase()}
                                            </div>
                                        </div>

                                        {/* Nombre + email */}
                                        <div className="col-span-9 lg:col-span-1 text-left lg:text-center">
                                            <h3 className="font-semibold text-sm lg:text-lg leading-tight" style={{ color: 'var(--text-dark)' }}>
                                                {user.name}
                                            </h3>
                                            <p className="text-xs lg:text-sm truncate" style={{ color: 'var(--text-light)' }}>
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Role + antigüedad */}
                                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-3 mt-4">
                                        <div className="px-3 py-2 text-xs font-semibold rounded-lg text-center capitalize"
                                            style={{ backgroundColor: 'var(--cream-dark)', color: 'var(--terracotta)' }}>
                                            {user.role || "usuario"}
                                        </div>

                                        <div className="px-3 py-2 lg:px-0 lg:py-0 text-xs text-center rounded-lg lg:rounded-none" style={{ color: 'var(--text-light)' }}>
                                            <span className="lg:text-gray-400">
                                                Miembro desde{" "}
                                                {new Date(user.created_at).toLocaleDateString("es-ES", {
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Columna derecha — Contenido con tabs */}
                        <div className="lg:col-span-4">
                            <div className="bg-white shadow-sm sm:rounded-xl overflow-hidden" style={{ border: '1px solid var(--brown-pale)' }}>
                                {/* Tabs */}
                                <div className="border-b" style={{ borderColor: 'var(--brown-pale)' }}>
                                    <nav className="flex">
                                        <button
                                            onClick={() => setActiveTab('perfil')}
                                            className={`dash-tab ${activeTab === 'perfil' ? 'dash-tab--active' : ''}`}
                                        >
                                            Perfil
                                        </button>
                                        {isOwner && (
                                            <button
                                                onClick={() => setActiveTab('negocios')}
                                                className={`dash-tab ${activeTab === 'negocios' ? 'dash-tab--active' : ''}`}
                                            >
                                                <IconStore />
                                                Mis negocios
                                            </button>
                                        )}
                                        {isOwner && (
                                            <button
                                                onClick={() => setActiveTab('pago')}
                                                className={`dash-tab ${activeTab === 'pago' ? 'dash-tab--active' : ''}`}
                                            >
                                                <IconCreditCard />
                                                Pago
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setActiveTab('likes')}
                                            className={`dash-tab ${activeTab === 'likes' ? 'dash-tab--active' : ''}`}
                                        >
                                            <IconHeart />
                                            Favoritos
                                            {likedPlaces.length > 0 && (
                                                <span className="dash-tab__badge">{likedPlaces.length}</span>
                                            )}
                                        </button>
                                        {isAdmin && (
                                            <button
                                                onClick={() => setActiveTab('admin')}
                                                className={`dash-tab ${activeTab === 'admin' ? 'dash-tab--active' : ''}`}
                                            >
                                                👑 Admin
                                            </button>
                                        )}
                                    </nav>
                                </div>

                                {activeTab === 'perfil' && (
                                    <div className="p-6 space-y-6">
                                        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--brown-pale)' }}>
                                            <UpdateProfileInformationForm
                                                mustVerifyEmail={mustVerifyEmail}
                                                status={status}
                                                className="max-w-2xl"
                                            />
                                        </div>

                                        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--brown-pale)' }}>
                                            <UpdatePasswordForm className="max-w-2xl" />
                                        </div>

                                        <div className="rounded-xl p-6" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
                                            <DeleteUserForm className="max-w-2xl" />
                                        </div>
                                    </div>
                                )}

                                {/* Tab: Pago */}
                                {activeTab === 'pago' && isOwner && (
                                    <div className="p-6">
                                        <div className="rounded-xl p-6" style={{ backgroundColor: 'var(--cream)', border: '1px solid var(--brown-pale)' }}>
                                            <div className="flex items-center justify-between mb-4">
                                                <div>
                                                    <h3 className="font-semibold" style={{ color: 'var(--text-dark)' }}>Datos de pago</h3>
                                                    <p className="text-xs" style={{ color: 'var(--text-light)' }}>
                                                        Introduce tus datos bancarios para el cobro del anuncio.
                                                    </p>
                                                </div>
                                            </div>

                                            {bankData.length > 0 && (
                                                <div className="mb-6 space-y-3">
                                                    {bankData.map((item) => (
                                                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg" style={{ borderColor: 'var(--brown-pale)' }}>
                                                            <div>
                                                                <p className="font-medium text-sm" style={{ color: 'var(--text-dark)' }}>{item.account_holder}</p>
                                                                <p className="text-xs" style={{ color: 'var(--text-light)' }}>•••• {item.iban?.slice(-4)}</p>
                                                                {item.is_default && (
                                                                    <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'var(--cream-dark)', color: 'var(--terracotta)' }}>
                                                                        Principal
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            <Link
                                                href="/bank-data"
                                                className="inline-flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-lg transition"
                                                style={{ backgroundColor: 'var(--terracotta)' }}
                                            >
                                                <IconCreditCard />
                                                {bankData.length === 0 ? 'Añadir datos de pago' : 'Gestionar métodos de pago'}
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* Tab: Negocios */}
                                {activeTab === 'negocios' && isOwner && (
                                    <div>
                                        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--brown-pale)' }}>
                                            <div>
                                                <h3 className="font-semibold" style={{ color: 'var(--text-dark)' }}>Mis negocios</h3>
                                                <p className="text-xs" style={{ color: 'var(--text-light)' }}>
                                                    {ownerPlaces.length === 0
                                                        ? 'No tienes negocios registrados'
                                                        : `${ownerPlaces.length} negocio${ownerPlaces.length > 1 ? 's' : ''}`
                                                    }
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setShowCreateModal(true)}
                                                className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-lg transition"
                                                style={{ backgroundColor: 'var(--terracotta)' }}
                                            >
                                                <IconPlus />
                                                Añadir negocio
                                            </button>
                                        </div>
                                        <div className="p-6">
                                            {ownerPlaces.length === 0 ? (
                                                <div className="text-center py-12" style={{ color: 'var(--text-light)' }}>
                                                    <div className="text-5xl mb-3 opacity-20">🏪</div>
                                                    <p className="text-sm">Aún no tienes negocios asociados.</p>
                                                    <p className="text-xs mt-1">Haz clic en "Añadir negocio" para crear el primero.</p>
                                                </div>
                                            ) : (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {ownerPlaces.map(place => (
                                                        <OwnerPlaceCard
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

                                {/* Tab: Favoritos */}
                                {activeTab === 'likes' && (
                                    <div>
                                        <div className="px-6 py-4 border-b flex flex-wrap items-center justify-between gap-3" style={{ borderColor: 'var(--brown-pale)' }}>
                                            <div>
                                                <h3 className="font-semibold" style={{ color: 'var(--text-dark)' }}>Lugares favoritos</h3>
                                                <p className="text-xs" style={{ color: 'var(--text-light)' }}>
                                                    {likedPlaces.length === 0
                                                        ? 'No has guardado ningún lugar'
                                                        : `${filteredLikedPlaces.length} de ${likedPlaces.length} favorito${likedPlaces.length > 1 ? 's' : ''}`
                                                    }
                                                </p>
                                            </div>
                                            {likedPlaces.length > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={likedFilter}
                                                        onChange={e => setLikedFilter(e.target.value)}
                                                        placeholder="Buscar en favoritos..."
                                                        className="dash-filter"
                                                    />
                                                    {likedFilter && (
                                                        <button
                                                            onClick={() => setLikedFilter('')}
                                                            className="text-xs"
                                                            style={{ color: 'var(--text-light)' }}
                                                        >
                                                            Limpiar
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6">
                                            {likedPlaces.length === 0 ? (
                                                <div className="text-center py-12" style={{ color: 'var(--text-light)' }}>
                                                    <div className="text-5xl mb-3 opacity-20">❤️</div>
                                                    <p className="text-sm">Aún no has guardado ningún lugar.</p>
                                                    <p className="text-xs mt-1">
                                                        Explora y haz clic en el corazón para guardar tus favoritos.
                                                    </p>
                                                    <Link
                                                        href="/explorar"
                                                        className="inline-block mt-4 px-4 py-2 text-white text-sm font-semibold rounded-lg transition"
                                                        style={{ backgroundColor: 'var(--terracotta)' }}
                                                    >
                                                        Explorar lugares
                                                    </Link>
                                                </div>
                                            ) : filteredLikedPlaces.length === 0 ? (
                                                <div className="text-center py-12" style={{ color: 'var(--text-light)' }}>
                                                    <p className="text-sm">No se encontraron resultados para "{likedFilter}".</p>
                                                    <button
                                                        onClick={() => setLikedFilter('')}
                                                        className="mt-2 text-xs hover:underline"
                                                        style={{ color: 'var(--terracotta)' }}
                                                    >
                                                        Limpiar filtro
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="places-grid">
                                                    {filteredLikedPlaces.map(place => (
                                                        <PlaceCard key={place.id} place={place} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Tab: Admin */}
                                {activeTab === 'admin' && isAdmin && (
                                    <div className="p-12 text-center" style={{ color: 'var(--text-light)' }}>
                                        <div className="text-5xl mb-3 opacity-20">👑</div>
                                        <button
                                            onClick={() => window.location.href = '/admin'}
                                            className="flex items-center gap-2 px-4 py-2 text-white text-sm font-semibold rounded-lg transition mx-auto"
                                            style={{ backgroundColor: 'var(--terracotta)' }}
                                        >
                                            <IconPlus />
                                            Administrar
                                        </button>
                                    </div>
                                )}

                                {/* Sin pestaña activa */}
                                {!isOwner && activeTab !== 'likes' && activeTab !== 'admin' && (
                                    <div className="p-12 text-center" style={{ color: 'var(--text-light)' }}>
                                        <div className="text-5xl mb-3 opacity-20">🔐</div>
                                        <p className="text-sm">No tienes permisos de propietario.</p>
                                        <p className="text-xs mt-1">Contacta con el administrador para obtener acceso.</p>
                                    </div>
                                )}
                            </div>
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

            <Footer
                sections={[
                    {
                        title: 'Explorar',
                        links: [
                            { label: 'Todos los lugares', href: '/' },
                            { label: 'Mapa interactivo', href: '/mapa' },
                            { label: 'Destacados', href: '/destacados' },
                        ],
                    },
                    {
                        title: 'Categorías',
                        links: [
                            { label: 'Restaurantes', href: '/categoria/restaurantes' },
                            { label: 'Bares', href: '/categoria/bares' },
                            { label: 'Hoteles', href: '/categoria/hoteles' },
                        ],
                    },
                    {
                        title: 'Propietarios',
                        links: [
                            { label: 'Registrar negocio', href: '/register' },
                            { label: 'Panel de control', href: '/dashboard' },
                            { label: 'Cómo funciona', href: '/como-funciona' },
                        ],
                    },
                    {
                        title: 'Legal',
                        links: [
                            { label: 'Privacidad', href: '/privacidad' },
                            { label: 'Términos de uso', href: '/terminos' },
                            { label: 'Contacto', href: '/contacto' },
                        ],
                    },
                ]}
            />
        </AuthenticatedLayout>
    );
}
