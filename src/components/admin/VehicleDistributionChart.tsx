"use client";

import {
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import type { PieLabelRenderProps } from "recharts";

interface VehicleDistributionChartProps {
    available: number;
    inTransit: number;
    sold: number;
    reserved: number;
}

const COLORS = ["#d4af37", "#22d3ee", "#6b7280", "#a8a29e"];

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: PieLabelRenderProps) => {
    const pct = percent ?? 0;
    const ir  = typeof innerRadius === 'number' ? innerRadius : 0;
    const or  = typeof outerRadius === 'number' ? outerRadius : 0;
    const ma  = midAngle ?? 0;
    const cxN = typeof cx === 'number' ? cx : 0;
    const cyN = typeof cy === 'number' ? cy : 0;
    if (pct < 0.05) return null;
    const radius = ir + (or - ir) * 0.5;
    const x = cxN + radius * Math.cos(-ma * RADIAN);
    const y = cyN + radius * Math.sin(-ma * RADIAN);
    return (
        <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
            {`${(pct * 100).toFixed(0)}%`}
        </text>
    );
};

export function VehicleDistributionChart({ available, inTransit, sold, reserved }: VehicleDistributionChartProps) {
    const data = [
        { name: "Available", value: available },
        { name: "In Transit", value: inTransit },
        { name: "Sold", value: sold },
        { name: "Reserved", value: reserved },
    ].filter(d => d.value > 0);

    if (data.length === 0) {
        return (
            <div className="flex items-center justify-center h-full text-zinc-500 font-mono text-sm">NO_DATA_STREAM</div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={260}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomLabel}
                    outerRadius={110}
                    innerRadius={60}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={1200}
                >
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "4px", fontFamily: "monospace", fontSize: "11px" }}
                    itemStyle={{ color: "#d4d4d4" }}
                />
                <Legend
                    formatter={(value) => <span style={{ color: "#9ca3af", fontSize: "10px", fontFamily: "monospace" }}>{value.toUpperCase()}</span>}
                    iconType="circle"
                    iconSize={8}
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
