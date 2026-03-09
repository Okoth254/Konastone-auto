import Link from "next/link";
import Image from "next/image";

export default function About() {
    return (
        <div className="flex-1 flex flex-col w-full py-12 gap-16 max-w-[1440px] mx-auto px-4 md:px-8">
            <section className="flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
                <span className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs font-bold bg-accent/10 text-accent border border-accent/20 font-mono">
                    <span className="material-symbols-outlined text-[16px]">verified</span>
                    PREMIER DIGITAL SHOWROOM
                </span>
                <h2 className="text-6xl md:text-8xl font-display tracking-wider font-bold uppercase" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100\" height=\"100\"><filter id=\"noise\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"4\" stitchTiles=\"stitch\"/></filter><rect width=\"100\" height=\"100\" filter=\"url(%23noise)\" opacity=\"0.5\"/></svg>')", WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", backgroundColor: "white" }}>
                    ABOUT KONASTONE
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed font-body">
                    Welcome to Konastone Autos, Mombasa's premier destination for high-quality vehicles. We pride ourselves on offering a seamless car buying experience, combining a modern digital showroom with exceptional customer service. Whether you're looking for cash purchases, flexible finance options, or fair trade-in evaluations, our dedicated team is here to guide you every step of the way.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                    <div className="bg-surface px-6 py-3 rounded border border-white/5 flex items-center gap-2 hover:border-accent/50 transition-colors">
                        <span className="material-symbols-outlined text-primary">payments</span>
                        <span className="font-medium text-sm font-display tracking-wider">CASH SALES</span>
                    </div>
                    <div className="bg-surface px-6 py-3 rounded border border-white/5 flex items-center gap-2 hover:border-accent/50 transition-colors">
                        <span className="material-symbols-outlined text-primary">account_balance</span>
                        <span className="font-medium text-sm font-display tracking-wider">ASSET FINANCE</span>
                    </div>
                    <div className="bg-surface px-6 py-3 rounded border border-white/5 flex items-center gap-2 hover:border-accent/50 transition-colors">
                        <span className="material-symbols-outlined text-primary">swap_horiz</span>
                        <span className="font-medium text-sm font-display tracking-wider">TRADE-INS</span>
                    </div>
                </div>
            </section>

            <section className="flex flex-col gap-6">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                    <h3 className="text-3xl font-display tracking-wider flex items-center gap-2 text-white">
                        <span className="material-symbols-outlined text-primary">location_on</span> OUR LOCATION
                    </h3>
                    <div className="font-mono text-sm text-slate-400 bg-surface px-4 py-2 border border-white/5">
                        <span className="text-accent mr-2">COORD:</span>4°02'58.2"S 39°40'09.1"E
                    </div>
                </div>
                <div className="w-full h-[400px] overflow-hidden scanline relative border border-white/10 bg-surface grayscale">
                    <div className="absolute inset-0 bg-background-dark flex items-center justify-center">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at center, #26C6DA 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                        <div className="absolute inset-0 opacity-40 mix-blend-luminosity bg-center bg-cover" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuC6LI6RYWzu6dDCwPq_yPjYC8DLAM6jyZD1Wq0qSoOutm59vjQyedPwfA2PgNBtR0-Nqwfhf_opgCm22trIcgOpajrl6TFD5BHUhkb8eTLKN8iLiZBo11my1jZNASbnKAajyaw5-4Lofn1mlgC0-yazpTBWe2B4ODZXcxTJF8AhE4UlhG2FdbIkzOVhOq0ZTubV7IHzeMV-0fuRXzcMhKYZ61YqcFvVVTYN3K_6OCWOwCotIUtXW7vHiAmoo57W8MwxsI9gnAG09GTf')" }} />
                        <div className="absolute z-10 flex flex-col items-center">
                            <div className="w-12 h-12 bg-primary/20 rounded flex items-center justify-center border border-primary/50">
                                <span className="material-symbols-outlined text-primary text-3xl">location_on</span>
                            </div>
                            <span className="mt-2 font-mono tracking-widest text-sm text-accent bg-black/80 px-3 py-1 border border-accent/20">MOMBASA ISLAND</span>
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-surface p-8 flex flex-col items-center text-center gap-4 border border-white/5 hover:border-primary/50 transition-colors group relative overflow-hidden border-l-[3px] border-l-transparent hover:border-l-accent">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 -mr-8 -mt-8 rotate-45 group-hover:bg-primary/10 transition-colors"></div>
                    <div className="w-16 h-16 rounded glass flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">call</span>
                    </div>
                    <div>
                        <h4 className="text-xl font-display tracking-wider mb-2 text-white">PHONE / WHATSAPP</h4>
                        <p className="text-lg font-mono text-slate-300 group-hover:text-primary transition-colors">+254 722 511 803</p>
                    </div>
                    <button className="mt-4 px-6 py-2 border border-primary/20 text-primary text-sm font-display tracking-wider hover:bg-primary hover:text-background-dark transition-colors w-full">
                        CALL US
                    </button>
                </div>

                <div className="bg-surface p-8 flex flex-col items-center text-center gap-4 border border-white/5 hover:border-primary/50 transition-colors group relative overflow-hidden border-l-[3px] border-l-transparent hover:border-l-accent">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 -mr-8 -mt-8 rotate-45 group-hover:bg-primary/10 transition-colors"></div>
                    <div className="w-16 h-16 rounded glass flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">mail</span>
                    </div>
                    <div>
                        <h4 className="text-xl font-display tracking-wider mb-2 text-white">EMAIL ADDRESS</h4>
                        <p className="text-sm font-mono text-slate-300 group-hover:text-primary transition-colors break-all">info@konastoneautos.com</p>
                    </div>
                    <button className="mt-4 px-6 py-2 border border-primary/20 text-primary text-sm font-display tracking-wider hover:bg-primary hover:text-background-dark transition-colors w-full">
                        SEND EMAIL
                    </button>
                </div>

                <div className="bg-surface p-8 flex flex-col items-center text-center gap-4 border border-white/5 hover:border-primary/50 transition-colors group relative overflow-hidden border-l-[3px] border-l-transparent hover:border-l-accent">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 -mr-8 -mt-8 rotate-45 group-hover:bg-primary/10 transition-colors"></div>
                    <div className="w-16 h-16 rounded glass flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-3xl">schedule</span>
                    </div>
                    <div>
                        <h4 className="text-xl font-display tracking-wider mb-2 text-white">OPERATING HOURS</h4>
                        <p className="text-sm font-mono text-slate-300">Mon - Sat</p>
                        <p className="text-lg font-mono text-primary mt-1">08:00 - 18:00</p>
                    </div>
                    <p className="mt-4 text-xs font-mono text-accent uppercase tracking-widest w-full border-t border-white/5 pt-4">SUNDAY: CLOSED</p>
                </div>
            </section>

            <section className="flex flex-wrap justify-center gap-8 py-8 border-t border-white/5">
                <Link className="text-2xl font-display tracking-wider text-slate-500 hover:text-primary transition-colors flex items-center gap-2 group" href="#">
                    FACEBOOK <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_outward</span>
                </Link>
                <span className="text-slate-700 hidden sm:inline font-mono">•</span>
                <Link className="text-2xl font-display tracking-wider text-slate-500 hover:text-primary transition-colors flex items-center gap-2 group" href="#">
                    INSTAGRAM <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_outward</span>
                </Link>
                <span className="text-slate-700 hidden sm:inline font-mono">•</span>
                <Link className="text-2xl font-display tracking-wider text-slate-500 hover:text-primary transition-colors flex items-center gap-2 group" href="#">
                    TIKTOK <span className="material-symbols-outlined text-[16px] opacity-0 group-hover:opacity-100 transition-opacity">arrow_outward</span>
                </Link>
            </section>
        </div>
    );
}
