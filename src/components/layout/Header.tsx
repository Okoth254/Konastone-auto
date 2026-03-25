"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();

    const closeMenu = () => setIsMobileMenuOpen(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 12);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

    return (
        <header className={`sticky top-0 z-50 border-b transition-all duration-300 ${
            isScrolled
                ? "bg-white/75 dark:bg-header-dark/70 backdrop-blur-xl border-gray-200/70 dark:border-gray-700/70 shadow-[0_8px_30px_rgba(0,0,0,0.08)]"
                : "bg-white dark:bg-header-dark border-gray-200 dark:border-gray-800"
        }`}>
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
                            <Link className="btn-premium bg-primary text-gray-900 hover:bg-yellow-400 px-6 py-2.5 rounded font-display tracking-widest text-lg transition-colors" href="/about#contact">
                                GET IN TOUCH
                            </Link>
                        </div>
                        <div className="md:hidden flex items-center shadow-none">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="tap-highlight-none min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-gray-500 hover:text-primary dark:text-gray-300 dark:hover:text-primary focus:outline-none transition-colors"
                                type="button"
                                aria-expanded={isMobileMenuOpen}
                                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                            >
                                <span className="material-symbols-outlined text-3xl">
                                    {isMobileMenuOpen ? 'close' : 'menu'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Full Screen Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-md md:hidden"
                            onClick={closeMenu}
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 16 }}
                            transition={{ type: "spring", damping: 24, stiffness: 220 }}
                            className="safe-bottom fixed inset-0 z-50 md:hidden bg-white/95 dark:bg-header-dark/95 backdrop-blur-2xl pt-24"
                        >
                            <div className="flex flex-col gap-4 p-6 overflow-y-auto h-full">
                                {[
                                    { name: 'Home', href: '/' },
                                    { name: 'Inventory', href: '/inventory' },
                                    { name: 'About Us', href: '/about' },
                                    { name: 'Reviews', href: '/reviews' },
                                ].map((link, i) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, y: 18 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ delay: 0.08 + i * 0.06, type: "spring", stiffness: 260, damping: 26 }}
                                    >
                                        <Link href={link.href} onClick={closeMenu} className={`tap-highlight-none block text-3xl font-heading tracking-wider py-4 border-b border-gray-200/70 dark:border-gray-800/80 ${pathname === link.href ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                                            {link.name}
                                        </Link>
                                    </motion.div>
                                ))}

                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 20 }}
                                    transition={{ delay: 0.35 }}
                                    className="mt-auto pb-6 flex flex-col gap-4"
                                >
                                    <Link href="/about#contact" onClick={closeMenu} className="btn-premium bg-primary text-gray-900 hover:bg-yellow-400 py-3 rounded text-center font-display tracking-widest text-lg transition-colors w-full shadow-lg">
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
