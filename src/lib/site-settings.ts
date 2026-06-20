import { cache } from "react";
import { siteConfig } from "@/config/site";
import { createClient } from "@/utils/supabase/server";
import type { SiteSettings } from "@/types/database";

const fallbackSettings: SiteSettings = {
  contact: siteConfig.contact,
  finance: siteConfig.finance,
  social: {
    facebook: "https://facebook.com/konastoneautos",
    instagram: "https://instagram.com/konastoneautos",
    twitter: "https://twitter.com/konastoneautos",
    linkedin: "https://linkedin.com/company/konastoneautos",
  },
};

function mergeSettings(value: Partial<SiteSettings> | null | undefined): SiteSettings {
  return {
    contact: { ...fallbackSettings.contact, ...(value?.contact || {}) },
    finance: { ...fallbackSettings.finance, ...(value?.finance || {}) },
    social: { ...fallbackSettings.social, ...(value?.social || {}) },
  };
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", "global")
      .maybeSingle();

    if (error || !data?.value) return fallbackSettings;
    return mergeSettings(data.value as Partial<SiteSettings>);
  } catch {
    return fallbackSettings;
  }
});

export function getFallbackSiteSettings() {
  return fallbackSettings;
}
