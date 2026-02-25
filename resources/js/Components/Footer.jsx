import { Link } from '@inertiajs/react';

export default function Footer({ sections = [] }) {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
                    {sections.map((section, index) => (
                        <div key={index}>
                            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-white">
                                {section.title}
                            </h4>
                            <ul className="space-y-2">
                                {section.links.map((link, idx) => (
                                    <li key={idx}>
                                        {link.href ? (
                                            <Link
                                                href={link.href}
                                                className="text-sm hover:underline hover:text-gray-900 dark:hover:text-white"
                                            >
                                                {link.label}
                                            </Link>
                                        ) : (
                                            <span className="text-sm">{link.label}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4 text-center text-sm">
                    &copy; {new Date().getFullYear()} Your Company. All rights reserved.
                </div>
            </div>
        </footer>
    );
}