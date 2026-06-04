"use client"

import { useState } from "react"
import { login } from "./actions"

export default function AdminLogin() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        const formData = new FormData()
        formData.append('email', email)
        formData.append('password', password)

        const res = await login(formData)

        if (res?.error) {
            setError(res.error)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background-dark flex items-center justify-center p-6 relative overflow-hidden font-body text-on-surface">
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_1px_1px,rgba(255,193,7,0.18)_1px,transparent_0)] bg-size-[40px_40px]" />
            <div className="absolute top-0 left-0 w-full h-[2px] bg-linear-to-r from-transparent via-primary/30 to-transparent" />
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/5 blur-3xl rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-teal/5 blur-3xl rounded-full" />

            <div className="w-full max-w-md bg-surface-dark/50 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-10 relative z-10 shadow-2xl shadow-black/40 overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-3xl" />
                <div className="relative z-10">
                    <div className="mb-10 text-center">
                        <div className="mx-auto mb-6 w-16 h-16 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-2xl shadow-primary/10">
                            <span className="material-symbols-outlined text-4xl text-primary">lock</span>
                        </div>
                        <span className="font-heading text-[10px] tracking-[0.3em] text-accent-teal uppercase block mb-3 font-black">AUTH_GATEWAY // SECURE</span>
                        <h1 className="font-heading text-5xl tracking-tighter text-white uppercase italic leading-none font-black">
                            COMMAND<span className="text-primary">CENTER</span>
                        </h1>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="group relative">
                            <label className="absolute -top-2.5 left-4 px-2 bg-surface-dark text-[9px] font-black text-slate-500 uppercase tracking-widest z-10 group-focus-within:text-primary transition-colors">OPERATOR_ID (Email)</label>
                            <input
                                type="email"
                                required
                                className="w-full bg-white/3 border border-white/10 rounded-2xl px-6 py-5 text-white font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-700"
                                placeholder="admin@konastone.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="group relative">
                            <label className="absolute -top-2.5 left-4 px-2 bg-surface-dark text-[9px] font-black text-slate-500 uppercase tracking-widest z-10 group-focus-within:text-primary transition-colors">ACCESS_KEY (Password)</label>
                            <input
                                type="password"
                                required
                                className="w-full bg-white/3 border border-white/10 rounded-2xl px-6 py-5 text-white font-mono text-sm focus:border-primary focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-700"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {error && (
                            <div className="border border-red-500/40 bg-red-500/10 rounded-2xl p-4 flex items-start gap-3 text-red-400 text-xs font-mono">
                                <span className="material-symbols-outlined text-[16px]">error</span>
                                <p>{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-14 rounded-2xl bg-primary text-black font-heading font-black text-[11px] tracking-[0.3em] uppercase hover:shadow-2xl hover:shadow-primary/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">shield_lock</span>
                            {loading ? 'AUTHENTICATING...' : 'INITIATE ACCESS'}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-white/5 pt-6">
                        <p className="font-mono text-[9px] text-slate-600 uppercase tracking-widest">
                            UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED AND MONITORED.
                        </p>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-6 left-6 opacity-30 pointer-events-none hidden sm:block">
                <div className="font-heading text-[10px] tracking-[0.4em] space-y-1 text-accent-teal uppercase font-black">
                    <p>VER: KONASTONE_CORE_V1.2</p>
                    <p>NODE: ADMIN_ALPHA</p>
                    <p>STATUS: ONLINE</p>
                </div>
            </div>
        </div>
    )
}
