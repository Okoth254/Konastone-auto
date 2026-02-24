export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            brands: {
                Row: {
                    id: string
                    name: string
                    slug: string | null
                    logo_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug?: string | null
                    logo_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string | null
                    logo_url?: string | null
                    created_at?: string
                }
            }
            models: {
                Row: {
                    id: string
                    brand_id: string
                    name: string
                    body_type: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    brand_id: string
                    name: string
                    body_type?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    brand_id?: string
                    name?: string
                    body_type?: string | null
                    created_at?: string
                }
            }
            cars: {
                Row: {
                    id: string
                    model_id: string
                    title: string
                    description: string | null
                    price: number
                    year: number
                    mileage: number
                    fuel_type: string | null
                    transmission: string | null
                    color: string | null
                    condition: 'new' | 'used'
                    status: 'available' | 'reserved' | 'sold'
                    featured: boolean
                    location: string | null
                    specifications: Json | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    model_id: string
                    title: string
                    description?: string | null
                    price: number
                    year: number
                    mileage: number
                    fuel_type?: string | null
                    transmission?: string | null
                    color?: string | null
                    condition: 'new' | 'used'
                    status?: 'available' | 'reserved' | 'sold'
                    featured?: boolean
                    location?: string | null
                    specifications?: Json | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    model_id?: string
                    title?: string
                    description?: string | null
                    price?: number
                    year?: number
                    mileage?: number
                    fuel_type?: string | null
                    transmission?: string | null
                    color?: string | null
                    condition?: 'new' | 'used'
                    status?: 'available' | 'reserved' | 'sold'
                    featured?: boolean
                    location?: string | null
                    specifications?: Json | null
                    created_at?: string
                    updated_at?: string
                }
            }
            car_images: {
                Row: {
                    id: string
                    car_id: string
                    image_url: string
                    is_primary: boolean
                    sort_order: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    car_id: string
                    image_url: string
                    is_primary?: boolean
                    sort_order?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    car_id?: string
                    image_url?: string
                    is_primary?: boolean
                    sort_order?: number
                    created_at?: string
                }
            }
            hire_purchase_plans: {
                Row: {
                    id: string
                    name: string | null
                    min_deposit_percent: number
                    max_duration_months: number
                    interest_rate: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    name?: string | null
                    min_deposit_percent: number
                    max_duration_months: number
                    interest_rate: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string | null
                    min_deposit_percent?: number
                    max_duration_months?: number
                    interest_rate?: number
                    created_at?: string
                }
            }
            hire_purchase_applications: {
                Row: {
                    id: string
                    car_id: string | null
                    full_name: string
                    phone: string
                    email: string | null
                    national_id: string | null
                    employment_status: string | null
                    monthly_income: number | null
                    deposit_amount: number | null
                    requested_duration: number | null
                    application_status: 'pending' | 'under_review' | 'approved' | 'rejected'
                    admin_notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    car_id?: string | null
                    full_name: string
                    phone: string
                    email?: string | null
                    national_id?: string | null
                    employment_status?: string | null
                    monthly_income?: number | null
                    deposit_amount?: number | null
                    requested_duration?: number | null
                    application_status?: 'pending' | 'under_review' | 'approved' | 'rejected'
                    admin_notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    car_id?: string | null
                    full_name?: string
                    phone?: string
                    email?: string | null
                    national_id?: string | null
                    employment_status?: string | null
                    monthly_income?: number | null
                    deposit_amount?: number | null
                    requested_duration?: number | null
                    application_status?: 'pending' | 'under_review' | 'approved' | 'rejected'
                    admin_notes?: string | null
                    created_at?: string
                }
            }
            purchase_inquiries: {
                Row: {
                    id: string
                    car_id: string | null
                    full_name: string
                    phone: string
                    email: string | null
                    message: string | null
                    inquiry_status: 'new' | 'contacted' | 'closed'
                    created_at: string
                }
                Insert: {
                    id?: string
                    car_id?: string | null
                    full_name: string
                    phone: string
                    email?: string | null
                    message?: string | null
                    inquiry_status?: 'new' | 'contacted' | 'closed'
                    created_at?: string
                }
                Update: {
                    id?: string
                    car_id?: string | null
                    full_name?: string
                    phone?: string
                    email?: string | null
                    message?: string | null
                    inquiry_status?: 'new' | 'contacted' | 'closed'
                    created_at?: string
                }
            }
            trade_in_requests: {
                Row: {
                    id: string
                    full_name: string
                    phone: string
                    email: string | null
                    vehicle_brand: string | null
                    vehicle_model: string | null
                    year: number | null
                    mileage: number | null
                    condition: string | null
                    expected_price: number | null
                    description: string | null
                    status: 'new' | 'reviewing' | 'approved' | 'rejected'
                    admin_notes: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    full_name: string
                    phone: string
                    email?: string | null
                    vehicle_brand?: string | null
                    vehicle_model?: string | null
                    year?: number | null
                    mileage?: number | null
                    condition?: string | null
                    expected_price?: number | null
                    description?: string | null
                    status?: 'new' | 'reviewing' | 'approved' | 'rejected'
                    admin_notes?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string
                    phone?: string
                    email?: string | null
                    vehicle_brand?: string | null
                    vehicle_model?: string | null
                    year?: number | null
                    mileage?: number | null
                    condition?: string | null
                    expected_price?: number | null
                    description?: string | null
                    status?: 'new' | 'reviewing' | 'approved' | 'rejected'
                    admin_notes?: string | null
                    created_at?: string
                }
            }
            trade_in_images: {
                Row: {
                    id: string
                    trade_in_id: string
                    image_url: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    trade_in_id: string
                    image_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    trade_in_id?: string
                    image_url?: string | null
                    created_at?: string
                }
            }
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    role: 'admin' | 'sales_agent' | 'finance_officer' | null
                    created_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    role?: 'admin' | 'sales_agent' | 'finance_officer' | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    role?: 'admin' | 'sales_agent' | 'finance_officer' | null
                    created_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
