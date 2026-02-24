import { supabase } from './supabase';

export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    images: string[];
    category: "suv" | "sedan" | "hatchback" | "truck";
    fuelType: "petrol" | "diesel" | "hybrid" | "electric";
    transmission: "automatic" | "manual";
    features: string[];
    description: string;

    hirePurchaseAvailable: boolean;
    minDeposit?: number;
    allowanceMonthly?: number;
}

// Function to map Supabase relational data to our flat Vehicle interface
export function mapSupabaseToVehicle(car: any): Vehicle {
    const images = car.car_images?.map((img: any) => img.image_url) || [];
    const specs = car.specifications as any || {};

    return {
        id: car.id,
        make: car.models?.brands?.name || "Unknown",
        model: car.models?.name || "Unknown",
        year: car.year,
        price: Number(car.price),
        mileage: car.mileage,
        images: images.length > 0 ? images : ["/images/placeholder.jpg"],
        category: car.models?.body_type?.toLowerCase() || "sedan",
        fuelType: car.fuel_type?.toLowerCase() || "petrol",
        transmission: car.transmission?.toLowerCase() || "automatic",
        features: specs.features || [],
        description: car.description || "",
        hirePurchaseAvailable: car.hire_purchase_available ?? true,
        minDeposit: Number(car.min_deposit) || 0,
        allowanceMonthly: Number(car.monthly_payment) || 0,
    };
}

export async function getVehicles() {
    const { data, error } = await supabase
        .from('cars')
        .select(`
            *,
            models (
                name,
                body_type,
                brands (
                    name
                )
            ),
            car_images (
                image_url,
                is_primary,
                sort_order
            )
        `)
        .eq('status', 'available')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching vehicles:', error);
        return [];
    }

    return (data || []).map(mapSupabaseToVehicle);
}

export async function getVehicleById(id: string) {
    const { data, error } = await supabase
        .from('cars')
        .select(`
            *,
            models (
                name,
                body_type,
                brands (
                    name
                )
            ),
            car_images (
                image_url,
                is_primary,
                sort_order
            )
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching vehicle:', error);
        return null;
    }

    return mapSupabaseToVehicle(data);
}

// Keeping the static 'vehicles' array for backwards compatibility during migration
// but marking it as deprecated.
/** @deprecated Use getVehicles() instead */
export const vehicles: Vehicle[] = [
    {
        id: "1",
        make: "Mercedes-Benz",
        model: "C-Class C200",
        year: 2018,
        price: 3500000,
        mileage: 45000,
        images: ["/images/mercedes-c200.jpg", "/images/mercedes-c200-int.jpg", "/images/mercedes-c200-rear.jpg"],
        category: "sedan",
        fuelType: "petrol",
        transmission: "automatic",
        features: ["Sunroof", "Leather Seats", "LED Headlights", "Reverse Camera", "Dual-zone Climate Control"],
        description: "A perfect blend of luxury and performance, this Mercedes-Benz C200 offers a smooth ride and premium features for the discerning driver.",
        hirePurchaseAvailable: true,
        minDeposit: 700000,
        allowanceMonthly: 95000,
    },
    {
        id: "2",
        make: "Toyota",
        model: "Prado TX-L",
        year: 2020,
        price: 6800000,
        mileage: 28000,
        images: ["/images/prado-txl.jpg", "/images/prado-txl-side.jpg", "/images/prado-txl-interior.jpg"],
        category: "suv",
        fuelType: "diesel",
        transmission: "automatic",
        features: ["4WD", "7 Seater", "Cruise Control", "Apple CarPlay", "Heated Seats", "Roof Rails"],
        description: "The Toyota Prado TX-L is the ultimate SUV for Kenyan roads, combining rugged off-road capability with luxury and 7-seater practicality.",
        hirePurchaseAvailable: true,
        minDeposit: 1500000,
        allowanceMonthly: 180000,
    },
    {
        id: "3",
        make: "Volkswagen",
        model: "Golf GTI",
        year: 2017,
        price: 2400000,
        mileage: 62000,
        images: ["/images/golf-gti.jpg", "/images/golf-gti-front.jpg", "/images/golf-gti-seats.jpg"],
        category: "hatchback",
        fuelType: "petrol",
        transmission: "automatic",
        features: ["Sport Suspension", "Navigation System", "Paddle Shifters", "Alloy Wheels", "Ambient Lighting"],
        description: "Performance in a compact package. This Golf GTI delivers an exhilarating driving experience with its sport-tuned suspension and powerful engine.",
        hirePurchaseAvailable: true,
        minDeposit: 500000,
        allowanceMonthly: 65000,
    },
    {
        id: "4",
        make: "Mazda",
        model: "CX-5",
        year: 2019,
        price: 3200000,
        mileage: 35000,
        images: ["/images/mazda-cx5.jpg", "/images/mazda-cx5-dash.jpg", "/images/mazda-cx5-side.jpg"],
        category: "suv",
        fuelType: "diesel",
        transmission: "automatic",
        features: ["Blind Spot Monitoring", "Power Liftgate", "Keyless Entry", "Bose Sound System", "Lane Departure Warning"],
        description: "Elegant design meets practical utility. The Mazda CX-5 is a premium compact SUV known for its refined interior and engaging driving dynamics.",
        hirePurchaseAvailable: true,
        minDeposit: 800000,
        allowanceMonthly: 88000,
    },
    {
        id: "5",
        make: "Subaru",
        model: "Outback",
        year: 2016,
        price: 2100000,
        mileage: 85000,
        images: ["/images/subaru-outback.jpg", "/images/subaru-outback-int.jpg"],
        category: "suv",
        fuelType: "petrol",
        transmission: "automatic",
        features: ["EyeSight Technology", "Symmetrical AWD", "Roof Rack", "Spacious Interior", "Fog Lights"],
        description: "The Subaru Outback is the perfect adventure companion, offering standard AWD and impressive ground clearance for any Kenyan terrain.",
        hirePurchaseAvailable: false,
    },
    {
        id: "6",
        make: "Land Rover",
        model: "Discovery Sport",
        year: 2018,
        price: 4500000,
        mileage: 55000,
        images: ["/images/disco-sport.jpg", "/images/disco-sport-int.jpg", "/images/disco-sport-rear.jpg"],
        category: "suv",
        fuelType: "diesel",
        transmission: "automatic",
        features: ["Terrain Response System", "Panoramic Roof", "Touchscreen Pro", "Meridian Sound", "Parking Assist"],
        description: "A versatile family SUV with genuine off-road capability. This Discovery Sport offers a premium interior and cutting-edge technology.",
        hirePurchaseAvailable: true,
        minDeposit: 1200000,
        allowanceMonthly: 125000,
    },
];
