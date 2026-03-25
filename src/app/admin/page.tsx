import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { VehicleDistributionChart } from "@/components/admin/VehicleDistributionChart";
import { SystemEventStream } from "@/components/admin/SystemEventStream";
import KpiCard from "@/components/admin/KpiCard";
import * as motion from "framer-motion/client";

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

  // 4. Fetch Live Inventory Stream
  const { data: latestVehicles } = await supabase
    .from('vehicles')
    .select('id, vin, model, status, price, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: allVehicles } = await supabase.from('vehicles').select('status');
  const vehicleStats = allVehicles?.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const { data: allLeads } = await supabase.from('leads').select('status');
  const leadStats = allLeads?.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const { data: timelineEvents } = await supabase
    .from('lead_timeline_events')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  return (
    <div className="p-10 space-y-12">
      {/* Header Section */}
      <motion.header 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-5xl font-heading font-black tracking-tighter text-white uppercase italic">DASHBOARD</h2>
            <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-black text-primary uppercase tracking-[0.2em]">Operational</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-accent-teal rounded-full animate-pulse shadow-[0_0_10px_rgba(38,198,218,0.5)]" />
              <span className="text-slate-500 text-[9px] font-black tracking-[0.4em] uppercase">LINK_STATE: NOMINAL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-700 text-sm">sensors</span>
              <span className="text-slate-500 text-[9px] font-black tracking-[0.4em] uppercase">LATENCY: 14ms</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 bg-surface-dark p-4 rounded-2xl border border-white/5 shadow-inner">
            <div className="text-right px-4 border-r border-white/5">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">LOCAL_TIME</p>
                <p className="text-lg font-heading font-black text-white">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</p>
            </div>
            <div className="px-4">
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">STATION_ID</p>
                <p className="text-lg font-heading font-black text-white">MBS-ALPHA-01</p>
            </div>
        </div>
      </motion.header>
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <KpiCard 
          label="INVENTORY_UNITS" 
          value={inventoryCount || 0} 
          subValue="TOTAL" 
          icon="directions_car" 
          variant="secondary"
          delay={0.1}
          trend={{ value: 12, isPositive: true }}
        />
        <KpiCard 
          label="ACTIVE_LEADS" 
          value={activeLeadsCount || 0} 
          subValue="OPEN" 
          icon="leaderboard" 
          variant="primary"
          delay={0.2}
          trend={{ value: 5, isPositive: true }}
        />
        <KpiCard 
          label="PENDING_LOGS" 
          value={pendingReviewsCount || 0} 
          subValue="REVIEWS" 
          icon="rate_review" 
          variant="neutral"
          delay={0.3}
        />
      </div>
      
      <div className="grid grid-cols-12 gap-10">
        {/* Inventory Stream */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-12 lg:col-span-8 flex flex-col gap-6"
        >
          <div className="flex justify-between items-center px-2">
            <h4 className="font-heading font-black tracking-[0.1em] text-sm uppercase flex items-center gap-3 text-white">
              <span className="w-8 h-[2px] bg-primary"></span>
              Live Telemetry Stream
            </h4>
            <Link href="/admin/vehicles" className="text-[10px] font-black tracking-[0.3em] text-slate-500 hover:text-primary transition-all group flex items-center gap-2">
              VIEW ARCHIVES
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </Link>
          </div>
          
          <div className="bg-surface-dark/40 backdrop-blur-xl rounded-[2.5rem] border border-white/5 overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-8 py-5 text-[9px] font-black tracking-[0.4em] text-slate-500 uppercase">Registry_ID</th>
                  <th className="px-8 py-5 text-[9px] font-black tracking-[0.4em] text-slate-500 uppercase">Specification</th>
                  <th className="px-8 py-5 text-[9px] font-black tracking-[0.4em] text-slate-500 uppercase">Core_State</th>
                  <th className="px-8 py-5 text-[9px] font-black tracking-[0.4em] text-slate-500 uppercase text-right">Valuation</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {latestVehicles?.map((vehicle, i) => (
                  <motion.tr 
                    key={vehicle.id} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + (i * 0.05) }}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-all group cursor-pointer"
                  >
                    <td className="px-8 py-5 font-mono text-primary text-xs uppercase tracking-tight">{vehicle.vin?.substring(0, 12).toUpperCase() || vehicle.id.substring(0, 8).toUpperCase()}</td>
                    <td className="px-8 py-5 font-heading text-white font-bold tracking-tight">{vehicle.model.toUpperCase()}</td>
                    <td className="px-8 py-5">
                      <span className={`inline-flex items-center px-4 py-1 text-[9px] font-black tracking-[0.15em] uppercase rounded-full border ${
                        vehicle.status === 'available' ? 'bg-accent-teal/10 text-accent-teal border-accent-teal/20' :
                        vehicle.status === 'in_transit' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                        'bg-slate-800/10 text-slate-500 border-slate-700/20'
                      }`}>
                        {vehicle.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-8 py-5 font-heading font-black text-right text-white">
                        <span className="text-primary mr-1">$</span>
                        {Intl.NumberFormat('en-US').format(vehicle.price)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        
        {/* System Logs */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="col-span-12 lg:col-span-4 space-y-6"
        >
          <div className="flex items-center gap-3 px-2">
            <h4 className="font-heading font-black tracking-[0.1em] text-sm uppercase text-white">SYSLOG_FEED</h4>
            <span className="text-[8px] bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full font-black animate-pulse">INTERNAL_COMMS</span>
          </div>
          <SystemEventStream events={timelineEvents || []} />
        </motion.div>
      </div>
      
      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-10">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-surface-dark/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 flex flex-col group"
        >
          <div className="flex justify-between items-center mb-10">
            <div>
              <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 mb-1 uppercase">Inventory_Dist_Matrix</p>
              <div className="h-[2px] w-12 bg-accent-teal" />
            </div>
            <span className="material-symbols-outlined text-slate-700 opacity-20 text-4xl">pie_chart</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <VehicleDistributionChart
                available={vehicleStats['available'] || 0}
                inTransit={vehicleStats['in_transit'] || 0}
                sold={vehicleStats['sold'] || 0}
                reserved={vehicleStats['reserved'] || 0}
            />
          </div>
        </motion.div>
        
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-surface-dark/40 backdrop-blur-xl border border-white/5 rounded-[3rem] p-10 flex flex-col group"
        >
          <div className="flex justify-between items-center mb-10">
            <div>
              <p className="text-[10px] font-black tracking-[0.4em] text-slate-600 mb-1 uppercase">Lead_Funnel_Metrics</p>
              <div className="h-[2px] w-12 bg-primary" />
            </div>
            <span className="material-symbols-outlined text-slate-700 opacity-20 text-4xl">analytics</span>
          </div>
          
          <div className="flex-1 space-y-8 flex flex-col justify-center">
            {[
              { label: "New Inquiries", value: leadStats['new'] || 0, color: "bg-primary" },
              { label: "Active Nego", value: leadStats['negotiating'] || 0, color: "bg-accent-teal" },
              { label: "Conversions & Arch", value: (leadStats['sold'] || 0) + (leadStats['lost'] || 0), color: "bg-slate-700" }
            ].map((stat, i) => {
              const total = allLeads?.length || 1;
              const percent = Math.min(100, (stat.value / total) * 100);
              return (
                <div key={stat.label} className="space-y-3">
                  <div className="flex justify-between items-end px-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</span>
                    <span className="text-xl font-heading font-black text-white">{stat.value}</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percent}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 + (i * 0.1), duration: 1.5, ease: "easeOut" }}
                      className={`h-full ${stat.color} shadow-[0_0_20px_rgba(255,191,41,0.2)]`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
