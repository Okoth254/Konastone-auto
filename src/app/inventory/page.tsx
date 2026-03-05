import Link from "next/link";
import Image from "next/image";

export default function Inventory() {
    return (
        <div className="flex-1 flex flex-col max-w-[1440px] mx-auto w-full px-10 py-8 gap-8">
            {/* Page Title Area */}
            <div className="flex flex-col gap-2">
                <h1 className="text-white text-6xl font-display leading-tight tracking-wider uppercase">VEHICLE INVENTORY</h1>
                <div className="inline-flex items-center">
                    <span className="text-accent text-sm font-bold tracking-widest px-3 py-1 bg-accent/10 border border-accent/30 rounded uppercase">47 VEHICLES AVAILABLE</span>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-[280px] shrink-0 flex flex-col gap-6">
                    <div className="bg-card-bg border border-border-color rounded-lg p-5 flex flex-col gap-5">
                        <h3 className="text-white font-display text-xl tracking-wider uppercase mb-2">Filter By Status</h3>
                        <div className="flex flex-col gap-3">
                            <label className="flex items-center gap-3 p-3 rounded bg-primary/10 border border-primary/30 cursor-pointer transition-colors hover:bg-primary/20">
                                <input defaultChecked className="hidden" name="status" type="radio" value="new" />
                                <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                                </div>
                                <span className="text-white font-display tracking-wider uppercase text-lg">NEW ARRIVALS!!!</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 rounded bg-card-bg-hover border border-border-color cursor-pointer transition-colors hover:border-primary/50">
                                <input className="hidden" name="status" type="radio" value="foreign" />
                                <div className="w-4 h-4 rounded-full border-2 border-slate-500 flex items-center justify-center"></div>
                                <span className="text-slate-300 font-display tracking-wider uppercase text-lg">FOREIGN USED</span>
                            </label>
                            <label className="flex items-center gap-3 p-3 rounded bg-card-bg-hover border border-border-color cursor-pointer transition-colors hover:border-primary/50">
                                <input className="hidden" name="status" type="radio" value="shipment" />
                                <div className="w-4 h-4 rounded-full border-2 border-slate-500 flex items-center justify-center"></div>
                                <span className="text-slate-300 font-display tracking-wider uppercase text-lg">ON SHIPMENT</span>
                            </label>
                        </div>
                        <div className="h-px bg-border-color my-2"></div>
                        <div className="flex flex-col gap-4">
                            <label className="flex flex-col gap-2">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Make</span>
                                <select className="form-input flex w-full resize-none overflow-hidden rounded text-white focus:outline-0 focus:ring-1 border border-border-color bg-card-bg-hover focus:border-primary focus:ring-primary h-12 bg-[image:--select-button-svg] p-3 text-sm font-medium" defaultValue="all">
                                    <option value="all">All Makes</option>
                                    <option value="toyota">Toyota</option>
                                    <option value="honda">Honda</option>
                                    <option value="mercedes">Mercedes-Benz</option>
                                    <option value="bmw">BMW</option>
                                    <option value="mazda">Mazda</option>
                                </select>
                            </label>
                            <label className="flex flex-col gap-2">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Model</span>
                                <select className="form-input flex w-full resize-none overflow-hidden rounded text-white focus:outline-0 focus:ring-1 border border-border-color bg-card-bg-hover focus:border-primary focus:ring-primary h-12 bg-[image:--select-button-svg] p-3 text-sm font-medium" defaultValue="all">
                                    <option value="all">All Models</option>
                                    <option value="harrier">Harrier</option>
                                    <option value="prado">Land Cruiser Prado</option>
                                    <option value="cclass">C-Class</option>
                                    <option value="cx5">CX-5</option>
                                </select>
                            </label>
                        </div>
                        <div className="h-px bg-border-color my-2"></div>
                        {/* Year Slider */}
                        <div className="flex flex-col gap-4">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Year Range</span>
                            <div className="flex items-center justify-between text-white text-sm font-mono bg-card-bg-hover px-2 py-1 rounded">
                                <span>2015</span>
                                <span className="text-primary">-</span>
                                <span>2024</span>
                            </div>
                            <div className="flex h-6 w-full pt-2">
                                <div className="relative flex h-1 w-full rounded-sm bg-border-color">
                                    <div className="absolute left-[30%] right-[10%] h-1 rounded-sm bg-primary"></div>
                                    <div className="absolute left-[30%] -top-1.5 size-4 rounded-full bg-primary cursor-pointer border-2 border-card-bg hover:scale-110 transition-transform shadow-[0_0_10px_rgba(255,193,5,0.5)]"></div>
                                    <div className="absolute right-[10%] -top-1.5 size-4 rounded-full bg-primary cursor-pointer border-2 border-card-bg hover:scale-110 transition-transform shadow-[0_0_10px_rgba(255,193,5,0.5)]"></div>
                                </div>
                            </div>
                        </div>
                        <div className="h-px bg-border-color my-2"></div>
                        {/* Price Slider */}
                        <div className="flex flex-col gap-4">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Price (KES)</span>
                            <div className="flex items-center justify-between text-white text-sm font-mono bg-card-bg-hover px-2 py-1 rounded">
                                <span>2.5M</span>
                                <span className="text-primary">-</span>
                                <span>8.0M</span>
                            </div>
                            <div className="flex h-6 w-full pt-2">
                                <div className="relative flex h-1 w-full rounded-sm bg-border-color">
                                    <div className="absolute left-[20%] right-[40%] h-1 rounded-sm bg-primary"></div>
                                    <div className="absolute left-[20%] -top-1.5 size-4 rounded-full bg-primary cursor-pointer border-2 border-card-bg hover:scale-110 transition-transform shadow-[0_0_10px_rgba(255,193,5,0.5)]"></div>
                                    <div className="absolute right-[40%] -top-1.5 size-4 rounded-full bg-primary cursor-pointer border-2 border-card-bg hover:scale-110 transition-transform shadow-[0_0_10px_rgba(255,193,5,0.5)]"></div>
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-4 h-12 rounded border border-primary/50 text-primary hover:bg-primary/10 transition-colors font-display tracking-widest uppercase text-lg">
                            Apply Filters
                        </button>
                    </div>
                </aside>

                {/* Grid Area */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">

                    {/* Card 1: New Arrival */}
                    <div className="group bg-card-bg rounded-lg overflow-hidden border-t-4 border-primary border-x border-b border-border-color hover:border-primary/50 transition-all flex flex-col h-full shadow-lg">
                        <div className="relative aspect-[4/3] overflow-hidden bg-background-dark">
                            <img alt="White Toyota Land Cruiser Prado parked outdoors" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="White Toyota Land Cruiser Prado parked outdoors" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBfpf4eTQ59kJHxeVgHu5KNlklHICQHSBTdVn5xT_Ug4l4HXanFoMKX-bYg4Oe4dZ_qDPnls5ldgwVJJs59Dl-78Kps9jpegmk2VaL-aozmLz_5R0WGjTfjo0tUpwsSKrXT40p-LWSobA4pIqEGNFMQ8LdJTCXCa16S8Q8ra7c3yHm3X8o6x5f5j3uB8_gQyOeZLxoWK6mqUj_h1RptY_zuLN-5knX2-IsSl8nqCa3Qsi3R_rzADFq0-6qvsamHP6pU5bylrf8rA2z" />
                            <div className="absolute top-3 left-3 bg-primary text-background-dark px-3 py-1 rounded text-grunge text-lg font-bold shadow-md">
                                NEW ARRIVAL
                            </div>
                            <div className="absolute bottom-3 right-3 bg-background-dark/80 backdrop-blur text-white px-2 py-1 rounded text-xs font-mono border border-border-color flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px] text-slate-400">photo_camera</span>
                                12
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1 gap-4">
                            <div>
                                <h3 className="text-white font-display text-2xl tracking-wide uppercase line-clamp-1 group-hover:text-primary transition-colors">2022 Toyota Land Cruiser Prado</h3>
                                <p className="text-slate-400 text-sm">TX-L Package 2.7L Petrol</p>
                            </div>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-slate-300 border-y border-border-color py-3">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-primary/70">speed</span>
                                    <span>24,500 km</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-primary/70">local_gas_station</span>
                                    <span>Petrol</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-primary/70">settings</span>
                                    <span>Automatic</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-primary/70">palette</span>
                                    <span>Pearl White</span>
                                </div>
                            </div>
                            <div className="mt-auto pt-2 flex items-end justify-between">
                                <div className="flex flex-col">
                                    <span className="text-slate-500 text-xs uppercase tracking-wider font-bold">Price</span>
                                    <span className="text-primary font-display text-3xl tracking-wide">KES 8,500,000</span>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Link href="/vehicle/1" className="flex items-center justify-center flex-1 h-10 rounded border border-border-color hover:border-white text-white transition-colors text-sm font-medium uppercase tracking-wider">
                                    View Details
                                </Link>
                                <button className="w-10 h-10 rounded bg-primary hover:bg-primary/90 text-background-dark flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined">chat</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: On Shipment */}
                    <div className="group bg-card-bg rounded-lg overflow-hidden border border-border-color hover:border-accent/50 transition-all flex flex-col h-full shadow-lg relative">
                        <div className="absolute top-0 left-0 w-full h-1 bg-accent"></div>
                        <div className="relative aspect-[4/3] overflow-hidden bg-background-dark">
                            <img alt="Black BMW X5 driving on road" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" data-alt="Black BMW X5 driving on road" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEIK3a62CDM42uGDvBfI1P1uxsAxSG0NgxX0clxMpyF5ypYMpQQlytHPzqr0odzImT_P7LDRhZpj74aMzUasFjuUVQGugfc4_Pl8rcuxW8ycjKCc4omLLlOx4RkJW8JJC3lHvKEmzkbzV5FsDgDpB6kQaFQht6ENbcfhoSjZhJsuRG9i9L031XycdDcnODF9FAkhpxEl4GnOOHqvX9kAdnOu1QTCj1zTJWWrJnaOYB0xdD0B_20GrL2XeT_WNRsY6WQwPdJbwyqGSc" />
                            <div className="absolute inset-0 bg-background-dark/20 group-hover:bg-transparent transition-colors"></div>
                            <div className="absolute top-3 left-3 bg-accent text-background-dark px-3 py-1 rounded font-display tracking-widest text-lg font-bold shadow-md uppercase">
                                IN TRANSIT
                            </div>
                            <div className="absolute top-3 right-3 bg-background-dark/90 text-accent px-2 py-1 rounded font-mono text-xs font-bold border border-accent/30 shadow-md">
                                ETA: 14 DAYS
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1 gap-4">
                            <div>
                                <h3 className="text-white font-display text-2xl tracking-wide uppercase line-clamp-1 group-hover:text-accent transition-colors">2019 BMW X5 xDrive40i</h3>
                                <p className="text-slate-400 text-sm">M Sport Package 3.0L</p>
                            </div>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-slate-300 border-y border-border-color py-3">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-accent/70">speed</span>
                                    <span>45,200 km</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-accent/70">local_gas_station</span>
                                    <span>Petrol</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-accent/70">settings</span>
                                    <span>Automatic</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-accent/70">palette</span>
                                    <span>Carbon Black</span>
                                </div>
                            </div>
                            <div className="mt-auto pt-2 flex items-end justify-between">
                                <div className="flex flex-col">
                                    <span className="text-slate-500 text-xs uppercase tracking-wider font-bold">Landed Price</span>
                                    <span className="text-white font-display text-3xl tracking-wide">KES 9,200,000</span>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Link href="/vehicle/2" className="flex items-center justify-center flex-1 h-10 rounded border border-border-color hover:border-white text-white transition-colors text-sm font-medium uppercase tracking-wider">
                                    View Details
                                </Link>
                                <button className="flex items-center justify-center gap-2 flex-1 h-10 rounded bg-card-bg-hover hover:bg-card-bg border border-accent/30 text-accent transition-colors text-sm font-medium uppercase tracking-wider">
                                    <span className="material-symbols-outlined text-[18px]">bookmark_add</span>
                                    Reserve
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 3: Foreign Used */}
                    <div className="group bg-card-bg rounded-lg overflow-hidden border border-border-color hover:border-slate-400 transition-all flex flex-col h-full shadow-lg">
                        <div className="relative aspect-[4/3] overflow-hidden bg-background-dark">
                            <img alt="Silver Mercedes C-Class sedan" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Silver Mercedes C-Class sedan" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0SNR4nlIA3qrG1LVPBB2Rp1O7SyjIzGhPMmXBgm6Zqt1UXQpQ-ksSjRUXM_TSFjZ5k8VjlghvybfcaIChRxmIE5A5V_zO8D5qSen6M3ca3A9jDQcS6JStc_41vTom3VJ3ahbzhmdexTXfVOfWEQjhIPqx1vSjjH06ja44eXKUfR1nmE1vmFVy1l_ZItu_8yQ9CeSDbtivtfB2wspe-yB06R8O4o05YGOnNovCzKXxRVk2tPxniNezSL45WcpNeWJzskm2PiJ4GIp8" />
                        </div>
                        <div className="p-5 flex flex-col flex-1 gap-4">
                            <div>
                                <h3 className="text-white font-display text-2xl tracking-wide uppercase line-clamp-1 group-hover:text-white transition-colors">2018 Mercedes-Benz C200</h3>
                                <p className="text-slate-400 text-sm">AMG Line Premium Plus</p>
                            </div>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-slate-300 border-y border-border-color py-3">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-slate-500">speed</span>
                                    <span>52,100 km</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-slate-500">local_gas_station</span>
                                    <span>Petrol</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-slate-500">settings</span>
                                    <span>Automatic</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-slate-500">palette</span>
                                    <span>Iridium Silver</span>
                                </div>
                            </div>
                            <div className="mt-auto pt-2 flex items-end justify-between">
                                <div className="flex flex-col">
                                    <span className="text-slate-500 text-xs uppercase tracking-wider font-bold">Price</span>
                                    <span className="text-primary font-display text-3xl tracking-wide">KES 4,800,000</span>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Link href="/vehicle/3" className="flex items-center justify-center flex-1 h-10 rounded border border-border-color hover:border-white text-white transition-colors text-sm font-medium uppercase tracking-wider">
                                    View Details
                                </Link>
                                <button className="w-10 h-10 rounded bg-primary hover:bg-primary/90 text-background-dark flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined">chat</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Card 4: New Arrival */}
                    <div className="group bg-card-bg rounded-lg overflow-hidden border-t-4 border-primary border-x border-b border-border-color hover:border-primary/50 transition-all flex flex-col h-full shadow-lg">
                        <div className="relative aspect-[4/3] overflow-hidden bg-background-dark">
                            <img alt="Red Mazda CX-5 SUV parked" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" data-alt="Red Mazda CX-5 SUV parked" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp9kMTcoU589oj2h9LK3TPuvdU9viAOMejXM-1hSZG61VyOj1vQL4ZgKVjEGOxNKXg7QCEk9s9ugbO7eo1MDLEzbLfbuoIGDF9n7LO9HysK2p91hy1g4Z_9EYASaaZcXCVHcfxCMtBHb4vxl22qZd0U3wdE6Mx--VwKW-0jCeNPynYwGNj2kRYSmQBC3vPoWmojcesCMEliyQGuGgK8esXXESzoIH-XwUQn75yd8OjmA8odGWPbaNSZztU8bcpBamH9BafSsL_rR95" />
                            <div className="absolute top-3 left-3 bg-primary text-background-dark px-3 py-1 rounded text-grunge text-lg font-bold shadow-md">
                                NEW ARRIVAL
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1 gap-4">
                            <div>
                                <h3 className="text-white font-display text-2xl tracking-wide uppercase line-clamp-1 group-hover:text-primary transition-colors">2017 Mazda CX-5</h3>
                                <p className="text-slate-400 text-sm">XD L Package 2.2L Diesel</p>
                            </div>
                            <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-slate-300 border-y border-border-color py-3">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-primary/70">speed</span>
                                    <span>68,000 km</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-primary/70">local_gas_station</span>
                                    <span>Diesel</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-primary/70">settings</span>
                                    <span>Automatic</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-primary/70">palette</span>
                                    <span>Soul Red Crystal</span>
                                </div>
                            </div>
                            <div className="mt-auto pt-2 flex items-end justify-between">
                                <div className="flex flex-col">
                                    <span className="text-slate-500 text-xs uppercase tracking-wider font-bold">Price</span>
                                    <span className="text-primary font-display text-3xl tracking-wide">KES 3,200,000</span>
                                </div>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <Link href="/vehicle/4" className="flex items-center justify-center flex-1 h-10 rounded border border-border-color hover:border-white text-white transition-colors text-sm font-medium uppercase tracking-wider">
                                    View Details
                                </Link>
                                <button className="w-10 h-10 rounded bg-primary hover:bg-primary/90 text-background-dark flex items-center justify-center transition-colors">
                                    <span className="material-symbols-outlined">chat</span>
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
