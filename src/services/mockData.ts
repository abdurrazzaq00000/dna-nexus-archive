
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
    createdAt: new Date('2023-01-15'),
    samplesCollected: 124
  },
  {
    id: '2',
    name: 'BioTech Solutions',
    email: 'biotech@dna-nexus.com',
    role: 'lab',
    active: true,
    createdAt: new Date('2023-03-22'),
    samplesCollected: 89
  },
  {
    id: '3',
    name: 'Genome Research Inc',
    email: 'genome@dna-nexus.com',
    role: 'lab',
    active: false,
    createdAt: new Date('2023-02-10'),
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
    createdAt: new Date('2023-01-20')
  },
  {
    id: '2',
    name: 'Robert Johnson',
    email: 'robert@dna-nexus.com',
    role: 'manager',
    active: true,
    createdAt: new Date('2023-04-05')
  },
  {
    id: '3',
    name: 'Emily Clark',
    email: 'emily@dna-nexus.com',
    role: 'manager',
    active: false,
    createdAt: new Date('2023-02-15')
  }
];

// List of statuses
export const sampleStatuses = ['New', 'In Transit', 'Stored', 'Processed', 'Archived'];

// Generate mock samples
export const generateMockSamples = (count: number): Sample[] => {
  const samples: Sample[] = [];
  
  const genders = ['Male', 'Female', 'Other'];
  const labIds = mockLabs.map(lab => lab.id);
  
  for (let i = 0; i < count; i++) {
    const createdAt = randomDate();
    const status = sampleStatuses[Math.floor(Math.random() * sampleStatuses.length)] as 'New' | 'In Transit' | 'Stored' | 'Processed' | 'Archived';
    const sampleId = generateSampleId();
    
    const sample: Sample = {
      id: `sample-${i + 1}`,
      sampleId,
      patientName: `Patient ${i + 1}`,
      age: 20 + Math.floor(Math.random() * 60),
      gender: genders[Math.floor(Math.random() * genders.length)] as 'Male' | 'Female' | 'Other',
      collectedBy: labIds[Math.floor(Math.random() * labIds.length)],
      status,
      createdAt,
      history: [
        {
          id: `history-${i}-1`,
          status: 'New',
          note: 'Sample collected',
          date: createdAt,
        }
      ],
      notes: Math.random() > 0.7 ? 'Additional notes about this sample' : undefined,
    };
    
    // Add more history if not new
    if (status !== 'New') {
      const transitDate = new Date(createdAt);
      transitDate.setHours(transitDate.getHours() + Math.random() * 48);
      
      sample.history.push({
        id: `history-${i}-2`,
        status: 'In Transit',
        note: 'Sample in transit to storage',
        date: transitDate,
      });
      
      if (status !== 'In Transit') {
        const storedDate = new Date(transitDate);
        storedDate.setHours(storedDate.getHours() + Math.random() * 24);
        
        sample.history.push({
          id: `history-${i}-3`,
          status: 'Stored',
          note: 'Sample stored in repository',
          date: storedDate,
        });
        
        if (status === 'Processed' || status === 'Archived') {
          const processedDate = new Date(storedDate);
          processedDate.setHours(processedDate.getHours() + Math.random() * 72);
          
          sample.history.push({
            id: `history-${i}-4`,
            status: 'Processed',
            note: 'Sample analysis complete',
            date: processedDate,
          });
          
          if (status === 'Archived') {
            const archivedDate = new Date(processedDate);
            archivedDate.setHours(archivedDate.getHours() + Math.random() * 72);
            
            sample.history.push({
              id: `history-${i}-5`,
              status: 'Archived',
              note: 'Sample archived',
              date: archivedDate,
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
    new: samples.filter(s => s.status === 'New').length,
    inTransit: samples.filter(s => s.status === 'In Transit').length,
    stored: samples.filter(s => s.status === 'Stored').length,
    processed: samples.filter(s => s.status === 'Processed').length,
    archived: samples.filter(s => s.status === 'Archived').length,
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
