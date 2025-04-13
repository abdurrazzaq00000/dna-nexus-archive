
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/auth";

export interface Lab {
  id: string;
  name: string;
  location?: string;
  active: boolean;
  created_at: string;
  created_by?: string;
}

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
  return data as Lab;
}

export async function createLab(labData: Omit<Lab, 'id' | 'created_at'>) {
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
