
import { Database } from '@/integrations/supabase/types';

type SampleStatus = Database["public"]["Enums"]["sample_status"];

export interface Sample {
  id: string;
  sample_id: string;
  patient_name: string;
  age?: number | null;
  gender?: string;
  collected_by?: string | null;
  status: SampleStatus;
  created_at?: string | null;
  lab_id?: string | null;
  qr_code_url?: string | null;
  sample_history?: SampleHistory[];
}

export interface SampleHistory {
  id: string;
  status: SampleStatus;
  note?: string | null;
  created_at?: string | null;
  created_by?: string | null;
  sample_id?: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lab' | 'manager';
  active: boolean;
  created_at: Date;
}

export interface Lab {
  id: string;
  name: string;
  location?: string | null;
  active: boolean;
  created_at: string;
  created_by?: string | null;
  samplesCollected?: number; // Add this for mock data
}

export interface SampleStats {
  total: number;
  new: number;
  inTransit: number;
  stored: number;
  processed: number;
  archived: number;
}
