import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Browse Cars for Sale in Mombasa | Konastone Autos",
    description: "Explorer our latest inventory of premium vehicles in Mombasa, Kenya. Hire purchase and direct buy options available for Toyota, Mercedes, Mazda and more.",
    keywords: ["Mombasa car inventory", "cars for sale Kenya", "Toyota Prado Mombasa", "Mercedes Benz Kenya"],
};

export default function InventoryLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
