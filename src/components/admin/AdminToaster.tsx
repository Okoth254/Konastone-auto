"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "sonner";

const vehicleActionMessages: Record<string, { title: string; description: string }> = {
  featured: { title: "Vehicle featured", description: "Eligible available stock can now appear on the homepage." },
  unfeatured: { title: "Vehicle unfeatured", description: "The vehicle remains in inventory when available." },
  reserved: { title: "Vehicle reserved", description: "The catalogue record is now marked as held for a buyer." },
  sold: { title: "Vehicle marked sold", description: "The public catalogue has been revalidated." },
  deleted: { title: "Vehicle removed", description: "The record and public catalogue pages have been revalidated." },
};

export default function AdminToaster() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const vehicleAction = searchParams.get("vehicleAction");
    if (!vehicleAction) return;

    const message = vehicleActionMessages[vehicleAction];
    if (message) {
      toast.success(message.title, { description: message.description });
    }

    const params = new URLSearchParams(searchParams.toString());
    params.delete("vehicleAction");
    const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [pathname, router, searchParams]);

  return (
    <Toaster
      position="top-right"
      richColors
      toastOptions={{
        classNames: {
          toast: "!bg-surface-dark !border-white/10 !text-white !rounded-2xl !font-heading",
          title: "!text-[11px] !font-black !uppercase !tracking-[0.2em]",
          description: "!text-slate-400 !text-xs",
        },
      }}
    />
  );
}
