"use client";

import { motion, AnimatePresence, useDragControls } from "framer-motion";
import { ReactNode, useRef } from "react";

interface MotionSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  snapPoints?: [number, number];
}

export default function MotionSheet({
  open,
  onClose,
  children,
  snapPoints = [0.4, 0.8],
}: MotionSheetProps) {
  const dragControls = useDragControls();
  const constraintsRef = useRef<HTMLDivElement>(null);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 z-40"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            key="sheet-panel"
            ref={constraintsRef}
            drag="y"
            dragControls={dragControls}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0, bottom: 0.3 }}
            onDragEnd={(_, info) => {
              if (info.velocity.y > 400 || info.offset.y > 120) {
                onClose();
              }
            }}
            initial={{ y: "100%" }}
            animate={{ y: `${(1 - snapPoints[1]) * 100}%` }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-surface-container border-t border-white/10 rounded-t-xl overflow-hidden"
            style={{ height: `${snapPoints[1] * 100}vh` }}
          >
            {/* Drag Handle */}
            <div
              className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="w-10 h-1 bg-zinc-700 rounded-full" />
            </div>

            {/* Content */}
            <div className="overflow-y-auto h-full pb-safe-bottom">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
