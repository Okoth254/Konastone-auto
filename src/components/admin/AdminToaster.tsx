"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast, Toaster } from "sonner";

const vehicleActionMessages: Record<string, { title: string; description: string }> = {
  draft: { title: "Draft saved", description: "The record is saved privately and can be completed before publishing." },
  featured: { title: "Vehicle featured", description: "Eligible available stock can now appear on the homepage." },
  unfeatured: { title: "Vehicle unfeatured", description: "The vehicle remains in inventory when available." },
  reserved: { title: "Vehicle reserved", description: "The catalogue record is now marked as held for a buyer." },
  drafted: { title: "Vehicle moved to draft", description: "The public catalogue has been revalidated." },
  sold: { title: "Vehicle marked sold", description: "The public catalogue has been revalidated." },
  deleted: { title: "Vehicle removed", description: "The record and public catalogue pages have been revalidated." },
};

const vehicleErrorMessages: Record<string, { title: string; description: string }> = {
  draft_incomplete: {
    title: "Draft needs core details",
    description: "Add make, model, year, and price before saving. Public fields can stay incomplete until publish.",
  },
  publish_incomplete: {
    title: "Listing is not ready",
    description: "Add make, model, year, price, mileage, fuel type, transmission, and at least one image before publishing or featuring.",
  },
  delete_prepare_failed: { title: "Delete could not start", description: "The vehicle images could not be checked. Try again or review Supabase permissions." },
  delete_storage_failed: { title: "Images were not removed", description: "The vehicle was not deleted because storage cleanup failed." },
  delete_failed: { title: "Vehicle was not deleted", description: "The database delete failed. Check permissions or try again." },
};

export default function AdminToaster() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const vehicleAction = searchParams.get("vehicleAction");
    const message = vehicleAction ? vehicleActionMessages[vehicleAction] : undefined;
    if (message) {
      toast.success(message.title, { description: message.description });
    }

    const vehicleError = searchParams.get("vehicleError");
    const errorMessage = vehicleError ? vehicleErrorMessages[vehicleError] : undefined;
    if (errorMessage) {
      toast.error(errorMessage.title, { description: errorMessage.description });
    }

    if (!message && !errorMessage) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("vehicleAction");
    params.delete("vehicleError");
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
