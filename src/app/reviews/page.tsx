import Link from "next/link";
import Image from "next/image";

export default function Reviews() {
    return (
        <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 w-full mx-auto px-4 sm:px-10 py-8 relative z-10">
            {/* Header Section */}
            <div className="flex flex-col gap-2 mb-10">
                <div className="inline-block bg-secondary/20 text-secondary border border-secondary/50 px-3 py-1 text-xs font-bold tracking-widest uppercase self-start rounded-sm mb-2">
                    CUSTOMER FEEDBACK
                </div>
                <h1 className="text-white text-5xl md:text-7xl font-display tracking-wider leading-none font-bold uppercase">VOICES OF PRECISION</h1>
            </div>

            {/* Featured Review (Hero) */}
            <div className="mb-12 rounded-lg overflow-hidden bg-card-dark border border-secondary/20 shadow-lg relative group">
                <div className="flex flex-col md:flex-row min-h-[400px]">
                    {/* Image side */}
                    <div className="md:w-1/2 relative min-h-[300px] md:min-h-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCQlCHYU5jA_loaHsmWcxG2qgP5oBi32sCPY2qxnq6DVUbsmzT3juaiaN0w1oFrPZhOsY_51Qub_lKshMsgJ9j7LP8vz_YDwMusKQfu0KvTjI7xmIlJ-0oAPPPGsz4uzOp3BlGJuhnnpH8DzTc4bop5CXpXPLY2CYYMSCaLL7M2cPV-QImH9We5MoGh-46CxoYp1-rkaINqk3-gJmHvr3_5fokws0KnQe98Gu3HIsdPA0xBRzfSAPeST0TdbrwhdvNq2mKFGLPZ_RLx')" }}>
                        <div className="absolute inset-0 bg-gradient-to-r from-card-dark via-transparent to-transparent md:hidden"></div>
                        <div className="absolute inset-0 bg-gradient-to-l from-card-dark via-transparent to-transparent hidden md:block"></div>
                    </div>
                    {/* Content side */}
                    <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-card-dark relative z-10">
                        <span className="material-symbols-outlined text-primary text-6xl opacity-20 absolute top-8 left-8">format_quote</span>
                        <blockquote className="text-2xl md:text-3xl lg:text-4xl font-quote font-bold text-white leading-tight mb-8 relative z-10 italic">
                            "The most transparent car buying experience in Kenya."
                        </blockquote>
                        <div className="flex items-center gap-4">
                            <div className="bg-cover bg-center rounded-full size-12 border-2 border-primary" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCC0YTrrD8XsTMcEV8ysYZtdZfOkoMp8Tjatxp3NhNEYGjZLt0bkNGMIJnhYZdsu6rcABwFpuuZvoL_Wl2DV_GCV6XEuB0-hZFlkIF5-0WGw6w1XccxbWMlIf_5I6jDM2IpaJ0SAnvWrthoZO7pFUrekiWegvlCn9myzbTFOJKzLtTGNkZwti8KJf0HnvE71LiIsPmLS1uQ_bEO6yVOHBBBfBJvHQdJvZcE4DEHx5y8HL9_p_gR_wRMLD79Mn3oWNZ6mL4AI-JkmDrJ')" }}></div>
                            <div>
                                <p className="text-primary font-mono font-bold text-lg">KAMAU M.</p>
                                <p className="text-slate-400 text-sm">Purchased Toyota Prado, Mombasa</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories / Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="bg-card-dark rounded-lg p-6 border border-secondary/20">
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-slate-300 text-sm font-bold uppercase tracking-wider">Reliability</p>
                        <p className="text-secondary font-mono text-xl font-bold">4.9<span className="text-slate-500 text-sm">/5</span></p>
                    </div>
                    <div className="h-2 w-full bg-background-dark rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-[98%] shadow-[0_0_10px_rgba(38,198,218,0.5)]"></div>
                    </div>
                </div>
                <div className="bg-card-dark rounded-lg p-6 border border-secondary/20">
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-slate-300 text-sm font-bold uppercase tracking-wider">Performance</p>
                        <p className="text-secondary font-mono text-xl font-bold">4.8<span className="text-slate-500 text-sm">/5</span></p>
                    </div>
                    <div className="h-2 w-full bg-background-dark rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-[96%] shadow-[0_0_10px_rgba(38,198,218,0.5)]"></div>
                    </div>
                </div>
                <div className="bg-card-dark rounded-lg p-6 border border-secondary/20">
                    <div className="flex justify-between items-end mb-2">
                        <p className="text-slate-300 text-sm font-bold uppercase tracking-wider">Service</p>
                        <p className="text-secondary font-mono text-xl font-bold">4.9<span className="text-slate-500 text-sm">/5</span></p>
                    </div>
                    <div className="h-2 w-full bg-background-dark rounded-full overflow-hidden">
                        <div className="h-full bg-secondary w-[98%] shadow-[0_0_10px_rgba(38,198,218,0.5)]"></div>
                    </div>
                </div>
            </div>

            {/* Review Grid */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 mb-16">
                {/* Review Card 1 */}
                <div className="break-inside-avoid bg-surface-dark bg-opacity-80 backdrop-blur-sm rounded-lg p-6 border border-secondary/10 hover:border-primary/50 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-1 text-primary">
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">2 days ago</span>
                    </div>
                    <p className="text-slate-200 font-body mb-6 text-sm leading-relaxed">
                        Excellent service and great selection of cars. The import process was handled professionally and I was kept updated at every stage. Highly recommended!
                    </p>
                    <div className="flex items-center justify-between border-t border-secondary/10 pt-4 mt-auto">
                        <div className="flex items-center gap-3">
                            <div className="bg-cover bg-center rounded-full size-8 bg-slate-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBDJ6j7fOmTSqytFp8LHYsAmI2wgjZA8LHSVglf3CWpi9Vg-VWS9GuyEHWyrfd1JgwJ4b6K7iMoggSaylMaEEOtUEvDRi0iGm8oBJHx9E9iM3n88FRdv09pVEys-1uthjZ5xfQq-cLmV7t_xhTTZSDKkoJczJO8Mf5czFyiseMcpQaYQhHj_t5f_S7b0eDLN_plgaatoFdzbtQDh2jEWROkFvBqom1RX8FY55e_hG5RcxZBCtfB6tTkbfXmkCPmqyMYwsEx_pcVRc-t')" }}></div>
                            <p className="text-white font-mono text-sm font-bold">JOHN D.</p>
                        </div>
                        <div className="flex gap-3 text-slate-400">
                            <button className="flex items-center gap-1 hover:text-primary transition-colors text-xs">
                                <span className="material-symbols-outlined text-sm">thumb_up</span> 12
                            </button>
                        </div>
                    </div>
                </div>

                {/* Review Card 2 */}
                <div className="break-inside-avoid bg-surface-dark bg-opacity-80 backdrop-blur-sm rounded-lg p-6 border border-secondary/10 hover:border-primary/50 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-1 text-primary">
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">1 week ago</span>
                    </div>
                    <p className="text-slate-200 font-body mb-6 text-sm leading-relaxed">
                        The sales team was very helpful and not pushy at all. Love my new SUV. The paperwork was sorted out faster than I expected.
                    </p>
                    <div className="flex items-center justify-between border-t border-secondary/10 pt-4 mt-auto">
                        <div className="flex items-center gap-3">
                            <div className="bg-cover bg-center rounded-full size-8 bg-slate-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAP9FRDWOGgDPIoIE8Rkgm8MzwGGdG80JLZXW1NO7YMGwPenaxupPj6IEcvF0P312mMceVvvew74Uo7xnC-5Yd1fyfdRg3K_ZOK3hldGVa2TXVlb3tLbp6Wfwk7Q8eXeYY19JUw7rjmALvGzo8_-nZG5W_OHExkVhbYTuxVfDPPC-RdHIhP1ekPCQyJi91pSu4OwEMSLIgGMHsWxd52eLXqcgc0RZ7kHxHabGNPsOwTgChCj6N1fzTNcudBX00j1SW0wf_8kGWn0FJq')" }}></div>
                            <p className="text-white font-mono text-sm font-bold">SARAH M.</p>
                        </div>
                        <div className="flex gap-3 text-slate-400">
                            <button className="flex items-center gap-1 hover:text-primary transition-colors text-xs">
                                <span className="material-symbols-outlined text-sm">thumb_up</span> 8
                            </button>
                        </div>
                    </div>
                </div>

                {/* Review Card 3 */}
                <div className="break-inside-avoid bg-surface-dark bg-opacity-80 backdrop-blur-sm rounded-lg p-6 border border-secondary/10 hover:border-primary/50 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-1 text-primary">
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">2 weeks ago</span>
                    </div>
                    <p className="text-slate-200 font-body mb-6 text-sm leading-relaxed">
                        Smooth transaction from start to finish. The transparency is unmatched. I got a full diagnostic report before confirming the purchase, which gave me immense peace of mind. Konastone sets the standard for dealerships in Mombasa.
                    </p>
                    <div className="flex items-center justify-between border-t border-secondary/10 pt-4 mt-auto">
                        <div className="flex items-center gap-3">
                            <div className="bg-cover bg-center rounded-full size-8 bg-slate-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA67LQOSc_qdS1WkbdjeMfHK-PHm9Zg9ZOn8s8sjhDf5d3BSeXn3rr6fHsqorTKL1s36ct4iixK5iSXkyIWH5ymiAMX6p3Lnpy-dr-KGiVYCpBkEasEih1h2n2kB_wQi_xpDX0sKGAdlsRbXhhBwCplC-xT17kkMKRej5EZMOf7Eln3Xrk8MYc8QHF_LxwKNFIi0fuRVc7h_wDoQP0QoNxu_in_NMKqCOfBRGLDIa5TkxFvrT7_LZrhsvIMW5hw3oj3sdu9gusvIebI')" }}></div>
                            <p className="text-white font-mono text-sm font-bold">PETER K.</p>
                        </div>
                        <div className="flex gap-3 text-slate-400">
                            <button className="flex items-center gap-1 hover:text-primary transition-colors text-xs">
                                <span className="material-symbols-outlined text-sm">thumb_up</span> 15
                            </button>
                        </div>
                    </div>
                </div>

                {/* Review Card 4 */}
                <div className="break-inside-avoid bg-surface-dark bg-opacity-80 backdrop-blur-sm rounded-lg p-6 border border-secondary/10 hover:border-primary/50 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-1 text-primary">
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg opacity-30" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">1 month ago</span>
                    </div>
                    <p className="text-slate-200 font-body mb-6 text-sm leading-relaxed">
                        Good cars, fair prices. The after-sales service is what sets them apart. Had a minor issue with the AC a week after purchase and they fixed it immediately at no extra cost.
                    </p>
                    <div className="flex items-center justify-between border-t border-secondary/10 pt-4 mt-auto">
                        <div className="flex items-center gap-3">
                            <div className="bg-cover bg-center rounded-full size-8 bg-slate-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuARCIrYwU3-hPo_6RTt94nMiRJ56btNS5cG0XUd3TeCT6j1-XNhymyoOtFnBeU3sTLY27BJF_Ntungmezl2ZGF7tSCgvIk7dgXmL0Rwt9NgfT2QIzakk3d2WXb8lohsq1j3ET_R0iooZUf7s95xEB2C1a9YzVkKjsH1JsFmlpBuOzvzom8ARxcQc5YhWKB8lZpyMhm1FA14ShyxUcBZpvQmOD8iQbiyckGe17QFm3s1y0H7DBXrbTFGKOXG1vkksNenuGLk1ryZKiwS')" }}></div>
                            <p className="text-white font-mono text-sm font-bold">AMINA S.</p>
                        </div>
                        <div className="flex gap-3 text-slate-400">
                            <button className="flex items-center gap-1 hover:text-primary transition-colors text-xs">
                                <span className="material-symbols-outlined text-sm">thumb_up</span> 5
                            </button>
                        </div>
                    </div>
                </div>

                {/* Review Card 5 */}
                <div className="break-inside-avoid bg-surface-dark bg-opacity-80 backdrop-blur-sm rounded-lg p-6 border border-secondary/10 hover:border-primary/50 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-1 text-primary">
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">1 month ago</span>
                    </div>
                    <p className="text-slate-200 font-body mb-6 text-sm leading-relaxed">
                        Found exactly what I was looking for. The condition of the car was pristine.
                    </p>
                    <div className="flex items-center justify-between border-t border-secondary/10 pt-4 mt-auto">
                        <div className="flex items-center gap-3">
                            <div className="bg-cover bg-center rounded-full size-8 bg-slate-700" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCmbHTbgIJBX0EZ3NaXeLUf55L6Uhe2q8k-jqskfmCkCZY8jrQtuCwyWxa1jroVBS-eBRR2lP4dcxypyqjaaemGKlJbslLqEsNhXXMYKtg3a0Kuuhe2oJZxdgaUfiHsI3qtlacQifcVyKw1MVsFJ1ygmsnzcBT4oM1hKhNsiYXjkjv_ED5IMLnUuy0QE6iaAM0iYVK8EZHmWHFCyfiESQJyGgJypstwG_GHxp0rbfFDsy7ant4gmp6ZvXm3l0HfAvrL1qHF1Fs5UH6s')" }}></div>
                            <p className="text-white font-mono text-sm font-bold">DAVID O.</p>
                        </div>
                        <div className="flex gap-3 text-slate-400">
                            <button className="flex items-center gap-1 hover:text-primary transition-colors text-xs">
                                <span className="material-symbols-outlined text-sm">thumb_up</span> 9
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Call to Action */}
            <div className="flex justify-center my-12 relative z-20">
                <button className="relative overflow-hidden bg-primary text-background-dark font-display text-2xl px-12 py-4 tracking-widest uppercase transition-all duration-300 hover:scale-105 group border-2 border-primary">
                    <span className="relative z-10 font-bold">SHARE YOUR EXPERIENCE</span>
                    <div className="absolute inset-0 bg-hazard-stripe opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
            </div>
        </div>
    );
}
