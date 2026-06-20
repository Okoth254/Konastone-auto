'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function addTimelineNote(leadId: string, formData: FormData) {
    const supabase = await createClient();
    const note = formData.get('note') as string;
    
    if (!note || note.trim() === '') return;

    const { error } = await supabase
        .from('lead_timeline_events')
        .insert({
            lead_id: leadId,
            event_type: 'note',
            title: 'Follow-up note',
            description: note.trim()
        });

    if (error) {
        console.error('Error adding timeline note:', error);
        redirect(`/admin/leads/${leadId}?leadError=note_failed`);
    }

    await supabase.from('admin_audit_log').insert({
        action: 'lead_note_added',
        entity_type: 'lead',
        entity_id: leadId,
        summary: 'Lead follow-up note added',
    }).then(() => undefined);
    
    revalidatePath(`/admin/leads/${leadId}`);
    redirect(`/admin/leads/${leadId}?leadAction=note_added`);
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
        redirect(`/admin/leads/${leadId}?leadError=status_failed`);
    }

    // Add timeline event for status change
    await supabase
        .from('lead_timeline_events')
        .insert({
            lead_id: leadId,
            event_type: 'status_change',
            title: 'Status changed',
            description: `Lead status updated to ${status.toUpperCase()}`
        });

    await supabase.from('admin_audit_log').insert({
        action: 'lead_status_changed',
        entity_type: 'lead',
        entity_id: leadId,
        summary: `Lead status updated to ${status}`,
    }).then(() => undefined);

    revalidatePath(`/admin/leads`);
    revalidatePath(`/admin/leads/${leadId}`);
    redirect(`/admin/leads/${leadId}?leadAction=status_updated`);
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
        redirect(`/admin/leads/${leadId}?leadError=delete_failed`);
    }

    await supabase.from('admin_audit_log').insert({
        action: 'lead_deleted',
        entity_type: 'lead',
        entity_id: leadId,
        summary: 'Lead deleted from admin CRM',
    }).then(() => undefined);

    revalidatePath('/admin/leads');
    redirect('/admin/leads?leadAction=deleted');
}
