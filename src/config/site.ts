export const siteConfig = {
    contact: {
        phone: "+254 722 511 803",
        phoneFormatted: "+254722511803",
        email: "sales@konastoneautos.co.ke",
        address: "Links Road, Nyali",
        city: "Mombasa, Kenya",
        workingHours: "Mon-Sat: 8am - 6pm",
    },
    finance: {
        defaultDepositPercent: 30, // Default 30% deposit
        interestRate: 0.14, // 14% flat interest rate
        minDepositPercent: 10,
        maxDepositPercent: 80,
        tenureOptions: [12, 24, 36], // Months
    },
    promises: [
        {
            id: "oil_change",
            icon: "oil_barrel",
            title: "Free Oil Change",
            description: "First service on us"
        },
        {
            id: "warranty",
            icon: "verified_user",
            title: "2 Months Warranty",
            description: "Peace of mind guaranteed"
        },
        {
            id: "transfers",
            icon: "assignment",
            title: "Free Transfers",
            description: "Logbook transfer included"
        }
    ],
    stats: [
        {
            icon: "directions_car",
            value: "500+",
            label: "Vehicles Sold"
        },
        {
            icon: "verified",
            value: "12+ Years",
            label: "Experience"
        },
        {
            icon: "payments",
            value: "Hire Purchase",
            label: "Available"
        },
        {
            icon: "account_balance",
            value: "Bank Finance",
            label: "Arranged"
        },
        {
            icon: "build",
            value: "Free",
            label: "Diagnostics"
        }
    ]
};
