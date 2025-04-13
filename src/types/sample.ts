
export interface Sample {
  id: string;
  sampleId: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  collectedBy: string;
  status: 'New' | 'In Transit' | 'Stored' | 'Processed' | 'Archived';
  createdAt: Date;
  history: SampleHistory[];
  qrCodeUrl?: string;
  notes?: string;
}

export interface SampleHistory {
  id: string;
  status: string;
  note: string;
  date: Date;
  updatedBy?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'lab' | 'manager';
  active: boolean;
  createdAt: Date;
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
