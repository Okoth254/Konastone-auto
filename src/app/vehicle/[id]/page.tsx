import Link from "next/link";
import Image from "next/image";

export default function VehicleDetail() {
    return (
        <div className="flex-1 flex flex-col max-w-[1440px] mx-auto w-full px-4 md:px-8 py-6 gap-8 relative z-10 scanline">
            <nav className="flex flex-wrap gap-2 text-sm text-slate-500">
                <Link className="hover:text-primary transition-colors" href="/">Home</Link>
                <span>/</span>
                <Link className="hover:text-primary transition-colors" href="/inventory">Listings</Link>
                <span>/</span>
                <span className="text-slate-300">Audi A6 S-Line TFSI Quattro</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 flex flex-col gap-4">
                    <div className="w-full aspect-video bg-surface-dark rounded-xl overflow-hidden relative border border-border-subtle">
                        <img alt="Audi A6 S-Line Front View" className="w-full h-full object-cover" data-alt="Dark Audi A6 front view" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgKbJXhhlTAf-5vOyq3Nk2MjFsPmdLj-J5knTwYqtZgJEISUl5FuNRUx41biQ9eyQu54Wd_uKbIWXHcCIw6nX0L2RGQwf0kUTF9e-_agtKCFZndchPTD-YIHclZI6Z7oh5TJsaonPvOugPt-ZmBQ1xA2JBWTwWE36dR9ENlmIbnbE6_0ZWi3qdn6azt9SKxh78a6zu3opX57W5hnHqA9LC1f4zZafuS5HXiJbGr55GuWPI5vPJl2NVHmLRpA69x9lpqO05s07rp02P" />
                        <button className="absolute bottom-4 right-4 glass-dark p-2 rounded-full text-accent-teal hover:bg-accent-teal/20 transition-colors">
                            <span className="material-symbols-outlined">fullscreen</span>
                        </button>
                    </div>
                    <div className="grid grid-cols-6 gap-2 h-20 md:h-24">
                        <img alt="Thumb 1" className="w-full h-full object-cover rounded border-2 border-primary cursor-pointer" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0mP0NO1Qj_dtAkxQsVRbw4A1PKudnd7z-HkRipTNQPFc_luIP3h7DGCVbV6NJjlKqr892D_7AiM_y1i9vqpe9c9wad-7g6gDnV3FMaDztOizu0C8iKSG_Ez7DNxHplGtRAm2AVuocfRzQVc7GfLMYcOnohOOcTVCGNuoy_Zl9SFzRWTbWdH-DYEy7vISdN0G8AFrnfXp1e101bsUpfen5ryuHTBFpoEBki5VnlEdfFGnKnAFCThxZGPdh5eGgFFvx49gmyZtcvjDt" />
                        <img alt="Thumb 2" className="w-full h-full object-cover rounded border border-border-subtle hover:border-primary/50 cursor-pointer opacity-70 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9t86XLXhIytQQZ4e4huuPNphyR4J0r1BbCCUGg16nMMzZupDi-XIDTlCcEaXqfPvLuuaDlGn7Mx0yPKPjafpwCNAojzygH1tpx_WuNtfVVcLSvfeFly_uMrk-BIkGNBvGBoEI4APE93WGiWzCGQpt4GW7UMsnOLqZ-qH3yZY-tBTcKOmRx5odgrVZ5nuaL-pNKfDQ6bi0kzp3rG7bIfIH9wIKt79i0RLsN2ijGDvKdy2vTutqTeAwGXbf7bkAD3J3FD_vVmME-9d6" />
                        <img alt="Thumb 3" className="w-full h-full object-cover rounded border border-border-subtle hover:border-primary/50 cursor-pointer opacity-70 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQE4k-ULccgVaOzE-cihUKH9z2cfXiQhKKAjz_G7QdIv4eaJ2wdeEY4X-Rh7fTTtn9CJBjDD8nO-XcGNa9WHXcgkRpSOQFa2XpIzrjYClzy3QKxJuENleWDRE2ZmfReRzU3-TnHzEcgmqVf9U3kzkhOu8QhOq1OJylYz2escvr75Yr-UCrBecySYGuJKI-yOgnpwZ8y6QdS8aF7gxXICsIhKsGiHbhnTpIhMclTtdpit2f0bR6zV-1rSaRq32AUEp72vbMc522m0QW" />
                        <img alt="Thumb 4" className="w-full h-full object-cover rounded border border-border-subtle hover:border-primary/50 cursor-pointer opacity-70 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWdc4yyZ8WkWhcY0sny8WeC6safFZ2RCdtM2pFp9bT4rAr9q--7DC-C2sRsi3XNJd4QM0XOBPxwWMpJjz4t3XPOIvLWAcAV4E4V2-sgWB7LmiAqge_duri3ZY8ubheuXZz6YHwsGF-al9l2TGkaDayHRZ1YBaBUkdILobu0CHYnHnRrvfHbIvMwMvUjFug1XSi02KWEPydvF3vyunvruy3qsqv4geG1m5VFrEQm0ELfCEYr4PQwYyXGzo-SxoC-NvaVGd8QULWcgtF" />
                        <img alt="Thumb 5" className="w-full h-full object-cover rounded border border-border-subtle hover:border-primary/50 cursor-pointer opacity-70 hover:opacity-100 transition-all" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDIdI2ZFp56CS-rJkt3hS-WeRS_kG-z_7QckLqxdey82nScjDX0phFMO5AR7voQ-r7O-jzRviMvhdDHp5rLeyM9big1FLPgsertIzlfvjkXYq0nT6yORoA-XBZIhCCjNeyfcxsygpP_HTaC8xzoME1iy8rJqKwaWdzgIanqkKEd_EmtpXlKwOa3WaxlgvdujA7mySG0_tlxAiElGPpu4-XTdqOZ9bISrPvmUl7PYV2X0nKep6iP82pTyegNRao-UusTtTT8UGxsL1KZ" />
                        <div className="relative w-full h-full rounded border border-border-subtle bg-surface-dark flex items-center justify-center cursor-pointer hover:bg-border-subtle transition-colors">
                            <span className="text-sm font-medium text-slate-300">+12 Photos</span>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 bg-surface-dark rounded-xl p-6 flex flex-col gap-6 border border-border-subtle">
                    <div>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-primary/20 text-primary mb-3">
                            <span className="material-symbols-outlined text-[14px] text-primary">new_releases</span>
                            NEW ARRIVAL
                        </span>
                        <h2 className="text-4xl font-heading tracking-wide mb-2 text-slate-100">AUDI A6 S-LINE TFSI QUATTRO</h2>
                        <p className="text-3xl font-heading text-primary tracking-wide">KES 4.3M</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 border-t border-border-subtle pt-6">
                        <div className="flex items-center gap-3 bg-background-dark p-3 rounded-lg border border-border-subtle">
                            <span className="material-symbols-outlined text-accent-teal">calendar_month</span>
                            <div>
                                <p className="text-xs text-slate-400">Year</p>
                                <p className="font-medium text-slate-200">2018</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-background-dark p-3 rounded-lg border border-border-subtle">
                            <span className="material-symbols-outlined text-accent-teal">speed</span>
                            <div>
                                <p className="text-xs text-slate-400">Mileage</p>
                                <p className="font-medium text-slate-200">68,000 km</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-background-dark p-3 rounded-lg border border-border-subtle">
                            <span className="material-symbols-outlined text-accent-teal">settings</span>
                            <div>
                                <p className="text-xs text-slate-400">Transmission</p>
                                <p className="font-medium text-slate-200">Automatic</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-background-dark p-3 rounded-lg border border-border-subtle">
                            <span className="material-symbols-outlined text-accent-teal">local_gas_station</span>
                            <div>
                                <p className="text-xs text-slate-400">Engine</p>
                                <p className="font-medium text-slate-200">3000cc</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 mt-auto pt-4">
                        <button className="w-full flex items-center justify-center gap-2 rounded-full h-12 bg-accent-red text-white font-bold shadow-lg hover:bg-opacity-80 transition-colors">
                            <span className="material-symbols-outlined text-white">call</span>
                            Call Now
                        </button>
                        <button className="w-full flex items-center justify-center gap-2 rounded-full h-12 bg-primary text-background-dark font-bold shadow-lg hover:bg-yellow-500 transition-colors">
                            <span className="material-symbols-outlined text-background-dark">chat</span>
                            WhatsApp
                        </button>
                        <div className="flex gap-3">
                            <button className="flex-1 flex items-center justify-center gap-2 rounded-full h-10 border border-border-subtle hover:bg-border-subtle transition-colors text-sm font-medium text-slate-300">
                                <span className="material-symbols-outlined text-[18px] text-accent-teal">favorite_border</span>
                                Save
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-2 rounded-full h-10 border border-border-subtle hover:bg-border-subtle transition-colors text-sm font-medium text-slate-300">
                                <span className="material-symbols-outlined text-[18px] text-accent-teal">compare_arrows</span>
                                Compare
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
                <div className="lg:col-span-2 flex flex-col gap-8">
                    <div className="bg-[#1E1E1E] rounded-xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 border border-border-subtle">
                        <div className="flex flex-col items-center text-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-surface-dark flex items-center justify-center text-primary mb-2 border border-border-subtle">
                                <span className="material-symbols-outlined text-primary">oil_barrel</span>
                            </div>
                            <h4 className="font-bold text-sm text-slate-200">Free Oil Change</h4>
                            <p className="text-xs text-slate-400">First service on us</p>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2 border-t md:border-t-0 md:border-l border-border-subtle pt-4 md:pt-0">
                            <div className="w-12 h-12 rounded-full bg-surface-dark flex items-center justify-center text-primary mb-2 border border-border-subtle">
                                <span className="material-symbols-outlined text-primary">verified_user</span>
                            </div>
                            <h4 className="font-bold text-sm text-slate-200">2 Months Warranty</h4>
                            <p className="text-xs text-slate-400">Peace of mind guaranteed</p>
                        </div>
                        <div className="flex flex-col items-center text-center gap-2 border-t md:border-t-0 md:border-l border-border-subtle pt-4 md:pt-0">
                            <div className="w-12 h-12 rounded-full bg-surface-dark flex items-center justify-center text-primary mb-2 border border-border-subtle">
                                <span className="material-symbols-outlined text-primary">assignment</span>
                            </div>
                            <h4 className="font-bold text-sm text-slate-200">Free Transfers</h4>
                            <p className="text-xs text-slate-400">Logbook transfer included</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-heading tracking-wide mb-4 flex items-center gap-2 text-slate-100">
                            <span className="material-symbols-outlined text-accent-teal">tune</span> Technical Specifications
                        </h3>
                        <div className="border border-border-subtle rounded-xl overflow-hidden text-sm">
                            <div className="grid grid-cols-2 bg-surface-dark p-3 border-b border-border-subtle">
                                <div className="text-slate-400">Make</div>
                                <div className="font-medium text-right text-slate-200">Audi</div>
                            </div>
                            <div className="grid grid-cols-2 bg-background-dark p-3 border-b border-border-subtle">
                                <div className="text-slate-400">Model</div>
                                <div className="font-medium text-right text-slate-200">A6 S-Line TFSI Quattro</div>
                            </div>
                            <div className="grid grid-cols-2 bg-surface-dark p-3 border-b border-border-subtle">
                                <div className="text-slate-400">Body Type</div>
                                <div className="font-medium text-right text-slate-200">Sedan</div>
                            </div>
                            <div className="grid grid-cols-2 bg-background-dark p-3 border-b border-border-subtle">
                                <div className="text-slate-400">Color</div>
                                <div className="font-medium text-right text-slate-200">Mythos Black Metallic</div>
                            </div>
                            <div className="grid grid-cols-2 bg-surface-dark p-3 border-b border-border-subtle">
                                <div className="text-slate-400">Fuel Type</div>
                                <div className="font-medium text-right text-slate-200">Petrol</div>
                            </div>
                            <div className="grid grid-cols-2 bg-background-dark p-3">
                                <div className="text-slate-400">Drive Type</div>
                                <div className="font-medium text-right text-slate-200">AWD (Quattro)</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-2xl font-heading tracking-wide mb-4 flex items-center gap-2 text-slate-100">
                            <span className="material-symbols-outlined text-accent-teal">star</span> Premium Features
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-3 py-1 rounded-full bg-accent-teal/20 text-accent-teal border border-accent-teal/30 text-sm font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px] text-accent-teal">all_out</span> Quattro AWD
                            </span>
                            <span className="px-3 py-1 rounded-full bg-accent-teal/20 text-accent-teal border border-accent-teal/30 text-sm font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px] text-accent-teal">wb_sunny</span> Sunroof
                            </span>
                            <span className="px-3 py-1 rounded-full bg-accent-teal/20 text-accent-teal border border-accent-teal/30 text-sm font-medium flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px] text-accent-teal">chair</span> Leather Seats
                            </span>
                            <span className="px-3 py-1 rounded-full bg-surface-dark border border-border-subtle text-slate-300 text-sm flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px] text-accent-teal">check</span> Matrix LED Headlights
                            </span>
                            <span className="px-3 py-1 rounded-full bg-surface-dark border border-border-subtle text-slate-300 text-sm flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px] text-accent-teal">check</span> Bang & Olufsen Sound
                            </span>
                            <span className="px-3 py-1 rounded-full bg-surface-dark border border-border-subtle text-slate-300 text-sm flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px] text-accent-teal">check</span> 360° Camera
                            </span>
                            <span className="px-3 py-1 rounded-full bg-surface-dark border border-border-subtle text-slate-300 text-sm flex items-center gap-1">
                                <span className="material-symbols-outlined text-[16px] text-accent-teal">check</span> Virtual Cockpit
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-6">
                    <div className="bg-surface-dark rounded-xl p-6 border border-border-subtle">
                        <h3 className="text-xl font-heading tracking-wide mb-4 flex items-center gap-2 text-slate-100">
                            <span className="material-symbols-outlined text-accent-teal">payments</span> Finance Options
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-400">Deposit (30%)</span>
                                    <span className="font-bold text-slate-200">KES 1.29M</span>
                                </div>
                                <input className="w-full accent-primary" max="80" min="10" type="range" defaultValue="30" />
                            </div>
                            <div>
                                <label className="text-sm text-slate-400 block mb-2">Tenure</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button className="py-2 border border-border-subtle rounded-lg text-sm hover:bg-background-dark transition-colors text-slate-300">12 Mo</button>
                                    <button className="py-2 border border-primary bg-primary/20 rounded-lg text-sm font-bold text-primary">24 Mo</button>
                                    <button className="py-2 border border-border-subtle rounded-lg text-sm hover:bg-background-dark transition-colors text-slate-300">36 Mo</button>
                                </div>
                            </div>
                            <div className="bg-background-dark rounded-lg p-4 mt-4 text-center border border-border-subtle">
                                <p className="text-sm text-slate-400 mb-1">Estimated Monthly</p>
                                <p className="text-2xl font-heading tracking-wide text-primary">KES 145,000</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-surface-dark rounded-xl p-6 border border-border-subtle">
                        <h3 className="text-xl font-heading tracking-wide mb-4 text-slate-100">Interested?</h3>
                        <form className="space-y-3">
                            <input className="w-full bg-background-dark border border-border-subtle rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-100 placeholder-slate-500" placeholder="Your Name" type="text" />
                            <input className="w-full bg-background-dark border border-border-subtle rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-100 placeholder-slate-500" placeholder="Phone Number" type="tel" />
                            <textarea className="w-full bg-background-dark border border-border-subtle rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-slate-100 placeholder-slate-500" placeholder="Message (Optional)" rows={2}></textarea>
                            <button className="w-full rounded-lg h-10 bg-primary text-background-dark font-bold hover:bg-yellow-500 transition-colors mt-2" type="button">
                                Book Viewing
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="mt-8 border-t border-border-subtle pt-8">
                <div className="flex justify-between items-end mb-6">
                    <h3 className="text-2xl font-heading tracking-wide text-slate-100">Similar Premium Vehicles</h3>
                    <a className="text-sm text-slate-400 hover:text-primary transition-colors flex items-center" href="#">View all <span className="material-symbols-outlined text-[16px]">chevron_right</span></a>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-surface-dark rounded-xl overflow-hidden group cursor-pointer border border-border-subtle hover:border-primary/50 transition-all">
                        <div className="aspect-[3/2] overflow-hidden relative">
                            <img alt="BMW 5 Series" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuArxzLkoFtRTiaBLYdd4ODQc9wDRmshIIhSuYwwiPNi5BTfs4Cijr375ASGr_1IAVouzZi35aMMOkkPBSSSIge0clk784EN7F-F0Nb1qXDtj-FauGVXnKpQf-cPsb0M2g6cbTnJj49JnGzzHDCf7SXUxdfpjtk_7nI3E2r9biwBVz4N8xxxLt969MnkqXYFi-Eu48NXukCBRdDsGmQhjEtH-z8T5m8WLxGg7veQO1gRBqd9LOe_jlwJ9ibIisErGxIyXfXE9fxmUCaO" />
                            <div className="absolute top-2 right-2 px-2 py-1 bg-surface-dark/90 backdrop-blur rounded text-xs font-bold text-primary border border-border-subtle">KES 4.5M</div>
                        </div>
                        <div className="p-4">
                            <p className="text-xs text-slate-400 mb-1">2019 • 55k km • Auto</p>
                            <h4 className="font-bold text-lg text-slate-200 group-hover:text-primary transition-colors">BMW 530i M-Sport</h4>
                        </div>
                    </div>
                    <div className="bg-surface-dark rounded-xl overflow-hidden group cursor-pointer border border-border-subtle hover:border-primary/50 transition-all">
                        <div className="aspect-[3/2] overflow-hidden relative">
                            <img alt="Mercedes E-Class" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDqLOebxLuLbJcxV-BreN3IozLldx0hb4zmWpZ3jLf6_Si6qm-Xo55Hcs0wj6cKDOksnVmhsrewc9GMOKRavUZcl3tklxypChiwM7f5mhwSLLjNZtONtwh4mvzZpP2AK9hCXvlArHkbUMQpqQ4YYutachtQ9V0LeY9A02tYJabBmWWWEqhh-oTruMctu6RfXPUNusYAeok5vnwhk1oYQ8eqt2T4j3cR0dO4E9n5PXzN06kQ_w91LTlsn51kecbxJvZpseuCM0Z-0jY7" />
                            <div className="absolute top-2 right-2 px-2 py-1 bg-surface-dark/90 backdrop-blur rounded text-xs font-bold text-primary border border-border-subtle">KES 4.8M</div>
                        </div>
                        <div className="p-4">
                            <p className="text-xs text-slate-400 mb-1">2018 • 42k km • Auto</p>
                            <h4 className="font-bold text-lg text-slate-200 group-hover:text-primary transition-colors">Mercedes-Benz E300 AMG</h4>
                        </div>
                    </div>
                    <div className="bg-surface-dark rounded-xl overflow-hidden group cursor-pointer border border-border-subtle hover:border-primary/50 transition-all hidden md:block">
                        <div className="aspect-[3/2] overflow-hidden relative">
                            <img alt="Porsche Panamera" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUGkT9WXkddqI9GR8GBbrp3JzAbu2YJIpcRy8UIGhqqiz_gT9U0veNpuGe6o23v0XqWpGlm2g_yvPHvQftJgYviZ-8hD-hTQGRel3TsniR4Jbm0BKXN2Z5MbZUY8nE8zF1fw90FAeUi920OrFaHd-3zE9AYzwq0BV_FOD-unlwK0ndAmhZeaEj3dXhQzJ9CZek8y_O-MokMAC2yofDB-4CuCFAZ5YMQtT_yxcoPvIFghpEKBv52_OhgxB71hn9p1JFHmGNVDG6q6Ul" />
                            <div className="absolute top-2 right-2 px-2 py-1 bg-surface-dark/90 backdrop-blur rounded text-xs font-bold text-primary border border-border-subtle">KES 5.2M</div>
                        </div>
                        <div className="p-4">
                            <p className="text-xs text-slate-400 mb-1">2017 • 70k km • Auto</p>
                            <h4 className="font-bold text-lg text-slate-200 group-hover:text-primary transition-colors">Porsche Panamera 4S</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
