import { createClient } from "@/utils/supabase/server";
import HeroSection from "@/components/home/HeroSection";
import BrandCarousel from "@/components/home/BrandCarousel";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import StatsSection from "@/components/home/StatsSection";
import CTASection from "@/components/home/CTASection";

export const revalidate = 60;

export default async function Home() {
  const supabase = await createClient();

  // Fetch featured vehicles
  const { data: featuredVehicles } = await supabase
    .from('vehicles')
    .select(`
      id,
      make,
      model,
      year,
      price,
      mileage,
      fuel_type,
      transmission,
      status,
      folder_name,
      is_featured,
      vehicle_images(public_url)
    `)
    .eq('is_featured', true)
    .eq('status', 'available')
    .limit(6);

  // Fetch unique makes for brand carousel
  const { data: makesData } = await supabase
    .from('vehicles')
    .select('make')
    .eq('status', 'available');

  const uniqueMakes = [...new Set(makesData?.map(v => v.make) || [])];

  return (
    <div className="overflow-hidden bg-(--color-background)">
      <HeroSection />
      <BrandCarousel makes={uniqueMakes} />
      <FeaturedVehicles vehicles={featuredVehicles || []} />
      <StatsSection />
      <WhyChooseUs />
      <CTASection />
    </div>
  );
}