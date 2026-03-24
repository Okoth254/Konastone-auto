'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addTimelineNote(leadId: string, formData: FormData) {
    const supabase = await createClient();
    const note = formData.get('note') as string;
    
    if (!note || note.trim() === '') return;

    const { error } = await supabase
        .from('lead_timeline_events')
        .insert({
            lead_id: leadId,
            event_type: 'technical_note',
            description: note.trim()
        });

    if (error) {
        console.error('Error adding timeline note:', error);
        throw new Error('Failed to add technical note');
    }
    
    revalidatePath(`/admin/leads/${leadId}`);
}

export async function updateLeadStatus(leadId: string, formData: FormData) {
    const supabase = await createClient();
    const status = formData.get('status') as string;
    
    if (!status) return;

    // Update status in leads table
    const { error: updateError } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', leadId);

    if (updateError) {
        console.error('Error updating lead status:', updateError);
        throw new Error('Failed to update lead status');
    }

    // Add timeline event for status change
    await supabase
        .from('lead_timeline_events')
        .insert({
            lead_id: leadId,
            event_type: 'status_changed',
            description: `Lead status updated to ${status.toUpperCase()}`
        });

    revalidatePath(`/admin/leads`);
    revalidatePath(`/admin/leads/${leadId}`);
}

export async function deleteLead(leadId: string) {
    const supabase = await createClient();
    
    // Deleting the lead will cascade delete timeline events if FK is set up correctly,
    // otherwise we just delete the lead.
    const { error } = await supabase
        .from('leads')
        .delete()
        .eq('id', leadId);

    if (error) {
        console.error('Error deleting lead:', error);
        throw new Error('Failed to delete lead');
    }

    revalidatePath('/admin/leads');
    // We cannot redirect from a server action without importing `redirect`
}
