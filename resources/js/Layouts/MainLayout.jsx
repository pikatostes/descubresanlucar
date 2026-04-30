import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import { usePage } from '@inertiajs/react';

export default function MainLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <>
            <Navbar auth={auth} />
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
        </>
    );
}