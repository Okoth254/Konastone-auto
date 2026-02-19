export interface Vehicle {
    id: string;
    make: string;
    model: string;
    year: number;
    price: number;
    mileage: number;
    image: string;
    category: "suv" | "sedan" | "hatchback" | "truck";
    fuelType: "petrol" | "diesel" | "hybrid" | "electric";
    transmission: "automatic" | "manual";

    hirePurchaseAvailable: boolean;
    minDeposit?: number;
    allowanceMonthly?: number;
}

export const vehicles: Vehicle[] = [
    {
        id: "1",
        make: "Mercedes-Benz",
        model: "C-Class C200",
        year: 2018,
        price: 3500000,
        mileage: 45000,
        image: "/images/mercedes-c200.jpg",
        category: "sedan",
        fuelType: "petrol",
        transmission: "automatic",
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
        image: "/images/prado-txl.jpg",
        category: "suv",
        fuelType: "diesel",
        transmission: "automatic",
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
        image: "/images/golf-gti.jpg",
        category: "hatchback",
        fuelType: "petrol",
        transmission: "automatic",
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
        image: "/images/mazda-cx5.jpg",
        category: "suv",
        fuelType: "diesel",
        transmission: "automatic",
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
        image: "/images/subaru-outback.jpg",
        category: "suv",
        fuelType: "petrol",
        transmission: "automatic",
        hirePurchaseAvailable: false,
    },
    {
        id: "6",
        make: "Land Rover",
        model: "Discovery Sport",
        year: 2018,
        price: 4500000,
        mileage: 55000,
        image: "/images/disco-sport.jpg",
        category: "suv",
        fuelType: "diesel",
        transmission: "automatic",
        hirePurchaseAvailable: true,
        minDeposit: 1200000,
        allowanceMonthly: 125000,
    },
];
