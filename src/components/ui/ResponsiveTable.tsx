"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface Column {
  key: string;
  label: string;
  className?: string;
  render?: (row: Record<string, unknown>, index: number) => ReactNode;
  mobileLabel?: string;
}

interface ResponsiveTableProps {
  columns: Column[];
  data: Record<string, unknown>[];
  onRowClick?: (row: Record<string, unknown>) => void;
  rowKey: string;
  emptyMessage?: string;
  emptyIcon?: string;
}

export default function ResponsiveTable({
  columns,
  data,
  onRowClick,
  rowKey,
  emptyMessage = "No data available",
  emptyIcon = "inbox",
}: ResponsiveTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="p-12 text-center bg-surface-dark/40 backdrop-blur-xl border border-white/5 rounded-[3rem]">
        <span className="material-symbols-outlined text-4xl text-slate-700 mb-4 block">{emptyIcon}</span>
        <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-xs">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block bg-surface-dark/40 backdrop-blur-xl border border-white/5 rounded-[3rem] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/2 border-b border-white/5">
                {columns.map((col) => (
                  <th key={col.key} className={`px-8 py-5 text-[9px] font-black tracking-[0.4em] text-slate-500 uppercase ${col.className || ""}`}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.map((row, index) => (
                <motion.tr
                  key={String(row[rowKey])}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-white/2 hover:bg-white/2 transition-all ${onRowClick ? "cursor-pointer group" : ""}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-8 py-5 ${col.className || ""}`}>
                      {col.render ? col.render(row, index) : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden space-y-4">
        {data.map((row, index) => (
          <motion.div
            key={String(row[rowKey])}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onRowClick?.(row)}
            className={`bg-surface-dark/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 ${onRowClick ? "cursor-pointer active:scale-[0.98] transition-transform" : ""}`}
          >
            <div className="space-y-4">
              {columns.map((col) => (
                <div key={col.key} className="flex justify-between items-start gap-4">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest shrink-0">{col.mobileLabel || col.label}</span>
                  <div className="text-right">
                    {col.render ? col.render(row, index) : (
                      <span className="text-sm font-bold text-white">{String(row[col.key] ?? "")}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}