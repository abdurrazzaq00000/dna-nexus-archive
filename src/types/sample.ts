
import { Database } from '@/integrations/supabase/types';

type SampleStatus = Database["public"]["Enums"]["sample_status"];

export interface Sample {
  id: string;
  sample_id: string;
  patient_name: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  collected_by?: string;
  status: SampleStatus;
  created_at?: string;
  lab_id?: string;
  qr_code_url?: string;
  history?: SampleHistory[];
}

export interface SampleHistory {
  id: string;
  status: SampleStatus;
  note?: string;
  created_at?: string;
  created_by?: string;
  sample_id?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lab' | 'manager';
  active: boolean;
  created_at: Date;
}

export interface Lab extends User {
  samplesCollected: number;
}

export interface SampleStats {
  total: number;
  new: number;
  inTransit: number;
  stored: number;
  processed: number;
  archived: number;
}
