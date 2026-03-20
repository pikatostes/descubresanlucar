import ApplicationLogo from '@/Components/ApplicationLogo';
import Footer from '@/Components/Footer';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <>
            <div className="flex min-h-screen flex-col lg:flex-row bg-gray-100">
                {/* Columna/Sección izquierda: logo */}
                <div className="flex w-full lg:w-1/2 h-1/3 lg:h-auto items-center justify-center bg-gray-200 dark:bg-gray-800 p-6">
                    <Link href="/">
                        <ApplicationLogo className="h-40 lg:h-80 w-auto fill-current text-gray-500 dark:text-white" />
                    </Link>
                </div>

                {/* Columna/Sección derecha: formulario */}
                <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
                    <div className="w-full max-w-md bg-white px-6 py-8 shadow-md rounded-lg">
                        {children}
                    </div>
                </div>

            </div>
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
                            { label: 'Contacto', href: '/contacto' },
                        ],
                    },
                ]}
            />
        </>
    );
}