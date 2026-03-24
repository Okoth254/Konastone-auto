'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateReviewStatus(id: string, status: 'approved' | 'rejected') {
    const supabase = await createClient();
    
    const { error } = await supabase
        .from('customer_reviews')
        .update({ status })
        .eq('id', id);
        
    if (error) {
        console.error('Error updating review status:', error);
        throw new Error('Failed to update review status');
    }
    
    revalidatePath('/admin/reviews');
    revalidatePath(`/admin/reviews/${id}`);
    revalidatePath('/reviews'); // Revalidate public reviews page
    redirect('/admin/reviews');
}
