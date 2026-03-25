"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
}

export default function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-background-dark/95 backdrop-blur-3xl"
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content asChild forceMount>
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
              >
                <div className="w-full max-w-2xl bg-surface-dark/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden max-h-[90vh] flex flex-col">
                  {children}
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}

export function DialogHeader({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose?: () => void;
}) {
  return (
    <div className="flex justify-between items-center p-8 border-b border-white/5">
      <div>{children}</div>
      {onClose && (
        <DialogPrimitive.Close asChild>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </DialogPrimitive.Close>
      )}
    </div>
  );
}

export function DialogTitle({ children }: { children: ReactNode }) {
  return (
    <DialogPrimitive.Title className="text-2xl font-heading text-slate-100 uppercase tracking-tighter leading-none">
      {children}
    </DialogPrimitive.Title>
  );
}

export function DialogDescription({ children }: { children: ReactNode }) {
  return (
    <DialogPrimitive.Description className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mt-1">
      {children}
    </DialogPrimitive.Description>
  );
}

export function DialogBody({ children }: { children: ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">{children}</div>
  );
}

export function DialogFooter({ children }: { children: ReactNode }) {
  return (
    <div className="p-8 border-t border-white/5 bg-white/2">{children}</div>
  );
}