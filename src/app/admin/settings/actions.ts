'use server';

import { revalidatePath } from "next/cache";
import { getFallbackSiteSettings } from "@/lib/site-settings";
import type { SiteSettings } from "@/types/database";
import { createClient } from "@/utils/supabase/server";

function numberFromForm(formData: FormData, key: string, fallback: number) {
  const value = Number(formData.get(key));
  return Number.isFinite(value) ? value : fallback;
}

export async function saveSiteSettings(formData: FormData) {
  const supabase = await createClient();
  const fallback = getFallbackSiteSettings();

  const settings: SiteSettings = {
    contact: {
      phone: String(formData.get("phone") || fallback.contact.phone),
      phoneFormatted: String(formData.get("phoneFormatted") || fallback.contact.phoneFormatted).replace(/[^\d]/g, ""),
      whatsapp: String(formData.get("whatsapp") || fallback.contact.whatsapp),
      email: String(formData.get("email") || fallback.contact.email),
      address: String(formData.get("address") || fallback.contact.address),
      city: String(formData.get("city") || fallback.contact.city),
      workingHours: String(formData.get("workingHours") || fallback.contact.workingHours),
    },
    finance: {
      defaultDepositPercent: numberFromForm(formData, "defaultDepositPercent", fallback.finance.defaultDepositPercent),
      interestRate: numberFromForm(formData, "interestRatePercent", fallback.finance.interestRate * 100) / 100,
      minDepositPercent: numberFromForm(formData, "minDepositPercent", fallback.finance.minDepositPercent),
      maxDepositPercent: numberFromForm(formData, "maxDepositPercent", fallback.finance.maxDepositPercent),
      tenureOptions: String(formData.get("tenureOptions") || fallback.finance.tenureOptions.join(","))
        .split(",")
        .map((item) => Number(item.trim()))
        .filter((item) => Number.isFinite(item) && item > 0),
    },
    social: {
      facebook: String(formData.get("facebook") || fallback.social.facebook),
      instagram: String(formData.get("instagram") || fallback.social.instagram),
      twitter: String(formData.get("twitter") || fallback.social.twitter),
      linkedin: String(formData.get("linkedin") || fallback.social.linkedin),
    },
  };

  if (!settings.finance.tenureOptions.length) {
    settings.finance.tenureOptions = fallback.finance.tenureOptions;
  }

  const { error } = await supabase
    .from("site_settings")
    .upsert({ key: "global", value: settings, updated_at: new Date().toISOString() }, { onConflict: "key" });

  if (error) {
    console.error("Error saving site settings:", error);
    throw new Error("Failed to save site settings. Confirm the site_settings migration has been run.");
  }

  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/inventory");
  revalidatePath("/reviews");
  revalidatePath("/admin/settings");
}
