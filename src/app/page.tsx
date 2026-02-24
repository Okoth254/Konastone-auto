import Link from "next/link";
import { SplitScreenHero } from "@/components/home/SplitScreenHero";
import { TrustBar } from "@/components/home/TrustBar";
import { InventoryGrid } from "@/components/inventory/InventoryGrid";
import { Button } from "@/components/ui/Button";
import { GrungeDivider } from "@/components/ui/GrungeDivider";
import { getVehicles } from "@/lib/data";

export default async function Home() {
  const allVehicles = await getVehicles();
  const featuredVehicles = allVehicles.slice(0, 3);

  return (
    <main className="min-h-screen bg-[#1A1A1A]">
      <SplitScreenHero />

      <TrustBar />

      <GrungeDivider height={6} opacity={40} />

      {/* ─── FEATURED INVENTORY ─────────────────────────────── */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="font-mono text-xs text-[#26C6DA] uppercase tracking-[0.25em] mb-2">Hand-picked</p>
            <h2 className="font-heading text-4xl md:text-5xl uppercase text-[#F5F5F5]">
              Featured Inventory
            </h2>
          </div>
          <Link href="/inventory?mode=buy">
            <Button variant="ghost" size="sm">
              View All &rarr;
            </Button>
          </Link>
        </div>

        <InventoryGrid vehicles={featuredVehicles} mode="buy" />
      </section>

      <GrungeDivider height={6} opacity={40} label="Konastone Autos" />

      {/* ─── CTA BANNER ─────────────────────────────────────── */}
      <section className="bg-[#111111] py-20">
        <div className="container mx-auto px-4 text-center space-y-6">
          <p className="font-mono text-xs text-[#26C6DA] uppercase tracking-[0.25em]">Mombasa's Premier Dealership</p>
          <h2 className="font-heading text-grunge text-5xl md:text-6xl uppercase text-[#F5F5F5]">
            Ready to Drive Your Dream Car?
          </h2>
          <p className="font-mono text-sm text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed">
            cash · hire purchase · bank finance · trade-in · insurance
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Link href="/inventory?mode=hire">
              <Button size="lg">Start Hire Application</Button>
            </Link>
            <Link href="/inventory?mode=buy">
              <Button variant="outline" size="lg">Browse for Sale</Button>
            </Link>
          </div>
          {/* Phone */}
          <p className="font-slab text-[#E53935] text-2xl md:text-3xl font-bold tracking-[0.2em] pt-4">
            +254 722 511 803
          </p>
        </div>
      </section>

      <GrungeDivider height={6} opacity={30} />
    </main>
  );
}
