
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "@/types/auth";

export async function fetchUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Profile[];
}

export async function fetchUsersByRole(role: 'admin' | 'lab' | 'manager') {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', role)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Profile[];
}

export async function fetchActiveUsersByRole(role: 'admin' | 'lab' | 'manager') {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', role)
    .eq('active', true)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data as Profile[];
}

export async function updateUserStatus(id: string, active: boolean) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ active })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data as Profile;
}
