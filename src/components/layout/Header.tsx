"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-header-dark border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link className="flex-shrink-0 flex items-center" href="/" onClick={closeMenu}>
                            <span className="font-display text-4xl text-primary tracking-wider">KONASTONE AUTOS</span>
                        </Link>
                        <nav className="hidden md:ml-10 md:flex md:space-x-8">
                            <Link href="/inventory" className={`px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide transition-colors ${pathname === '/inventory' ? 'text-primary' : 'text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary'}`}>
                                Inventory
                            </Link>
                            <Link href="/about" className={`px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide transition-colors ${pathname === '/about' ? 'text-primary' : 'text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary'}`}>
                                About Us
                            </Link>
                            <Link href="/reviews" className={`px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide transition-colors ${pathname === '/reviews' ? 'text-primary' : 'text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary'}`}>
                                Reviews
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:block">
                            <Link className="bg-primary text-gray-900 hover:bg-yellow-400 px-6 py-2.5 rounded font-display tracking-widest text-lg transition-colors" href="/about#contact">
                                GET IN TOUCH
                            </Link>
                        </div>
                        <div className="md:hidden flex items-center shadow-none">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="text-gray-500 hover:text-primary dark:text-gray-300 dark:hover:text-primary focus:outline-none transition-colors"
                                type="button"
                            >
                                <span className="material-symbols-outlined text-3xl">
                                    {isMobileMenuOpen ? 'close' : 'menu'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Drawer overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={closeMenu} />
            )}

            {/* Mobile Menu Drawer */}
            <div
                className={`fixed top-0 right-0 h-full w-[280px] bg-white dark:bg-header-dark shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col pt-20 border-l border-gray-200 dark:border-gray-800 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col gap-2 p-6 overflow-y-auto">
                    <Link href="/" onClick={closeMenu} className={`text-lg font-heading tracking-wider py-3 border-b border-gray-100 dark:border-gray-800 ${pathname === '/' ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                        Home
                    </Link>
                    <Link href="/inventory" onClick={closeMenu} className={`text-lg font-heading tracking-wider py-3 border-b border-gray-100 dark:border-gray-800 ${pathname === '/inventory' ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                        Inventory
                    </Link>
                    <Link href="/about" onClick={closeMenu} className={`text-lg font-heading tracking-wider py-3 border-b border-gray-100 dark:border-gray-800 ${pathname === '/about' ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                        About Us
                    </Link>
                    <Link href="/reviews" onClick={closeMenu} className={`text-lg font-heading tracking-wider py-3 border-b border-gray-100 dark:border-gray-800 ${pathname === '/reviews' ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                        Reviews
                    </Link>

                    <div className="mt-8 flex flex-col gap-4">
                        <Link href="/about#contact" onClick={closeMenu} className="bg-primary text-gray-900 hover:bg-yellow-400 py-3 rounded text-center font-display tracking-widest text-lg transition-colors w-full shadow-lg">
                            GET IN TOUCH
                        </Link>

                        <div className="mt-6 flex flex-col gap-3 text-sm text-gray-500 dark:text-gray-400">
                            <a href={`tel:${siteConfig.contact.phoneFormatted}`} className="flex items-center gap-3 hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-primary">call</span>
                                {siteConfig.contact.phone}
                            </a>
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary">location_on</span>
                                {siteConfig.contact.address}, {siteConfig.contact.city}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
