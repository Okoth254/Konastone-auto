import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import AnimatedCounter from "@/components/home/AnimatedCounter";
import { VehicleDistributionChart } from "@/components/admin/VehicleDistributionChart";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 1. Fetch Inventory Count
  const { count: inventoryCount } = await supabase
    .from('vehicles')
    .select('*', { count: 'exact', head: true });

  // 2. Fetch Active Leads Count
  const { count: activeLeadsCount } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .not('status', 'in', '("resolved","dormant")');

  // 3. Fetch Pending Reviews Count
  const { count: pendingReviewsCount } = await supabase
    .from('customer_reviews')
    .select('*', { count: 'exact', head: true })
    .eq('is_approved', false);

  // 4. Fetch Live Inventory Stream (latest 5)
  const { data: latestVehicles } = await supabase
    .from('vehicles')
    .select('id, vin, model, status, price, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  // 5. Fetch all vehicles for status breakdown
  const { data: allVehicles } = await supabase.from('vehicles').select('status');
  const vehicleStats = allVehicles?.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // 6. Fetch all leads for status breakdown
  const { data: allLeads } = await supabase.from('leads').select('status');
  const leadStats = allLeads?.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  // 7. Fetch recent timeline events
  const { data: timelineEvents } = await supabase
    .from('lead_timeline_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <div className="p-8">
      {/* Header Section */}
      <header className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-headline font-black tracking-tight text-on-surface uppercase">Operational Overview</h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-admin-secondary text-[10px] font-headline tracking-[0.2em] flex items-center gap-1">
              <span className="w-2 h-2 bg-admin-secondary rounded-full animate-pulse"></span>
              NETWORK LATENCY: 24MS
            </span>
            <span className="text-zinc-600 text-[10px] font-headline tracking-[0.2em]">STATION: ALPHA-09</span>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="bg-surface-container-high px-4 py-2 border-l-2 border-primary-container">
            <p className="text-[10px] text-zinc-500 font-headline uppercase tracking-widest">Global Status</p>
            <p className="text-on-surface font-headline font-bold text-lg">NOMINAL</p>
          </div>
        </div>
      </header>
      
      {/* Bento Grid: Key Metrics */}
      <div className="grid grid-cols-12 gap-6 mb-12">
        {/* Metric 1: Inventory */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-high p-6 border-l-4 border-admin-secondary relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[11px] font-headline font-bold tracking-[0.2em] text-zinc-400 uppercase">Inventory Units</p>
              <span className="material-symbols-outlined text-admin-secondary">directions_car</span>
            </div>
            <div className="flex items-end gap-3">
              <h3 className="text-5xl font-headline font-black">
                <AnimatedCounter text={(inventoryCount || 0).toString()} />
              </h3>
              <span className="text-cyan-400 text-sm font-headline font-bold mb-1">UNITS</span>
            </div>
            <div className="mt-6 flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-4 w-1 ${i < 3 ? 'bg-cyan-400' : 'bg-cyan-400/20'} animate-fade-up`} style={{ animationDelay: `${i * 100}ms` }}></div>
              ))}
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-9xl">inventory_2</span>
          </div>
        </div>

        {/* Metric 2: Leads */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-high p-6 border-l-4 border-primary-container relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[11px] font-headline font-bold tracking-[0.2em] text-zinc-400 uppercase">Active Leads</p>
              <span className="material-symbols-outlined text-primary-container">leaderboard</span>
            </div>
            <div className="flex items-end gap-3">
              <h3 className="text-5xl font-headline font-black">
                <AnimatedCounter text={(activeLeadsCount || 0).toString()} />
              </h3>
              <span className="text-primary-container text-sm font-headline font-bold mb-1">OPEN</span>
            </div>
            <div className="mt-6 flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-4 w-1 ${i < 3 ? 'bg-primary-container' : 'bg-primary-container/20'} animate-fade-up`} style={{ animationDelay: `${(i * 100) + 200}ms` }}></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Metric 3: Reviews */}
        <div className="col-span-12 md:col-span-4 bg-surface-container-high p-6 border-l-4 border-white/10 relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[11px] font-headline font-bold tracking-[0.2em] text-zinc-400 uppercase">Pending Reviews</p>
              <span className="material-symbols-outlined text-zinc-500">rate_review</span>
            </div>
            <div className="flex items-end gap-3">
              <h3 className="text-5xl font-headline font-black">
                <AnimatedCounter text={(pendingReviewsCount || 0).toString()} />
              </h3>
              <span className="text-zinc-500 text-xs font-headline font-medium mb-1">AWAITING</span>
            </div>
            <div className="mt-6 grid grid-cols-5 gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-1 ${i < 4 ? 'bg-admin-secondary' : 'bg-admin-secondary/20'} animate-fade-up`} style={{ animationDelay: `${(i * 100) + 400}ms` }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-8">
        {/* Technical Data Table: Latest Inventory */}
        <div className="col-span-12 lg:col-span-8">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-headline font-bold tracking-widest text-sm uppercase flex items-center gap-2">
              <span className="w-1 h-4 bg-admin-secondary"></span>
              Live Inventory Stream
            </h4>
            <Link href="/admin/vehicles" className="text-[10px] font-headline font-bold tracking-[0.2em] text-zinc-500 hover:text-on-surface transition-colors">
              VIEW ALL RECORDS
            </Link>
          </div>
          <div className="bg-surface-container border border-white/5">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-surface-container-high">
                  <th className="px-6 py-4 text-[10px] font-headline font-bold tracking-widest text-zinc-400 uppercase">Unit Identifier</th>
                  <th className="px-6 py-4 text-[10px] font-headline font-bold tracking-widest text-zinc-400 uppercase">Model Specification</th>
                  <th className="px-6 py-4 text-[10px] font-headline font-bold tracking-widest text-zinc-400 uppercase">Status</th>
                  <th className="px-6 py-4 text-[10px] font-headline font-bold tracking-widest text-zinc-400 uppercase text-right">Value (USD)</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {latestVehicles?.map((vehicle) => (
                  <tr key={vehicle.id} className="border-b border-white/5 hover:bg-white/2 transition-colors">
                    <td className="px-6 py-4 font-mono text-admin-secondary">{vehicle.vin || vehicle.id.substring(0, 8).toUpperCase()}</td>
                    <td className="px-6 py-4 font-medium">{vehicle.model}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 text-[9px] font-bold tracking-tighter uppercase border ${
                        vehicle.status === 'available' ? 'bg-primary-container/10 text-primary-container border-primary-container/30' :
                        vehicle.status === 'in_transit' ? 'bg-admin-secondary/10 text-admin-secondary border-admin-secondary/30' :
                        'bg-zinc-800 text-zinc-400 border-zinc-700'
                      }`}>
                        {vehicle.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-right">${Intl.NumberFormat('en-US').format(vehicle.price)}</td>
                  </tr>
                ))}
                {(!latestVehicles || latestVehicles.length === 0) && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-zinc-500 font-mono text-xs">NO ACTIVE INVENTORY FOUND</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Activity Feed: Terminal Style */}
        <div className="col-span-12 lg:col-span-4">
          <div className="flex items-center gap-2 mb-6">
            <h4 className="font-headline font-bold tracking-widest text-sm uppercase">System Logs</h4>
            <span className="text-[9px] bg-zinc-800 px-2 py-0.5 text-zinc-400">REAL-TIME</span>
          </div>
          <div className="bg-surface-container-lowest p-6 border border-white/5 font-mono text-[11px] leading-relaxed h-[360px] overflow-y-auto">
            <div className="space-y-3">
              {timelineEvents && timelineEvents.length > 0 ? timelineEvents.map((event) => (
                  <div key={event.id} className="flex gap-3 relative group">
                      <span className="text-zinc-600 shrink-0">[{new Date(event.created_at).toLocaleTimeString('en-US', {hour12: false}).substring(0, 8)}]</span>
                      <p><span className="text-admin-secondary font-bold">{event.event_type.toUpperCase()}</span>: <span className="text-zinc-300">{event.description}</span></p>
                  </div>
              )) : (
                  <div className="flex gap-3">
                    <span className="text-zinc-600">[--:--:--]</span>
                    <p><span className="text-admin-secondary">WAITING_FOR_DATA_PACKETS...</span></p>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* System Visualization Placeholder */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface-container border border-white/5 relative overflow-hidden p-6 flex flex-col">
          <p className="text-xs font-headline font-bold tracking-[0.3em] text-zinc-500 mb-1">INVENTORY_DISTRIBUTION</p>
          <div className="h-px w-24 bg-primary-container mb-4" />
          <VehicleDistributionChart
            available={vehicleStats['available'] || 0}
            inTransit={vehicleStats['in_transit'] || 0}
            sold={vehicleStats['sold'] || 0}
            reserved={vehicleStats['reserved'] || 0}
          />
        </div>
        
        <div className="bg-surface-container h-64 border border-white/5 relative overflow-hidden flex flex-col items-center justify-center p-8">
          <div className="relative text-center z-10 w-full">
            <p className="text-xs font-headline font-bold tracking-[0.3em] text-zinc-500 mb-2">LEAD_FUNNEL_METRICS</p>
            <div className="h-px w-24 bg-admin-secondary mx-auto mb-6"></div>
            
            {/* Simple Bar Chart replacement for Leads */}
            <div className="space-y-4 w-full max-w-sm mx-auto">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-headline font-bold text-zinc-400 uppercase tracking-widest">
                  <span>New</span>
                  <span>{leadStats['new'] || 0}</span>
                </div>
                <div className="w-full bg-surface-container-highest h-2">
                  <div className="bg-primary-container h-full transition-all duration-1000" style={{ width: `${Math.min(100, ((leadStats['new'] || 0) / Math.max(1, (allLeads?.length || 1))) * 100)}%` }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-headline font-bold text-zinc-400 uppercase tracking-widest">
                  <span>In Negotiation</span>
                  <span>{leadStats['negotiating'] || 0}</span>
                </div>
                <div className="w-full bg-surface-container-highest h-2">
                  <div className="bg-amber-400 h-full transition-all duration-1000" style={{ width: `${Math.min(100, ((leadStats['negotiating'] || 0) / Math.max(1, (allLeads?.length || 1))) * 100)}%` }}></div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-headline font-bold text-zinc-400 uppercase tracking-widest">
                  <span>Resolved (Sold/Lost)</span>
                  <span>{(leadStats['sold'] || 0) + (leadStats['lost'] || 0)}</span>
                </div>
                <div className="w-full bg-surface-container-highest h-2">
                  <div className="bg-admin-secondary h-full transition-all duration-1000" style={{ width: `${Math.min(100, (((leadStats['sold'] || 0) + (leadStats['lost'] || 0)) / Math.max(1, (allLeads?.length || 1))) * 100)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
