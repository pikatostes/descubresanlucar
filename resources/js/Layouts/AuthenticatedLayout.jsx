import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { usePage } from '@inertiajs/react';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen" style={{ backgroundColor: 'var(--cream)' }}>
            <Navbar auth={auth} />

            {header && (
                <header className="bg-white shadow-sm">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>

            <Footer
                sections={[
                    {
                        title: 'Explorar',
                        links: [
                            { label: 'Todos los lugares', href: '/lugares' },
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
                            { label: 'Aviso Legal', href: '/aviso-legal' },
                            { label: 'Planes y Tarifas', href: '/precios' },
                            { label: 'Contacto', href: '/contacto' },
                        ],
                    },
                ]}
            />
        </div>
    );
}