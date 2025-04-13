
import { Lab, Sample, SampleStats, User } from "@/types/sample";

// Generate a random date within the last 3 months
const randomDate = () => {
  const now = new Date();
  const threeMonthsAgo = new Date(now);
  threeMonthsAgo.setMonth(now.getMonth() - 3);
  
  return new Date(
    threeMonthsAgo.getTime() + 
    Math.random() * (now.getTime() - threeMonthsAgo.getTime())
  );
};

// Generate a unique sample ID
const generateSampleId = () => {
  const prefix = 'DNA';
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${timestamp}-${random}`;
};

// Mock labs data
export const mockLabs: Lab[] = [
  {
    id: '1',
    name: 'Central Research Lab',
    email: 'central@dna-nexus.com',
    role: 'lab',
    active: true,
    created_at: new Date('2023-01-15'),
    samplesCollected: 124
  },
  {
    id: '2',
    name: 'BioTech Solutions',
    email: 'biotech@dna-nexus.com',
    role: 'lab',
    active: true,
    created_at: new Date('2023-03-22'),
    samplesCollected: 89
  },
  {
    id: '3',
    name: 'Genome Research Inc',
    email: 'genome@dna-nexus.com',
    role: 'lab',
    active: false,
    created_at: new Date('2023-02-10'),
    samplesCollected: 45
  }
];

// Mock managers data
export const mockManagers: User[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane@dna-nexus.com',
    role: 'manager',
    active: true,
    created_at: new Date('2023-01-20')
  },
  {
    id: '2',
    name: 'Robert Johnson',
    email: 'robert@dna-nexus.com',
    role: 'manager',
    active: true,
    created_at: new Date('2023-04-05')
  },
  {
    id: '3',
    name: 'Emily Clark',
    email: 'emily@dna-nexus.com',
    role: 'manager',
    active: false,
    created_at: new Date('2023-02-15')
  }
];

// List of statuses (using the proper enum values from Supabase)
export const sampleStatuses: Array<"new" | "in_transit" | "stored" | "processed" | "archived"> = 
  ['new', 'in_transit', 'stored', 'processed', 'archived'];

// Generate mock samples
export const generateMockSamples = (count: number): Sample[] => {
  const samples: Sample[] = [];
  
  const genders = ['Male', 'Female', 'Other'];
  const labIds = mockLabs.map(lab => lab.id);
  
  for (let i = 0; i < count; i++) {
    const createdDate = randomDate();
    const status = sampleStatuses[Math.floor(Math.random() * sampleStatuses.length)];
    const sampleId = generateSampleId();
    
    const sample: Sample = {
      id: `sample-${i + 1}`,
      sample_id: sampleId,
      patient_name: `Patient ${i + 1}`,
      age: 20 + Math.floor(Math.random() * 60),
      gender: genders[Math.floor(Math.random() * genders.length)] as 'Male' | 'Female' | 'Other',
      collected_by: labIds[Math.floor(Math.random() * labIds.length)],
      status,
      created_at: createdDate.toISOString(),
      history: [
        {
          id: `history-${i}-1`,
          status: 'new',
          note: 'Sample collected',
          created_at: createdDate.toISOString(),
        }
      ]
    };
    
    // Add more history if not new
    if (status !== 'new') {
      const transitDate = new Date(createdDate);
      transitDate.setHours(transitDate.getHours() + Math.random() * 48);
      
      sample.history.push({
        id: `history-${i}-2`,
        status: 'in_transit',
        note: 'Sample in transit to storage',
        created_at: transitDate.toISOString(),
      });
      
      if (status !== 'in_transit') {
        const storedDate = new Date(transitDate);
        storedDate.setHours(storedDate.getHours() + Math.random() * 24);
        
        sample.history.push({
          id: `history-${i}-3`,
          status: 'stored',
          note: 'Sample stored in repository',
          created_at: storedDate.toISOString(),
        });
        
        if (status === 'processed' || status === 'archived') {
          const processedDate = new Date(storedDate);
          processedDate.setHours(processedDate.getHours() + Math.random() * 72);
          
          sample.history.push({
            id: `history-${i}-4`,
            status: 'processed',
            note: 'Sample analysis complete',
            created_at: processedDate.toISOString(),
          });
          
          if (status === 'archived') {
            const archivedDate = new Date(processedDate);
            archivedDate.setHours(archivedDate.getHours() + Math.random() * 72);
            
            sample.history.push({
              id: `history-${i}-5`,
              status: 'archived',
              note: 'Sample archived',
              created_at: archivedDate.toISOString(),
            });
          }
        }
      }
    }
    
    samples.push(sample);
  }
  
  return samples;
};

// Generate mock stats
export const generateMockStats = (samples: Sample[]): SampleStats => {
  return {
    total: samples.length,
    new: samples.filter(s => s.status === 'new').length,
    inTransit: samples.filter(s => s.status === 'in_transit').length,
    stored: samples.filter(s => s.status === 'stored').length,
    processed: samples.filter(s => s.status === 'processed').length,
    archived: samples.filter(s => s.status === 'archived').length,
  };
};

// Mock samples
export const mockSamples = generateMockSamples(100);

// Mock stats
export const mockSampleStats = generateMockStats(mockSamples);

// Generate monthly sample data for charts
export const generateMonthlyData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth(); // 0-11
  
  // Get last 6 months
  const lastSixMonths = [];
  for (let i = 5; i >= 0; i--) {
    const monthIndex = (currentMonth - i + 12) % 12;
    lastSixMonths.push(months[monthIndex]);
  }
  
  return lastSixMonths.map(month => ({
    month,
    count: Math.floor(Math.random() * 40) + 10
  }));
};
