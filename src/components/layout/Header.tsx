import Link from "next/link";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 bg-white dark:bg-header-dark border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link className="flex-shrink-0 flex items-center" href="/">
                            <span className="font-display text-4xl text-primary tracking-wider">KONASTONE AUTOS</span>
                        </Link>
                        <nav className="hidden md:ml-10 md:flex md:space-x-8">
                            <Link href="/inventory" className="text-gray-900 dark:text-white hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide transition-colors">
                                Inventory
                            </Link>
                            <Link href="/about" className="text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide transition-colors">
                                About Us
                            </Link>
                            <Link href="/reviews" className="text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide transition-colors">
                                Reviews
                            </Link>
                            <Link href="/contact" className="text-gray-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary px-3 py-2 rounded-md text-sm font-medium uppercase tracking-wide transition-colors">
                                Contact
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="hidden md:block">
                            <Link className="bg-primary text-gray-900 hover:bg-yellow-400 px-6 py-2.5 rounded font-display tracking-widest text-lg transition-colors" href="#">
                                GET IN TOUCH
                            </Link>
                        </div>
                        <div className="md:hidden flex items-center">
                            <button className="text-gray-500 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none" type="button">
                                <span className="material-icons text-3xl">menu</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
