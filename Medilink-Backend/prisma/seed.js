/**
 * prisma/seed.js
 * Seeds the database with the same hospital data used in mockData.js.
 * Run with:  node prisma/seed.js
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Hospital data mirroring mockData.js ──────────────────────────────────────
const hospitals = [
  {
    id: 'h1',
    name: 'Apollo Multispeciality Hospital',
    address: 'Jubilee Hills, Hyderabad, Telangana 500033',
    city: 'Hyderabad', state: 'Telangana', pincode: '500033',
    phone: '+91 40-2355-8888', email: 'info@apollohyd.com',
    lat: 17.4326, lng: 78.4071,
    accreditation: 'NABH', password: 'apollo123',
    resources: {
      totalBeds: 500, availableBeds: 78, totalIcuBeds: 60, availableIcuBeds: 12,
      totalVentilators: 45, availableVentilators: 15,
      oxygenCapacity: 10000, oxygenAvailable: 7800,
      bloodAPos: 45, bloodANeg: 12, bloodBPos: 38, bloodBNeg: 8,
      bloodABPos: 15, bloodABNeg: 5, bloodOPos: 52, bloodONeg: 10,
    },
    specialists: [
      { name: 'Dr. Rajesh Kumar', specialty: 'Cardiology', available: true },
      { name: 'Dr. Priya Sharma', specialty: 'Neurology', available: true },
      { name: 'Dr. Arun Patel', specialty: 'Orthopedics', available: false },
      { name: 'Dr. Meena Reddy', specialty: 'Oncology', available: true },
      { name: 'Dr. Vikram Singh', specialty: 'Pulmonology', available: true },
    ],
    equipment: [
      { name: 'MRI Scanner', model: 'MRI-3T Pro', quantity: 1 },
      { name: 'CT Scanner', model: 'CT-64S Ultra', quantity: 2 },
      { name: 'X-Ray Machine', model: 'XR-2000D', quantity: 4 },
      { name: 'Ultrasound', model: 'US-Elite 5', quantity: 3 },
      { name: 'ECG Machine', model: 'ECG-12L', quantity: 10 },
      { name: 'Dialysis Machine', model: 'DLY-500', quantity: 5 },
      { name: 'Defibrillator', model: 'DEF-AX200', quantity: 8 },
      { name: 'Surgical Robot', model: 'SR-DaVinci', quantity: 1 },
    ],
  },
  {
    id: 'h2',
    name: 'AIIMS New Delhi',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi 110029',
    city: 'New Delhi', state: 'Delhi', pincode: '110029',
    phone: '+91 11-2658-8500', email: 'info@aiims.edu',
    lat: 28.5672, lng: 77.2100,
    accreditation: 'NABH', password: 'aiims123',
    resources: {
      totalBeds: 2500, availableBeds: 320, totalIcuBeds: 200, availableIcuBeds: 45,
      totalVentilators: 150, availableVentilators: 42,
      oxygenCapacity: 50000, oxygenAvailable: 38000,
      bloodAPos: 120, bloodANeg: 35, bloodBPos: 95, bloodBNeg: 22,
      bloodABPos: 40, bloodABNeg: 15, bloodOPos: 140, bloodONeg: 28,
    },
    specialists: [
      { name: 'Dr. S.K. Gupta', specialty: 'Cardiology', available: true },
      { name: 'Dr. Anita Desai', specialty: 'Neurology', available: true },
      { name: 'Dr. Ramesh Nair', specialty: 'General Surgery', available: true },
      { name: 'Dr. Kavita Joshi', specialty: 'Pediatrics', available: false },
      { name: 'Dr. Ajay Mathur', specialty: 'Nephrology', available: true },
      { name: 'Dr. Deepa Verma', specialty: 'Oncology', available: true },
    ],
    equipment: [
      { name: 'MRI Scanner', model: 'MRI-3T Pro', quantity: 3 },
      { name: 'CT Scanner', model: 'CT-64S Ultra', quantity: 5 },
      { name: 'X-Ray Machine', model: 'XR-2000D', quantity: 12 },
      { name: 'Ultrasound', model: 'US-Elite 5', quantity: 8 },
      { name: 'ECG Machine', model: 'ECG-12L', quantity: 25 },
      { name: 'Dialysis Machine', model: 'DLY-500', quantity: 15 },
      { name: 'Defibrillator', model: 'DEF-AX200', quantity: 20 },
      { name: 'Surgical Robot', model: 'SR-DaVinci', quantity: 2 },
    ],
  },
  {
    id: 'h3',
    name: 'Fortis Memorial Research Institute',
    address: 'Sector 44, Gurugram, Haryana 122002',
    city: 'Gurugram', state: 'Haryana', pincode: '122002',
    phone: '+91 124-4962-222', email: 'info@fortis.com',
    lat: 28.4520, lng: 77.0266,
    accreditation: 'NABH, JCI', password: 'fortis123',
    resources: {
      totalBeds: 1000, availableBeds: 145, totalIcuBeds: 100, availableIcuBeds: 22,
      totalVentilators: 80, availableVentilators: 28,
      oxygenCapacity: 25000, oxygenAvailable: 19500,
      bloodAPos: 65, bloodANeg: 18, bloodBPos: 55, bloodBNeg: 12,
      bloodABPos: 22, bloodABNeg: 8, bloodOPos: 75, bloodONeg: 15,
    },
    specialists: [
      { name: 'Dr. Ashok Rajgopal', specialty: 'Orthopedics', available: true },
      { name: 'Dr. Neena Kohli', specialty: 'Gastroenterology', available: true },
      { name: 'Dr. Sanjay Parikh', specialty: 'Cardiology', available: true },
      { name: 'Dr. Ritu Bhan', specialty: 'Pediatrics', available: true },
    ],
    equipment: [
      { name: 'MRI Scanner', model: 'MRI-3T Pro', quantity: 1 },
      { name: 'CT Scanner', model: 'CT-64S Ultra', quantity: 2 },
      { name: 'X-Ray Machine', model: 'XR-2000D', quantity: 5 },
      { name: 'ECG Machine', model: 'ECG-12L', quantity: 12 },
    ],
  },
  {
    id: 'h4',
    name: 'Medanta - The Medicity',
    address: 'CH Baktawar Singh Rd, Sector 38, Gurugram, Haryana 122001',
    city: 'Gurugram', state: 'Haryana', pincode: '122001',
    phone: '+91 124-4141-414', email: 'info@medanta.org',
    lat: 28.4395, lng: 77.0421,
    accreditation: 'NABH, JCI', password: 'medanta123',
    resources: {
      totalBeds: 1600, availableBeds: 210, totalIcuBeds: 350, availableIcuBeds: 55,
      totalVentilators: 120, availableVentilators: 35,
      oxygenCapacity: 40000, oxygenAvailable: 32000,
      bloodAPos: 88, bloodANeg: 25, bloodBPos: 72, bloodBNeg: 18,
      bloodABPos: 30, bloodABNeg: 10, bloodOPos: 95, bloodONeg: 20,
    },
    specialists: [
      { name: 'Dr. Naresh Trehan', specialty: 'Cardiology', available: true },
      { name: 'Dr. Arvind Kumar', specialty: 'Pulmonology', available: true },
      { name: 'Dr. Sushila Kataria', specialty: 'Emergency Medicine', available: true },
      { name: 'Dr. Randeep Guleria', specialty: 'Pulmonology', available: false },
    ],
    equipment: [
      { name: 'MRI Scanner', model: 'MRI-3T Pro', quantity: 2 },
      { name: 'CT Scanner', model: 'CT-64S Ultra', quantity: 3 },
      { name: 'X-Ray Machine', model: 'XR-2000D', quantity: 6 },
      { name: 'ECG Machine', model: 'ECG-12L', quantity: 15 },
    ],
  },
  {
    id: 'h5',
    name: 'Kokilaben Dhirubhai Ambani Hospital',
    address: 'Rao Saheb, Achutrao Patwardhan Marg, Mumbai 400053',
    city: 'Mumbai', state: 'Maharashtra', pincode: '400053',
    phone: '+91 22-3066-6666', email: 'info@kokilabenhospital.com',
    lat: 19.1286, lng: 72.8269,
    accreditation: 'NABH', password: 'kokilaben123',
    resources: {
      totalBeds: 750, availableBeds: 95, totalIcuBeds: 80, availableIcuBeds: 18,
      totalVentilators: 55, availableVentilators: 20,
      oxygenCapacity: 18000, oxygenAvailable: 14200,
      bloodAPos: 55, bloodANeg: 15, bloodBPos: 48, bloodBNeg: 10,
      bloodABPos: 18, bloodABNeg: 6, bloodOPos: 62, bloodONeg: 12,
    },
    specialists: [
      { name: 'Dr. Ram Narain', specialty: 'Neurology', available: true },
      { name: 'Dr. Santosh Shetty', specialty: 'Cardiology', available: true },
      { name: 'Dr. Jalil Parkar', specialty: 'Pulmonology', available: true },
    ],
    equipment: [
      { name: 'MRI Scanner', model: 'MRI-3T Pro', quantity: 1 },
      { name: 'CT Scanner', model: 'CT-64S Ultra', quantity: 2 },
      { name: 'ECG Machine', model: 'ECG-12L', quantity: 8 },
    ],
  },
  {
    id: 'h6',
    name: 'Christian Medical College (CMC)',
    address: 'Ida Scudder Road, Vellore, Tamil Nadu 632004',
    city: 'Vellore', state: 'Tamil Nadu', pincode: '632004',
    phone: '+91 416-228-1000', email: 'info@cmcvellore.ac.in',
    lat: 12.9249, lng: 79.1338,
    accreditation: 'NABH', password: 'cmc123',
    resources: {
      totalBeds: 2700, availableBeds: 380, totalIcuBeds: 180, availableIcuBeds: 38,
      totalVentilators: 100, availableVentilators: 32,
      oxygenCapacity: 45000, oxygenAvailable: 36000,
      bloodAPos: 100, bloodANeg: 30, bloodBPos: 85, bloodBNeg: 20,
      bloodABPos: 35, bloodABNeg: 12, bloodOPos: 120, bloodONeg: 25,
    },
    specialists: [
      { name: 'Dr. George Chandy', specialty: 'Nephrology', available: true },
      { name: 'Dr. Sunil Chandy', specialty: 'ENT', available: true },
      { name: 'Dr. Anna Pulimood', specialty: 'Gastroenterology', available: true },
      { name: 'Dr. V. Raju', specialty: 'Dermatology', available: false },
      { name: 'Dr. Prasanna Samuel', specialty: 'Ophthalmology', available: true },
    ],
    equipment: [
      { name: 'MRI Scanner', model: 'MRI-3T Pro', quantity: 3 },
      { name: 'CT Scanner', model: 'CT-64S Ultra', quantity: 4 },
      { name: 'ECG Machine', model: 'ECG-12L', quantity: 20 },
    ],
  },
  {
    id: 'h7',
    name: 'Manipal Hospital',
    address: '98, HAL Old Airport Rd, Bengaluru, Karnataka 560017',
    city: 'Bengaluru', state: 'Karnataka', pincode: '560017',
    phone: '+91 80-2502-4444', email: 'info@manipalhospitals.com',
    lat: 12.9588, lng: 77.6475,
    accreditation: 'NABH', password: 'manipal123',
    resources: {
      totalBeds: 600, availableBeds: 88, totalIcuBeds: 70, availableIcuBeds: 15,
      totalVentilators: 50, availableVentilators: 18,
      oxygenCapacity: 15000, oxygenAvailable: 11500,
      bloodAPos: 42, bloodANeg: 10, bloodBPos: 35, bloodBNeg: 8,
      bloodABPos: 14, bloodABNeg: 4, bloodOPos: 48, bloodONeg: 9,
    },
    specialists: [
      { name: 'Dr. H. Sudarshan Ballal', specialty: 'Nephrology', available: true },
      { name: 'Dr. Muralidhar Pai', specialty: 'Urology', available: true },
      { name: 'Dr. Vidya Rao', specialty: 'Psychiatry', available: true },
    ],
    equipment: [
      { name: 'MRI Scanner', model: 'MRI-3T Pro', quantity: 1 },
      { name: 'CT Scanner', model: 'CT-64S Ultra', quantity: 1 },
      { name: 'ECG Machine', model: 'ECG-12L', quantity: 6 },
    ],
  },
  {
    id: 'h8',
    name: 'Tata Memorial Hospital',
    address: 'Dr Ernest Borges Rd, Parel, Mumbai 400012',
    city: 'Mumbai', state: 'Maharashtra', pincode: '400012',
    phone: '+91 22-2417-7000', email: 'info@tmc.gov.in',
    lat: 19.0048, lng: 72.8432,
    accreditation: 'NABH', password: 'tata123',
    resources: {
      totalBeds: 800, availableBeds: 60, totalIcuBeds: 50, availableIcuBeds: 8,
      totalVentilators: 35, availableVentilators: 10,
      oxygenCapacity: 20000, oxygenAvailable: 16000,
      bloodAPos: 70, bloodANeg: 20, bloodBPos: 60, bloodBNeg: 15,
      bloodABPos: 25, bloodABNeg: 8, bloodOPos: 80, bloodONeg: 18,
    },
    specialists: [
      { name: 'Dr. R.A. Badwe', specialty: 'Oncology', available: true },
      { name: 'Dr. Shripad Banavali', specialty: 'Oncology', available: true },
      { name: 'Dr. Pankaj Chaturvedi', specialty: 'General Surgery', available: true },
    ],
    equipment: [
      { name: 'MRI Scanner', model: 'MRI-3T Pro', quantity: 2 },
      { name: 'CT Scanner', model: 'CT-64S Ultra', quantity: 3 },
      { name: 'ECG Machine', model: 'ECG-12L', quantity: 10 },
    ],
  },
];

// ─── System Users (Admins and System Doctors) ────────────────────────────────
const systemUsers = [
  {
    name: 'Main Admin',
    email: 'admin@medilink.com',
    password: 'admin123',
    role: 'ADMIN',
  },
  {
    name: 'Dr. Sarah Wilson',
    email: 'doctor1@medilink.com',
    password: 'doc123',
    role: 'DOCTOR',
  },
  {
    name: 'Dr. James Chen',
    email: 'doctor2@medilink.com',
    password: 'doc123',
    role: 'DOCTOR',
  },
];

// ─── Patient Requests for testing conflict resolution ────────────────────────
const patientRequests = [
  {
    hospitalId: 'h1',
    patientName: 'John Doe',
    patientPhone: '+91 98765 43210',
    type: 'Emergency Admission',
    condition: 'Acute chest pain, potentially MI',
    priority: 'HIGH',
    status: 'PENDING',
  },
  {
    hospitalId: 'h1',
    patientName: 'Jane Smith',
    patientPhone: '+91 98765 43211',
    type: 'Emergency Admission',
    condition: 'Severe abdominal trauma',
    priority: 'HIGH',
    status: 'PENDING',
  },
  {
    hospitalId: 'h2',
    patientName: 'Rahul Verma',
    patientPhone: '+91 99887 76655',
    type: 'Transfer',
    condition: 'Post-op recovery requiring ICU',
    priority: 'MEDIUM',
    status: 'RESOLVED',
  },
];

async function main() {
  console.log('🌱 Seeding MediLink database...\n');

  // Clear existing data (order matters due to foreign keys)
  await prisma.resourceUpdateHistory.deleteMany();
  await prisma.patientRequest.deleteMany();
  await prisma.systemUser.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.specialist.deleteMany();
  await prisma.hospitalResource.deleteMany();
  await prisma.hospital.deleteMany();
  console.log('✅ Cleared existing data');

  // Insert system users
  for (const user of systemUsers) {
    await prisma.systemUser.create({ data: user });
  }
  console.log('✅ Seeded system users (Admins & Doctors)');

  // Insert hospitals
  for (const h of hospitals) {
    const { resources, specialists, equipment, ...hospitalData } = h;

    await prisma.hospital.create({
      data: {
        ...hospitalData,
        resources: { create: resources },
        specialists: { create: specialists },
        equipment: { create: equipment },
      },
    });

    console.log(`  ✔ Seeded: ${h.name} (id: ${h.id})`);
  }

  // Insert patient requests
  for (const req of patientRequests) {
    await prisma.patientRequest.create({ data: req });
  }
  console.log('✅ Seeded patient requests');

  console.log(`\n✅ Seeded ${hospitals.length} hospitals successfully!`);
  
  console.log('\nLogin credentials:');
  console.log('  ADMIN: admin@medilink.com / admin123');
  console.log('  DOCTOR: doctor1@medilink.com / doc123');
  hospitals.slice(0, 3).forEach(h => console.log(`  ${h.name}: "${h.password}"`));
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
