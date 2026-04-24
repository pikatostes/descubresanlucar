import PlaceEditForm from '@/Components/PlaceEditForm';

function IconStore() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none"
            viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 9l1-5h16l1 5M3 9h18M3 9v11a1 1 0 001 1h4v-5h8v5h4a1 1 0 001-1V9" />
        </svg>
    );
}

/**
 * PlaceEditModal
 *
 * Modal wrapper que contiene PlaceEditForm.
 * Gestiona el overlay, el encabezado y el cierre al hacer clic fuera.
 *
 * Props:
 *  - place      {Object|null}  Negocio a editar, o null para creación.
 *  - categories {Array}        Lista de categorías disponibles.
 *  - onClose    {Function}     Callback para cerrar el modal.
 */
export default function PlaceEditModal({ place, categories, onClose }) {
    return (
        <div
            className="fixed inset-0 z-[250] flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-6"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="relative w-full max-w-lg lg:max-w-4xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">

                {/* Cabecera */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white">
                        <IconStore />
                        <span className="font-semibold text-lg truncate max-w-xs">
                            {place ? `Editar ${place.name}` : 'Nuevo negocio'}
                        </span>
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
                <PlaceEditForm place={place} categories={categories} onClose={onClose} />
            </div>
        </div>
    );
}
