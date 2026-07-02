import { Eye, ShieldCheck, Activity, Users, Scan, Droplet } from 'lucide-react';

export const services = [
  { title: 'Retina & Vitreous', icon: Activity, total: 7, avail: 7, image: '/images/retina.jpg', description: 'Advanced care for retinal diseases, macular degeneration, and diabetic retinopathy.', conditions: ['Diabetic Retinopathy', 'Macular Degeneration', 'Retinal Detachment', 'Macular Hole'] },
  { title: 'Cataract Services', icon: Droplet, total: 9, avail: 9, image: '/images/operation_theatre.png', description: 'State-of-the-art painless cataract surgery with premium intraocular lenses.', conditions: ['Age-related Cataracts', 'Congenital Cataracts', 'Secondary Cataracts', 'Traumatic Cataracts'] },
  { title: 'LASIK & Refractive', icon: Scan, total: 7, avail: 7, image: '/images/diagnostic_room.png', description: 'Laser vision correction for freedom from glasses and contact lenses.', conditions: ['Myopia (Nearsightedness)', 'Hyperopia (Farsightedness)', 'Astigmatism', 'Presbyopia'] },
  { title: 'Glaucoma Clinic', icon: Eye, total: 7, avail: 7, image: '/images/outpatient_dept.png', description: 'Early detection and advanced medical and surgical management of glaucoma.', conditions: ['Open-Angle Glaucoma', 'Angle-Closure Glaucoma', 'Normal-Tension Glaucoma', 'Secondary Glaucoma'] },
  { title: 'Cornea Services', icon: Eye, total: 7, avail: 7, image: '/images/cornea.png', description: 'Comprehensive treatment for corneal ulcers, keratoconus, and corneal transplantation.', conditions: ['Corneal Ulcers', 'Keratoconus', 'Fuchs Dystrophy', 'Corneal Abrasions'] },
  { title: 'Pediatric Ophthalmology', icon: Users, total: 6, avail: 6, image: '/images/pediatric.png', description: 'Specialized and gentle eye care for children, including squint and lazy eye treatments.', conditions: ['Strabismus (Squint)', 'Amblyopia (Lazy Eye)', 'Pediatric Cataracts', 'Refractive Errors in Children'] },
  { title: 'Neuro Ophthalmology', icon: Activity, total: 6, avail: 6, image: '/images/neuro.png', description: 'Expert evaluation of complex vision problems related to the nervous system and brain.', conditions: ['Optic Neuritis', 'Visual Field Defects', 'Double Vision (Diplopia)', 'Papilledema'] },
  { title: 'Oculoplasty', icon: Eye, total: 6, avail: 6, image: '/images/oculoplasty.png', description: 'Cosmetic and reconstructive surgery of the eyelids, tear ducts, and orbit.', conditions: ['Ptosis (Drooping Eyelids)', 'Orbital Fractures', 'Tear Duct Obstructions', 'Eyelid Tumors'] },
  { title: 'Eye Emergency', icon: ShieldCheck, total: 6, avail: 6, image: '/images/specialized_ward.png', description: '24/7 immediate trauma care for eye injuries, chemical burns, and sudden vision loss.', conditions: ['Chemical Eye Burns', 'Corneal Foreign Bodies', 'Traumatic Eye Injuries', 'Sudden Vision Loss'] },
];

const uniqueNames = [
  'Konangi Gopi', 'Michael Chen', 'Emily Carter', 'James Wilson', 'David Miller', 
  'Lisa Garcia', 'Robert Taylor', 'Jessica Brown', 'William Davis', 'Olivia Martinez',
  'Daniel Smith', 'Sophia Johnson', 'Matthew Williams', 'Emma Jones', 'Christopher Brown',
  'Ava Davis', 'Andrew Miller', 'Isabella Wilson', 'Joshua Moore', 'Mia Taylor',
  'Kevin Anderson', 'Charlotte Thomas', 'Brian Jackson', 'Amelia White', 'George Harris',
  'Harper Martin', 'Edward Thompson', 'Evelyn Garcia', 'Ronald Martinez', 'Abigail Robinson',
  'Timothy Clark', 'Emily Rodriguez', 'Jason Lewis', 'Elizabeth Lee', 'Jeffrey Walker',
  'Sofia Hall', 'Ryan Allen', 'Avery Young', 'Jacob Hernandez', 'Ella King',
  'Nicholas Wright', 'Scarlett Lopez', 'Eric Hill', 'Grace Scott', 'Stephen Green',
  'Chloe Adams', 'Larry Baker', 'Victoria Gonzalez', 'Justin Nelson', 'Riley Carter',
  'Scott Mitchell', 'Aria Perez', 'Brandon Roberts', 'Lily Turner', 'Benjamin Phillips',
  'Zoe Campbell', 'Samuel Parker', 'Hannah Evans', 'Gregory Edwards', 'Addison Collins',
  'Alexander Stewart', 'Eleanor Sanchez', 'Patrick Morris', 'Natalie Rogers', 'Frank Reed'
];

let globalIndex = 0;

export const allDoctors = services.flatMap(dept => {
  return Array.from({ length: dept.total }).map((_, i) => {
    const name = uniqueNames[globalIndex % uniqueNames.length];
    const emailName = name.split(' ')[0].toLowerCase();
    
    let email = `dr.${emailName}@visioncare.com`;
    let mobile = `+91 9${Math.floor(8000 + ((globalIndex * 13) % 1999))} ${Math.floor(10000 + ((globalIndex * 31) % 89999))}`;
    
    const gender = globalIndex % 2 === 0 ? 'men' : 'women';
    const picId = (globalIndex % 90) + 1;
    let photo = `https://randomuser.me/api/portraits/${gender}/${picId}.jpg`;

    if (name === 'Konangi Gopi') {
      email = 'gopikonangi8@gmail.com';
      mobile = '8955673890';
      photo = '/images/dr_gopi.png';
    }

    globalIndex++;
    return {
      id: `${dept.title.replace(/\s+/g, '-').toLowerCase()}-${i}`,
      name: `Dr. ${name}`,
      email: email,
      mobile: mobile,
      specialty: dept.title,
      photo: photo
    };
  });
});

export const getDoctorsForDept = (dept) => {
  if (!dept) return [];
  return allDoctors.filter(doc => doc.specialty === dept.title);
};

export const stats = [
  { label: 'Patients Treated', value: '25k+' },
  { label: 'Doctors', value: '61+' },
  { label: 'Successful Surgeries', value: '15k+' },
  { label: 'Years of Experience', value: '20+' },
];

export const DOCTOR_PAYROLL = allDoctors.map((doc, idx) => {
  const experience = 5 + (idx % 15);
  const basic = 120000 + (experience * 10000);
  const hra = basic * 0.2;
  const medical = basic * 0.05;
  const transport = 10000;
  const bonus = idx % 3 === 0 ? 15000 : 0;
  const pf = basic * 0.12;
  const tax = basic * 0.15;

  return {
    id: `EMP-DOC-${(idx + 1).toString().padStart(3, '0')}`,
    name: doc.name,
    category: 'Doctors',
    department: doc.specialty,
    specialty: doc.specialty,
    designation: experience > 12 ? 'Senior Consultant' : 'Consultant',
    experience,
    email: doc.email,
    mobile: doc.mobile,
    basic,
    hra,
    medical,
    transport,
    bonus,
    tax,
    pf,
    status: idx % 4 === 0 ? 'Processing' : 'Paid',
    date: idx % 4 === 0 ? '2026-06-28' : '2026-06-25',
    bank: `HDFC Bank - ${Math.floor(1000 + Math.random() * 9000)}`,
    pfNumber: `PF-MH-${Math.floor(10000 + Math.random() * 90000)}`,
    photo: doc.photo
  };
});

export const OTHER_PAYROLL = [
  // Nurses (25)
  { id: 'EMP-NUR-001', name: 'Anjali Sharma', category: 'Nurses', department: 'Eye Emergency Ward', designation: 'Emergency Ophthalmic Nurse', experience: 13, basic: 45000, hra: 12000, medical: 3000, transport: 4000, bonus: 5000, tax: 2000, pf: 3500, status: 'Paid', date: '2026-06-25', bank: 'SBI Bank - 1102', pfNumber: 'PF-MH-20112', photo: 'https://randomuser.me/api/portraits/women/65.jpg' },
  { id: 'EMP-NUR-002', name: 'Priya Desai', category: 'Nurses', department: 'Eye Emergency Ward', designation: 'Emergency Ophthalmic Nurse', experience: 14, basic: 46000, hra: 12500, medical: 3000, transport: 4000, bonus: 5500, tax: 2200, pf: 3600, status: 'Paid', date: '2026-06-25', bank: 'HDFC Bank - 3491', pfNumber: 'PF-MH-20113', photo: 'https://randomuser.me/api/portraits/women/22.jpg' },
  { id: 'EMP-NUR-003', name: 'Kavita Iyer', category: 'Nurses', department: 'Eye Emergency Ward', designation: 'Emergency Ophthalmic Nurse', experience: 6, basic: 34000, hra: 8500, medical: 2500, transport: 3500, bonus: 2000, tax: 1000, pf: 2800, status: 'Processing', date: '2026-06-28', bank: 'ICICI Bank - 4421', pfNumber: 'PF-MH-20114', photo: 'https://randomuser.me/api/portraits/women/27.jpg' },
  { id: 'EMP-NUR-004', name: 'Sneha Patel', category: 'Nurses', department: 'Eye Emergency Ward', designation: 'Emergency Ophthalmic Nurse', experience: 4, basic: 32000, hra: 8000, medical: 2000, transport: 3000, bonus: 0, tax: 0, pf: 2500, status: 'Pending', date: '-', bank: 'Axis Bank - 9921', pfNumber: 'PF-MH-20115', photo: 'https://randomuser.me/api/portraits/women/33.jpg' },
  { id: 'EMP-NUR-005', name: 'Riya Menon', category: 'Nurses', department: 'Eye Emergency Ward', designation: 'Emergency Ophthalmic Nurse', experience: 2, basic: 28000, hra: 7000, medical: 1500, transport: 2500, bonus: 0, tax: 0, pf: 2200, status: 'Paid', date: '2026-06-25', bank: 'SBI Bank - 8821', pfNumber: 'PF-MH-20116', photo: 'https://randomuser.me/api/portraits/women/12.jpg' },
  { id: 'EMP-NUR-006', name: 'Neha Verma', category: 'Nurses', department: 'Recovery & Observation', designation: 'Ward Nurse', experience: 11, basic: 42000, hra: 11000, medical: 3000, transport: 4000, bonus: 4000, tax: 1800, pf: 3200, status: 'Paid', date: '2026-06-25', bank: 'HDFC Bank - 5511', pfNumber: 'PF-MH-20117', photo: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 'EMP-NUR-007', name: 'Aisha Gupta', category: 'Nurses', department: 'Recovery & Observation', designation: 'Ward Nurse', experience: 2, basic: 28000, hra: 7000, medical: 1500, transport: 2500, bonus: 0, tax: 0, pf: 2200, status: 'Processing', date: '2026-06-28', bank: 'ICICI Bank - 1192', pfNumber: 'PF-MH-20118', photo: 'https://randomuser.me/api/portraits/women/45.jpg' },
  { id: 'EMP-NUR-008', name: 'Divya Singh', category: 'Nurses', department: 'Recovery & Observation', designation: 'Ward Nurse', experience: 13, basic: 45000, hra: 12000, medical: 3000, transport: 4000, bonus: 5000, tax: 2000, pf: 3500, status: 'Paid', date: '2026-06-25', bank: 'Axis Bank - 4423', pfNumber: 'PF-MH-20119', photo: 'https://randomuser.me/api/portraits/women/46.jpg' },
  { id: 'EMP-NUR-009', name: 'Geeta Reddy', category: 'Nurses', department: 'Recovery & Observation', designation: 'Ward Nurse', experience: 3, basic: 30000, hra: 7500, medical: 2000, transport: 3000, bonus: 1000, tax: 0, pf: 2400, status: 'Pending', date: '-', bank: 'SBI Bank - 6612', pfNumber: 'PF-MH-20120', photo: 'https://randomuser.me/api/portraits/women/47.jpg' },
  { id: 'EMP-NUR-010', name: 'Anita Joshi', category: 'Nurses', department: 'Recovery & Observation', designation: 'Ward Nurse', experience: 10, basic: 40000, hra: 10000, medical: 3000, transport: 4000, bonus: 3500, tax: 1500, pf: 3000, status: 'Paid', date: '2026-06-25', bank: 'HDFC Bank - 7721', pfNumber: 'PF-MH-20121', photo: 'https://randomuser.me/api/portraits/women/48.jpg' },
  { id: 'EMP-NUR-011', name: 'Sunita Chauhan', category: 'Nurses', department: 'Retina & Vitreous', designation: 'Senior Staff Nurse', experience: 14, basic: 47000, hra: 13000, medical: 3500, transport: 4500, bonus: 6000, tax: 2500, pf: 3800, status: 'Paid', date: '2026-06-25', bank: 'ICICI Bank - 8823', pfNumber: 'PF-MH-20122', photo: 'https://randomuser.me/api/portraits/women/49.jpg' },
  { id: 'EMP-NUR-012', name: 'Rekha Shah', category: 'Nurses', department: 'Retina & Vitreous', designation: 'Senior Staff Nurse', experience: 2, basic: 29000, hra: 7500, medical: 1500, transport: 2500, bonus: 0, tax: 0, pf: 2300, status: 'Processing', date: '2026-06-28', bank: 'Axis Bank - 9912', pfNumber: 'PF-MH-20123', photo: 'https://randomuser.me/api/portraits/women/50.jpg' },
  { id: 'EMP-NUR-013', name: 'Meena Nair', category: 'Nurses', department: 'Retina & Vitreous', designation: 'Senior Staff Nurse', experience: 14, basic: 47000, hra: 13000, medical: 3500, transport: 4500, bonus: 6000, tax: 2500, pf: 3800, status: 'Paid', date: '2026-06-25', bank: 'SBI Bank - 1134', pfNumber: 'PF-MH-20124', photo: 'https://randomuser.me/api/portraits/women/51.jpg' },
  { id: 'EMP-NUR-014', name: 'Seema Bhat', category: 'Nurses', department: 'Retina & Vitreous', designation: 'Senior Staff Nurse', experience: 2, basic: 29000, hra: 7500, medical: 1500, transport: 2500, bonus: 0, tax: 0, pf: 2300, status: 'Pending', date: '-', bank: 'HDFC Bank - 2245', pfNumber: 'PF-MH-20125', photo: 'https://randomuser.me/api/portraits/women/52.jpg' },
  { id: 'EMP-NUR-015', name: 'Kiran Das', category: 'Nurses', department: 'Retina & Vitreous', designation: 'Senior Staff Nurse', experience: 6, basic: 35000, hra: 9000, medical: 2500, transport: 3500, bonus: 2000, tax: 1000, pf: 2800, status: 'Paid', date: '2026-06-25', bank: 'ICICI Bank - 3356', pfNumber: 'PF-MH-20126', photo: 'https://randomuser.me/api/portraits/women/53.jpg' },
  { id: 'EMP-NUR-016', name: 'Suman Rao', category: 'Nurses', department: 'Cataract Services', designation: 'Staff Nurse', experience: 2, basic: 28000, hra: 7000, medical: 1500, transport: 2500, bonus: 0, tax: 0, pf: 2200, status: 'Paid', date: '2026-06-25', bank: 'Axis Bank - 4467', pfNumber: 'PF-MH-20127', photo: 'https://randomuser.me/api/portraits/women/54.jpg' },
  { id: 'EMP-NUR-017', name: 'Poonam Sen', category: 'Nurses', department: 'Cataract Services', designation: 'Staff Nurse', experience: 14, basic: 46000, hra: 12500, medical: 3000, transport: 4000, bonus: 5500, tax: 2200, pf: 3600, status: 'Processing', date: '2026-06-28', bank: 'SBI Bank - 5578', pfNumber: 'PF-MH-20128', photo: 'https://randomuser.me/api/portraits/women/56.jpg' },
  { id: 'EMP-NUR-018', name: 'Reena Kapoor', category: 'Nurses', department: 'Cataract Services', designation: 'Staff Nurse', experience: 11, basic: 42000, hra: 11000, medical: 3000, transport: 4000, bonus: 4000, tax: 1800, pf: 3200, status: 'Paid', date: '2026-06-25', bank: 'HDFC Bank - 6689', pfNumber: 'PF-MH-20129', photo: 'https://randomuser.me/api/portraits/women/57.jpg' },
  { id: 'EMP-NUR-019', name: 'Megha Bansal', category: 'Nurses', department: 'Cataract Services', designation: 'Staff Nurse', experience: 5, basic: 33000, hra: 8000, medical: 2000, transport: 3000, bonus: 1500, tax: 500, pf: 2600, status: 'Pending', date: '-', bank: 'ICICI Bank - 7790', pfNumber: 'PF-MH-20130', photo: 'https://randomuser.me/api/portraits/women/58.jpg' },
  { id: 'EMP-NUR-020', name: 'Shruti Agarwal', category: 'Nurses', department: 'Cataract Services', designation: 'Staff Nurse', experience: 13, basic: 45000, hra: 12000, medical: 3000, transport: 4000, bonus: 5000, tax: 2000, pf: 3500, status: 'Paid', date: '2026-06-25', bank: 'Axis Bank - 8801', pfNumber: 'PF-MH-20131', photo: 'https://randomuser.me/api/portraits/women/59.jpg' },
  { id: 'EMP-NUR-021', name: 'Swati Garg', category: 'Nurses', department: 'Eye Surgery Theatre (ICU)', designation: 'OT Nurse', experience: 7, basic: 38000, hra: 9500, medical: 2500, transport: 3500, bonus: 2500, tax: 1200, pf: 2900, status: 'Paid', date: '2026-06-25', bank: 'SBI Bank - 9912', pfNumber: 'PF-MH-20132', photo: 'https://randomuser.me/api/portraits/women/60.jpg' },
  { id: 'EMP-NUR-022', name: 'Preeti Jain', category: 'Nurses', department: 'Eye Surgery Theatre (ICU)', designation: 'OT Nurse', experience: 12, basic: 46000, hra: 12000, medical: 3000, transport: 4000, bonus: 5000, tax: 2000, pf: 3600, status: 'Processing', date: '2026-06-28', bank: 'HDFC Bank - 1023', pfNumber: 'PF-MH-20133', photo: 'https://randomuser.me/api/portraits/women/61.jpg' },
  { id: 'EMP-NUR-023', name: 'Jyoti Mishra', category: 'Nurses', department: 'Eye Surgery Theatre (ICU)', designation: 'OT Nurse', experience: 6, basic: 36000, hra: 9000, medical: 2500, transport: 3500, bonus: 2000, tax: 1000, pf: 2800, status: 'Paid', date: '2026-06-25', bank: 'ICICI Bank - 2134', pfNumber: 'PF-MH-20134', photo: 'https://randomuser.me/api/portraits/women/62.jpg' },
  { id: 'EMP-NUR-024', name: 'Shikha Pandey', category: 'Nurses', department: 'Eye Surgery Theatre (ICU)', designation: 'OT Nurse', experience: 16, basic: 52000, hra: 14000, medical: 3500, transport: 4500, bonus: 7000, tax: 3000, pf: 4000, status: 'Pending', date: '-', bank: 'Axis Bank - 3245', pfNumber: 'PF-MH-20135', photo: 'https://randomuser.me/api/portraits/women/63.jpg' },
  { id: 'EMP-NUR-025', name: 'Nidhi Tiwari', category: 'Nurses', department: 'Eye Surgery Theatre (ICU)', designation: 'OT Nurse', experience: 9, basic: 41000, hra: 10500, medical: 3000, transport: 4000, bonus: 3500, tax: 1600, pf: 3100, status: 'Paid', date: '2026-06-25', bank: 'SBI Bank - 4356', pfNumber: 'PF-MH-20136', photo: 'https://randomuser.me/api/portraits/women/64.jpg' },
  // Housekeeping (20 people, 1 for each room)
  { id: 'EMP-HSK-001', name: 'Rajesh Kumar', category: 'Housekeeping', department: 'Room ER-101', designation: 'Housekeeper', experience: 5, basic: 16000, hra: 3500, medical: 1000, transport: 1000, bonus: 0, tax: 0, pf: 1000, status: 'Paid', date: '2026-06-25', bank: 'Union Bank - 1101', pfNumber: 'PF-MH-70101', photo: 'https://randomuser.me/api/portraits/men/15.jpg' },
  { id: 'EMP-HSK-002', name: 'Suresh Prasad', category: 'Housekeeping', department: 'Room ER-102', designation: 'Housekeeper', experience: 3, basic: 15000, hra: 3000, medical: 1000, transport: 1000, bonus: 0, tax: 0, pf: 1000, status: 'Paid', date: '2026-06-25', bank: 'SBI Bank - 1102', pfNumber: 'PF-MH-70102', photo: 'https://randomuser.me/api/portraits/men/16.jpg' },
  { id: 'EMP-HSK-003', name: 'Anil Yadav', category: 'Housekeeping', department: 'Room ER-103', designation: 'Housekeeper', experience: 4, basic: 15500, hra: 3200, medical: 1000, transport: 1000, bonus: 500, tax: 0, pf: 1000, status: 'Pending', date: '-', bank: 'Axis Bank - 1103', pfNumber: 'PF-MH-70103', photo: 'https://randomuser.me/api/portraits/men/17.jpg' },
  { id: 'EMP-HSK-004', name: 'Manoj Tiwari', category: 'Housekeeping', department: 'Room ER-104', designation: 'Housekeeper', experience: 6, basic: 16500, hra: 3600, medical: 1000, transport: 1000, bonus: 0, tax: 0, pf: 1100, status: 'Paid', date: '2026-06-25', bank: 'HDFC Bank - 1104', pfNumber: 'PF-MH-70104', photo: 'https://randomuser.me/api/portraits/men/18.jpg' },
  { id: 'EMP-HSK-005', name: 'Prakash Ram', category: 'Housekeeping', department: 'Room ER-105', designation: 'Housekeeper', experience: 2, basic: 14500, hra: 2800, medical: 1000, transport: 1000, bonus: 0, tax: 0, pf: 800, status: 'Processing', date: '2026-06-29', bank: 'ICICI Bank - 1105', pfNumber: 'PF-MH-70105', photo: 'https://randomuser.me/api/portraits/men/19.jpg' },
  { id: 'EMP-HSK-006', name: 'Mahesh Dube', category: 'Housekeeping', department: 'Room REC-201', designation: 'Housekeeper', experience: 7, basic: 17000, hra: 3800, medical: 1200, transport: 1000, bonus: 0, tax: 0, pf: 1200, status: 'Paid', date: '2026-06-25', bank: 'Union Bank - 1106', pfNumber: 'PF-MH-70106', photo: 'https://randomuser.me/api/portraits/men/20.jpg' },
  { id: 'EMP-HSK-007', name: 'Dinesh Singh', category: 'Housekeeping', department: 'Room REC-202', designation: 'Housekeeper', experience: 1, basic: 14000, hra: 2500, medical: 1000, transport: 1000, bonus: 0, tax: 0, pf: 800, status: 'Processing', date: '2026-06-29', bank: 'SBI Bank - 1107', pfNumber: 'PF-MH-70107', photo: 'https://randomuser.me/api/portraits/men/21.jpg' },
  { id: 'EMP-HSK-008', name: 'Santosh Kumar', category: 'Housekeeping', department: 'Room REC-203', designation: 'Housekeeper', experience: 8, basic: 17500, hra: 4000, medical: 1200, transport: 1000, bonus: 1000, tax: 0, pf: 1300, status: 'Paid', date: '2026-06-25', bank: 'Axis Bank - 1108', pfNumber: 'PF-MH-70108', photo: 'https://randomuser.me/api/portraits/men/22.jpg' },
  { id: 'EMP-HSK-009', name: 'Vinod Paswan', category: 'Housekeeping', department: 'Room REC-204', designation: 'Housekeeper', experience: 3, basic: 15000, hra: 3000, medical: 1000, transport: 1000, bonus: 0, tax: 0, pf: 1000, status: 'Pending', date: '-', bank: 'HDFC Bank - 1109', pfNumber: 'PF-MH-70109', photo: 'https://randomuser.me/api/portraits/men/23.jpg' },
  { id: 'EMP-HSK-010', name: 'Sunil Das', category: 'Housekeeping', department: 'Room REC-205', designation: 'Housekeeper', experience: 5, basic: 16000, hra: 3500, medical: 1000, transport: 1000, bonus: 0, tax: 0, pf: 1000, status: 'Paid', date: '2026-06-25', bank: 'ICICI Bank - 1110', pfNumber: 'PF-MH-70110', photo: 'https://randomuser.me/api/portraits/men/24.jpg' },
  { id: 'EMP-HSK-011', name: 'Rakesh Maurya', category: 'Housekeeping', department: 'Room RET-301', designation: 'Housekeeper', experience: 6, basic: 16500, hra: 3600, medical: 1000, transport: 1000, bonus: 0, tax: 0, pf: 1100, status: 'Paid', date: '2026-06-25', bank: 'Union Bank - 1111', pfNumber: 'PF-MH-70111', photo: 'https://randomuser.me/api/portraits/men/25.jpg' },
  { id: 'EMP-HSK-012', name: 'Mukesh Sahani', category: 'Housekeeping', department: 'Room RET-302', designation: 'Housekeeper', experience: 2, basic: 14500, hra: 2800, medical: 1000, transport: 1000, bonus: 0, tax: 0, pf: 800, status: 'Processing', date: '2026-06-29', bank: 'SBI Bank - 1112', pfNumber: 'PF-MH-70112', photo: 'https://randomuser.me/api/portraits/men/26.jpg' },
  { id: 'EMP-HSK-013', name: 'Ram Khilawan', category: 'Housekeeping', department: 'Room RET-303', designation: 'Housekeeper', experience: 9, basic: 18000, hra: 4200, medical: 1500, transport: 1000, bonus: 1500, tax: 0, pf: 1400, status: 'Paid', date: '2026-06-25', bank: 'Axis Bank - 1113', pfNumber: 'PF-MH-70113', photo: 'https://randomuser.me/api/portraits/men/27.jpg' },
  { id: 'EMP-HSK-014', name: 'Sanjay Pandit', category: 'Housekeeping', department: 'Room RET-304', designation: 'Housekeeper', experience: 4, basic: 15500, hra: 3200, medical: 1000, transport: 1000, bonus: 0, tax: 0, pf: 1000, status: 'Pending', date: '-', bank: 'HDFC Bank - 1114', pfNumber: 'PF-MH-70114', photo: 'https://randomuser.me/api/portraits/men/28.jpg' },
  { id: 'EMP-HSK-015', name: 'Ashok Meena', category: 'Housekeeping', department: 'Room RET-305', designation: 'Housekeeper', experience: 7, basic: 17000, hra: 3800, medical: 1200, transport: 1000, bonus: 0, tax: 0, pf: 1200, status: 'Paid', date: '2026-06-25', bank: 'ICICI Bank - 1115', pfNumber: 'PF-MH-70115', photo: 'https://randomuser.me/api/portraits/men/29.jpg' },
  { id: 'EMP-HSK-016', name: 'Vijay Chauhan', category: 'Housekeeping', department: 'Room CAT-401', designation: 'Housekeeper', experience: 3, basic: 15000, hra: 3000, medical: 1000, transport: 1000, bonus: 0, tax: 0, pf: 1000, status: 'Paid', date: '2026-06-25', bank: 'Union Bank - 1116', pfNumber: 'PF-MH-70116', photo: 'https://randomuser.me/api/portraits/men/30.jpg' },
  { id: 'EMP-HSK-017', name: 'Laxman Sahu', category: 'Housekeeping', department: 'Room CAT-402', designation: 'Housekeeper', experience: 5, basic: 16000, hra: 3500, medical: 1000, transport: 1000, bonus: 0, tax: 0, pf: 1000, status: 'Processing', date: '2026-06-29', bank: 'SBI Bank - 1117', pfNumber: 'PF-MH-70117', photo: 'https://randomuser.me/api/portraits/men/31.jpg' },
  { id: 'EMP-HSK-018', name: 'Mohan Rathore', category: 'Housekeeping', department: 'Room CAT-403', designation: 'Housekeeper', experience: 8, basic: 17500, hra: 4000, medical: 1200, transport: 1000, bonus: 1000, tax: 0, pf: 1300, status: 'Paid', date: '2026-06-25', bank: 'Axis Bank - 1118', pfNumber: 'PF-MH-70118', photo: 'https://randomuser.me/api/portraits/men/34.jpg' },
  { id: 'EMP-HSK-019', name: 'Raju Sharma', category: 'Housekeeping', department: 'Room CAT-404', designation: 'Housekeeper', experience: 2, basic: 14500, hra: 2800, medical: 1000, transport: 1000, bonus: 0, tax: 0, pf: 800, status: 'Pending', date: '-', bank: 'HDFC Bank - 1119', pfNumber: 'PF-MH-70119', photo: 'https://randomuser.me/api/portraits/men/35.jpg' },
  { id: 'EMP-HSK-020', name: 'Gopal Verma', category: 'Housekeeping', department: 'Room CAT-405', designation: 'Housekeeper', experience: 6, basic: 16500, hra: 3600, medical: 1000, transport: 1000, bonus: 0, tax: 0, pf: 1100, status: 'Paid', date: '2026-06-25', bank: 'ICICI Bank - 1120', pfNumber: 'PF-MH-70120', photo: 'https://randomuser.me/api/portraits/men/36.jpg' },
];

export const PAYROLL_DATA = [...DOCTOR_PAYROLL, ...OTHER_PAYROLL];
