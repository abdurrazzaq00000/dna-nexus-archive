
import { supabase } from "@/integrations/supabase/client";
import { Lab } from "@/types/sample";

export async function fetchLabs() {
  const { data, error } = await supabase
    .from('labs')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data as Lab[];
}

export async function fetchActiveLabs() {
  const { data, error } = await supabase
    .from('labs')
    .select('*')
    .eq('active', true)
    .order('name');
  
  if (error) throw error;
  return data as Lab[];
}

export async function fetchLabById(id: string) {
  const { data, error } = await supabase
    .from('labs')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  
  // Add samples count (can be enhanced to get real count from samples table)
  const labWithSamplesCount = {
    ...data,
    samplesCollected: 0 // Default value
  } as Lab;
  
  // Get count of samples collected by this lab
  const { count, error: samplesError } = await supabase
    .from('samples')
    .select('*', { count: 'exact', head: true })
    .eq('lab_id', id);
    
  if (!samplesError && count !== null) {
    labWithSamplesCount.samplesCollected = count;
  }
  
  return labWithSamplesCount;
}

export async function createLab(labData: Omit<Lab, 'id' | 'created_at' | 'samplesCollected'>) {
  const { data, error } = await supabase
    .from('labs')
    .insert([labData])
    .select()
    .single();
  
  if (error) throw error;
  return data as Lab;
}

export async function updateLabStatus(id: string, active: boolean) {
  const { data, error } = await supabase
    .from('labs')
    .update({ active })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Lab;
}
