import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface User {
    name: string;
    email: string;
    avatar?: string;
}

interface Booking {
    id: string;
    vehicleId: string;
    vehicleName: string;
    date: string;
    status: 'Pending' | 'Confirmed' | 'Completed';
}

interface Order {
    id: string;
    step: number;
    status: 'Draft' | 'Pending' | 'Paid';
    date: string;
}

interface FinanceApp {
    id: string;
    vehicleId: string;
    vehicleName: string;
    deposit: number;
    term: number;
    monthlyPayment: number;
    status: 'Review' | 'Approved' | 'Rejected';
    date: string;
}

interface AppState {
    // Favorites
    favorites: string[];
    addFavorite: (id: string) => void;
    removeFavorite: (id: string) => void;
    toggleFavorite: (id: string) => void;

    // Auth
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;

    // Data
    bookings: Booking[];
    addBooking: (booking: Booking) => void;

    orders: Order[];
    addOrder: (order: Order) => void;

    financeApplications: FinanceApp[];
    addFinanceApp: (app: FinanceApp) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set) => ({
            favorites: [],
            addFavorite: (id) => set((state) => ({ favorites: [...state.favorites, id] })),
            removeFavorite: (id) => set((state) => ({ favorites: state.favorites.filter((fid) => fid !== id) })),
            toggleFavorite: (id) => set((state) => {
                const isFav = state.favorites.includes(id);
                return { favorites: isFav ? state.favorites.filter((fid) => fid !== id) : [...state.favorites, id] };
            }),

            // Auth
            user: null,
            isAuthenticated: false,
            login: (user) => set({ user, isAuthenticated: true }),
            logout: () => set({ user: null, isAuthenticated: false }),

            // Data
            bookings: [],
            addBooking: (booking) => set((state) => ({ bookings: [booking, ...state.bookings] })),

            orders: [],
            addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),

            financeApplications: [],
            addFinanceApp: (app) => set((state) => ({ financeApplications: [app, ...state.financeApplications] })),
        }),
        {
            name: 'konastone-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
)
