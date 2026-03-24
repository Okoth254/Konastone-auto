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
        <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 relative overflow-hidden font-body text-on-surface">
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #4f4632 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
            
            <div className="w-full max-w-md bg-surface-container-high border-t-2 border-primary-container p-8 relative z-10 shadow-2xl">
                <div className="mb-8 text-center">
                    <span className="font-headline text-[10px] tracking-[0.3em] text-admin-secondary uppercase block mb-2">AUTH_GATEWAY // SECURE</span>
                    <h1 className="font-headline text-5xl tracking-tighter text-white uppercase flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-4xl text-admin-secondary">lock</span>
                        COMMAND<span className="text-zinc-500">CENTER</span>
                    </h1>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block font-headline text-xs tracking-widest text-zinc-400 uppercase mb-2">OPERATOR_ID (Email)</label>
                        <input 
                            type="email" 
                            required
                            className="w-full bg-surface-container border border-zinc-700 p-4 text-white font-mono text-sm focus:border-admin-secondary focus:ring-1 focus:ring-admin-secondary outline-none transition-all placeholder:text-zinc-600"
                            placeholder="admin@konastone.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block font-headline text-xs tracking-widest text-zinc-400 uppercase mb-2">ACCESS_KEY (Password)</label>
                        <input 
                            type="password" 
                            required
                            className="w-full bg-surface-container border border-zinc-700 p-4 text-white font-mono text-sm focus:border-admin-secondary focus:ring-1 focus:ring-admin-secondary outline-none transition-all placeholder:text-zinc-600"
                            placeholder="••••••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    {error && (
                        <div className="border border-red-500/50 bg-red-500/10 p-3 flex items-start gap-2 text-red-400 text-xs font-mono">
                            <span className="material-symbols-outlined text-[14px]">error</span>
                            <p>{error}</p>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-primary-container text-black font-headline font-black text-lg tracking-widest uppercase py-4 hover:bg-amber-400 transition-colors active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                    >
                        {loading ? 'AUTHENTICATING...' : 'INITIATE ACCESS'}
                    </button>
                </form>

                <div className="mt-8 text-center border-t border-zinc-800 pt-6">
                    <p className="font-mono text-[9px] text-zinc-600 uppercase tracking-widest">
                        UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED AND MONITORED.
                    </p>
                </div>
            </div>
            
            {/* System Info Decor */}
            <div className="absolute bottom-6 left-6 opacity-30 pointer-events-none hidden sm:block">
                <div className="font-headline text-[10px] tracking-[0.4em] space-y-1 text-admin-secondary uppercase">
                    <p>VER: KONASTONE_CORE_V1.2</p>
                    <p>NODE: US_EAST_1</p>
                    <p>STATUS: ONLINE</p>
                </div>
            </div>
        </div>
    )
}
