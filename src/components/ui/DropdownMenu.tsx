"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ReactNode } from "react";

interface DropdownMenuProps {
  children: ReactNode;
  trigger: ReactNode;
  align?: "start" | "center" | "end";
}

export default function DropdownMenu({
  children,
  trigger,
  align = "end",
}: DropdownMenuProps) {
  return (
    <DropdownMenuPrimitive.Root>
      <DropdownMenuPrimitive.Trigger asChild>
        {trigger}
      </DropdownMenuPrimitive.Trigger>

      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          align={align}
          sideOffset={8}
          className="z-50 min-w-[200px] bg-surface-dark/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-2 shadow-2xl shadow-black/50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
        >
          {children}
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
}

interface DropdownMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  destructive?: boolean;
}

export function DropdownMenuItem({
  children,
  onClick,
  destructive = false,
}: DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      onClick={onClick}
      className={[
        "flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl cursor-pointer outline-none transition-all duration-200",
        destructive
          ? "text-red-400 hover:bg-red-500/10 focus:bg-red-500/10"
          : "text-slate-400 hover:bg-white/5 hover:text-primary focus:bg-white/5 focus:text-primary",
      ].join(" ")}
    >
      {children}
    </DropdownMenuPrimitive.Item>
  );
}

export function DropdownMenuSeparator() {
  return (
    <DropdownMenuPrimitive.Separator className="h-px bg-white/5 my-2" />
  );
}

export function DropdownMenuLabel({ children }: { children: ReactNode }) {
  return (
    <DropdownMenuPrimitive.Label className="px-4 py-2 text-[8px] font-black text-slate-600 uppercase tracking-[0.4em]">
      {children}
    </DropdownMenuPrimitive.Label>
  );
}