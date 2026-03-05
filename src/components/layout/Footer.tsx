import Link from "next/link";

export default function Footer() {
    return (
        <footer className="bg-gray-900 dark:bg-header-dark border-t border-gray-800 pt-16 pb-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <span className="font-display text-4xl text-primary tracking-wider mb-6 block">KONASTONE AUTOS</span>
                        <p className="text-gray-400 mb-6 max-w-md">Premium automotive dealership in Mombasa offering high-quality imported and locally used vehicles with flexible financing options.</p>
                        <div className="flex space-x-4">
                            <Link className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-primary hover:text-gray-900 transition-colors" href="#">
                                <span className="material-icons text-lg">facebook</span>
                            </Link>
                            <Link className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-primary hover:text-gray-900 transition-colors" href="#">
                                <span className="material-icons text-lg">camera_alt</span>
                            </Link>
                            <Link className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-primary hover:text-gray-900 transition-colors" href="#">
                                <span className="material-icons text-lg">music_note</span>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h4 className="font-display text-xl text-white tracking-wide mb-6">CONTACT US</h4>
                        <ul className="space-y-4 text-gray-400 text-sm">
                            <li className="flex items-start">
                                <span className="material-icons text-primary mr-3 text-lg">phone</span>
                                +254 722 511 803
                            </li>
                            <li className="flex items-start">
                                <span className="material-icons text-primary mr-3 text-lg">email</span>
                                sales@konastoneautos.co.ke
                            </li>
                            <li className="flex items-start">
                                <span className="material-icons text-primary mr-3 text-lg">location_on</span>
                                <span>Links Road, Nyali<br />Mombasa, Kenya</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-display text-xl text-white tracking-wide mb-6">QUICK LINKS</h4>
                        <ul className="space-y-2 text-sm text-slate-400 font-display transition-colors">
                            <li><Link href="/inventory" className="hover:text-primary transition-colors flex items-center gap-2 before:content-['>'] before:text-primary/50">Current Inventory</Link></li>
                            <li><Link href="/reviews" className="hover:text-primary transition-colors flex items-center gap-2 before:content-['>'] before:text-primary/50">Customer Reviews</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors flex items-center gap-2 before:content-['>'] before:text-primary/50">About Us</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors flex items-center gap-2 before:content-['>'] before:text-primary/50">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <p>© {new Date().getFullYear()} Konastone Autos. All rights reserved.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <Link className="hover:text-white transition-colors" href="#">Privacy Policy</Link>
                        <Link className="hover:text-white transition-colors" href="#">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
