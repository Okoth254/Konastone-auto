import { z } from "zod";

// Phone number regex for Kenyan format (e.g., +254..., 07...)
const phoneRegex = /^(?:\+254|0)[17]\d{8}$/;

// --- 1. General Inquiry Form Schema ---
export const inquirySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().regex(phoneRegex, "Please enter a valid Kenyan phone number"),
    message: z.string().min(10, "Message must be at least 10 characters").max(500, "Message is too long"),
    preferredContact: z.enum(["email", "phone", "whatsapp"]).default("email"),
});

export type InquiryFormData = z.infer<typeof inquirySchema>;

// --- 2. Test Drive Booking Schema ---
export const bookingSchema = z.object({
    vehicleId: z.string(),
    vehicleName: z.string(), // Hidden field for context
    date: z.date({
        required_error: "Please select a date",
        invalid_type_error: "That's not a date!",
    }).refine((date) => date > new Date(), {
        message: "Booking date must be in the future",
    }),
    time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
    location: z.enum(["showroom", "home", "office"]).default("showroom"),
    notes: z.string().optional(),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

// --- 3. Finance Application Schema (Hire Purchase) ---
export const financeSchema = z.object({
    // Personal Details
    fullName: z.string().min(2, "Full name is required"),
    idNumber: z.string().min(6, "Valid ID number required"),
    kraPin: z.string().regex(/^[A-Z]\d{9}[A-Z]$/, "Invalid KRA PIN format"),

    // Financial Details
    monthlyIncome: z.number().min(15000, "Minimum income requirement not met"),
    employmentStatus: z.enum(["employed", "self-employed", "business-owner"]),
    existingLoans: z.boolean().default(false),

    // Vehicle Preferences (Linked to Calculator)
    depositAmount: z.number().min(50000, "Minimum deposit is KES 50,000"),
    repaymentPeriod: z.number().min(12).max(48),
});

export type FinanceFormData = z.infer<typeof financeSchema>;
