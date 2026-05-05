import '../css/app.css';
import '../css/Navbar.css';
import '../css/Footer.css';
import '../css/Welcome.css';
import '../css/Explore.css';
import '../css/CategoryIndex.css';
import '../css/PlaceShow.css';
import '../css/HeroSection.css';
import '../css/tags.css';
import '../css/Legal.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'DescubreSanlúcar';

const authPages = [
    'Auth/Login',
    'Auth/Register',
    'Auth/ForgotPassword',
    'Auth/ResetPassword',
    'Auth/VerifyEmail',
    'Auth/ConfirmPassword',
    'Dashboard',
    'Profile/Edit',
    'BankData/Index',
];

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: async (name) => {
        const page = await resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob('./Pages/**/*.jsx'),
        );

        if (authPages.includes(name)) {
            return page;
        }

        const MainLayout = (await import('./Layouts/MainLayout.jsx')).default;
        page.default.layout = (page) => <MainLayout>{page}</MainLayout>;

        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
