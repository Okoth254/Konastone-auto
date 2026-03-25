"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-header-dark border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link className="shrink-0 flex items-center" href="/" onClick={closeMenu}>
                            <span className="font-display text-4xl text-primary tracking-wider">KONASTONE AUTOS</span>
                        </Link>
                        <nav className="hidden md:ml-10 md:flex p-1 bg-gray-100 dark:bg-surface-dark border border-gray-200 dark:border-border-subtle rounded-full shadow-inner items-center relative">
                            {[
                                { name: 'Inventory', href: '/inventory' },
                                { name: 'About Us', href: '/about' },
                                { name: 'Reviews', href: '/reviews' }
                            ].map((tab) => {
                                const isActive = pathname?.startsWith(tab.href) || false;
                                return (
                                    <Link key={tab.name} href={tab.href} className={`relative px-5 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-colors duration-300 z-10 ${isActive ? 'text-gray-900 dark:text-background-dark' : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white'}`}>
                                        {isActive && (
                                            <motion.div
                                                layoutId="header-active-pill"
                                                className="absolute inset-0 bg-primary rounded-full shadow-md"
                                                style={{ zIndex: -1 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        )}
                                        {tab.name}
                                    </Link>
                                );
                            })}
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

            {/* Mobile Menu Drawer (Framer Motion Enhanced) */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                            onClick={closeMenu}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 h-full w-[280px] bg-white dark:bg-header-dark shadow-2xl z-50 md:hidden flex flex-col pt-20 border-l border-gray-200 dark:border-gray-800"
                        >
                            <div className="flex flex-col gap-2 p-6 overflow-y-auto">
                                {[
                                    { name: 'Home', href: '/' },
                                    { name: 'Inventory', href: '/inventory' },
                                    { name: 'About Us', href: '/about' },
                                    { name: 'Reviews', href: '/reviews' },
                                ].map((link, i) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: 0.1 + i * 0.05 }}
                                    >
                                        <Link href={link.href} onClick={closeMenu} className={`block text-lg font-heading tracking-wider py-3 border-b border-gray-100 dark:border-gray-800 ${pathname === link.href ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                ))}

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ delay: 0.3 }}
                                    className="mt-8 flex flex-col gap-4"
                                >
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
                                </motion.div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}
