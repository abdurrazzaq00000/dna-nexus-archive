
import { supabase } from "@/integrations/supabase/client";
import { Sample, SampleHistory } from "@/types/sample";

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

export async function fetchSamplesByStatus(status: string) {
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

export async function createSample(sampleData: Omit<Sample, 'id' | 'createdAt' | 'history'>) {
  const { data, error } = await supabase
    .from('samples')
    .insert([sampleData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateSampleStatus(sampleId: string, status: string, note: string, updatedBy: string) {
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

export async function getSampleStats() {
  // Get sample counts by status
  const statuses = ['New', 'In Transit', 'Stored', 'Processed', 'Archived'];
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
    new: counts.find(c => c.status === 'New')?.count || 0,
    inTransit: counts.find(c => c.status === 'In Transit')?.count || 0,
    stored: counts.find(c => c.status === 'Stored')?.count || 0,
    processed: counts.find(c => c.status === 'Processed')?.count || 0,
    archived: counts.find(c => c.status === 'Archived')?.count || 0
  };
}
