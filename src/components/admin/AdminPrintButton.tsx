"use client";

import MotionButton from "@/components/ui/MotionButton";

export default function AdminPrintButton() {
  return (
    <MotionButton
      type="button"
      variant="ghost"
      onClick={() => window.print()}
      className="w-11 h-11 sm:w-12 sm:h-12 p-0 rounded-xl border-white/5"
      aria-label="Print vehicle record"
    >
      <span className="material-symbols-outlined">print</span>
    </MotionButton>
  );
}
