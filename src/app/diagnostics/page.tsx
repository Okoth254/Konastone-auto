import { supabase } from "@/lib/supabase";

async function getServerStatus() {
    try {
        const { data, error } = await supabase.from('cars').select('count', { count: 'exact', head: true });
        if (error) return { status: "failed", error: error.message };
        return { status: "success", count: data };
    } catch (e: any) {
        return { status: "error", error: e.message };
    }
}

export default async function DiagnosticsPage() {
    const serverStatus = await getServerStatus();

    return (
        <div className="p-10 bg-black text-white font-mono space-y-8">
            <h1 className="text-2xl border-b border-[#2D2D2D] pb-4">Konastone Backend Diagnostics</h1>

            <section>
                <h2 className="text-[#FFC107] uppercase text-sm mb-2">Server-Side Status (SSR)</h2>
                <pre className="bg-[#111111] p-4 border border-[#2D2D2D]">
                    {JSON.stringify(serverStatus, null, 2)}
                </pre>
                <p className="text-xs text-[#6B7280] mt-2">
                    Used by Vehicle Detail Page and Metadata.
                    If this is "failed", check Netlify Environment Variables.
                </p>
            </section>

            <section>
                <h2 className="text-[#26C6DA] uppercase text-sm mb-2">Environment Config</h2>
                <ul className="space-y-1 text-sm">
                    <li>URL Present: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅" : "❌"}</li>
                    <li>Key Present: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅" : "❌"}</li>
                </ul>
            </section>

            <section className="pt-8 border-t border-[#2D2D2D]">
                <p className="text-sm">
                    If anything is ❌ or "failed", visit the <a href="/netlify-env-guide" className="text-[#FFC107] underline">Environment Guide</a>.
                </p>
            </section>
        </div>
    );
}
