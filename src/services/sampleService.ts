
import { supabase } from "@/integrations/supabase/client";
import { Sample, SampleHistory, SampleStats } from "@/types/sample";
import { Database } from "@/integrations/supabase/types";

type SampleStatus = Database["public"]["Enums"]["sample_status"];

export async function fetchSamples() {
  const { data, error } = await supabase
    .from('samples')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function fetchSampleById(id: string) {
  const { data, error } = await supabase
    .from('samples')
    .select(`
      *,
      sample_history(*)
    `)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function fetchSamplesByStatus(status: SampleStatus) {
  const { data, error } = await supabase
    .from('samples')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function fetchSamplesByLab(labId: string) {
  const { data, error } = await supabase
    .from('samples')
    .select('*')
    .eq('lab_id', labId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function createSample(sampleData: {
  patient_name: string;
  sample_id: string;
  age?: number;
  gender?: string;
  collected_by?: string;
  lab_id?: string;
  status?: SampleStatus;
  qr_code_url?: string;
}) {
  const { data, error } = await supabase
    .from('samples')
    .insert([sampleData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateSampleStatus(sampleId: string, status: SampleStatus, note: string, updatedBy: string) {
  // First update the sample status
  const { error: sampleError } = await supabase
    .from('samples')
    .update({ status })
    .eq('id', sampleId);
  
  if (sampleError) throw sampleError;
  
  // Then add history record
  const historyRecord = {
    sample_id: sampleId,
    status,
    note,
    created_by: updatedBy
  };
  
  const { data, error: historyError } = await supabase
    .from('sample_history')
    .insert([historyRecord])
    .select();
  
  if (historyError) throw historyError;
  
  return data;
}

export async function getSampleStats(): Promise<SampleStats> {
  // Get sample counts by status
  const statuses: SampleStatus[] = ['new', 'in_transit', 'stored', 'processed', 'archived'];
  const counts = await Promise.all(statuses.map(async (status) => {
    const { count, error } = await supabase
      .from('samples')
      .select('*', { count: 'exact', head: true })
      .eq('status', status);
    
    if (error) throw error;
    return { status, count: count || 0 };
  }));
  
  // Calculate total
  const total = counts.reduce((sum, { count }) => sum + count, 0);
  
  return {
    total,
    new: counts.find(c => c.status === 'new')?.count || 0,
    inTransit: counts.find(c => c.status === 'in_transit')?.count || 0,
    stored: counts.find(c => c.status === 'stored')?.count || 0,
    processed: counts.find(c => c.status === 'processed')?.count || 0,
    archived: counts.find(c => c.status === 'archived')?.count || 0
  };
}
