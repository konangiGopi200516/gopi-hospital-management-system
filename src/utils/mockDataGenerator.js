// Realistic Indian Names for Mock Data
const MALE_NAMES = [
  'Rahul', 'Vikram', 'Arjun', 'Rohan', 'Karan', 'Siddharth', 'Aditya', 'Sameer', 'Ravi', 'Suresh',
  'Amit', 'Rajesh', 'Sanjay', 'Manoj', 'Deepak', 'Anil', 'Sunil', 'Vijay', 'Ajay', 'Prakash',
  'Nitin', 'Naveen', 'Tarun', 'Varun', 'Vishal', 'Manish', 'Ashish', 'Gaurav', 'Saurabh', 'Rakesh',
  'Mohit', 'Rohit', 'Abhishek', 'Prashant', 'Sumit', 'Harish', 'Girish', 'Kamal', 'Ashok', 'Kishore',
  'Vinay', 'Pramod', 'Dinesh', 'Mukesh', 'Mahesh', 'Naresh', 'Ramesh', 'Sanjeev', 'Rajeev', 'Vikas'
];

const FEMALE_NAMES = [
  'Anjali', 'Priya', 'Neha', 'Sneha', 'Pooja', 'Kavita', 'Riya', 'Aisha', 'Divya', 'Geeta',
  'Anita', 'Sunita', 'Rekha', 'Meena', 'Seema', 'Kiran', 'Suman', 'Poonam', 'Reena', 'Megha',
  'Shruti', 'Swati', 'Preeti', 'Jyoti', 'Shikha', 'Neha', 'Nidhi', 'Ritu', 'Arti', 'Aarti',
  'Vandana', 'Bhavna', 'Rachna', 'Shweta', 'Garima', 'Smriti', 'Pallavi', 'Sonali', 'Rupali', 'Monika',
  'Shalini', 'Kirti', 'Aditi', 'Akanksha', 'Ananya', 'Aarohi', 'Ishita', 'Tanya', 'Tanvi', 'Vidhya'
];

const LAST_NAMES = [
  'Sharma', 'Gupta', 'Patel', 'Singh', 'Desai', 'Verma', 'Kumar', 'Joshi', 'Chauhan', 'Shah',
  'Reddy', 'Mehta', 'Iyer', 'Bhat', 'Nair', 'Menon', 'Rao', 'Das', 'Sen', 'Kapoor',
  'Bansal', 'Agarwal', 'Garg', 'Jain', 'Mishra', 'Pandey', 'Tiwari', 'Dubey', 'Yadav', 'Yadav',
  'Choudhary', 'Chowdhury', 'Mukherjee', 'Banerjee', 'Chatterjee', 'Bose', 'Mitra', 'Dutta', 'Ghosh', 'Roy',
  'Sengupta', 'Pillai', 'Kurian', 'Varghese', 'Mathew', 'Thomas', 'Joseph', 'George', 'Fernandes', "D'Souza"
];

const DEPARTMENTS = [
  { name: 'Cardiology', specs: ['Interventional Cardiologist', 'Electrophysiologist', 'Heart Failure Specialist'] },
  { name: 'Neurology', specs: ['Stroke Specialist', 'Epileptologist', 'Neuroimmunologist'] },
  { name: 'Orthopedics', specs: ['Joint Replacement Surgeon', 'Spine Surgeon', 'Sports Medicine Specialist'] },
  { name: 'Pediatrics', specs: ['Neonatologist', 'Pediatric Pulmonologist', 'Pediatric Cardiologist'] },
  { name: 'General Medicine', specs: ['Internal Medicine Specialist', 'Preventive Medicine', 'Geriatrician'] },
  { name: 'Emergency Medicine', specs: ['Trauma Specialist', 'Critical Care ER', 'Triage Specialist'] },
  { name: 'General Surgery', specs: ['Laparoscopic Surgeon', 'Bariatric Surgeon', 'Trauma Surgeon'] },
  { name: 'Ophthalmology', specs: ['Retina Specialist', 'Cornea Specialist', 'Glaucoma Specialist'] },
  { name: 'Gynecology', specs: ['Obstetrician', 'Reproductive Endocrinologist', 'Gynecologic Oncologist'] }
];

const generatedNames = new Set();
const generatedEmails = new Set();
const generatedPhones = new Set();

const generateUniqueName = (gender) => {
  let name = '';
  let attempts = 0;
  while (attempts < 1000) {
    const first = gender === 'M' ? MALE_NAMES[Math.floor(Math.random() * MALE_NAMES.length)] : FEMALE_NAMES[Math.floor(Math.random() * FEMALE_NAMES.length)];
    const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    name = `${first} ${last}`;
    if (!generatedNames.has(name)) {
      generatedNames.add(name);
      return { full: name, first, last };
    }
    attempts++;
  }
  return { full: `User ${Date.now()}`, first: 'User', last: 'Gen' };
};

const generateUniqueEmail = (first, last) => {
  let email = '';
  let attempts = 0;
  while (attempts < 1000) {
    const suffix = attempts === 0 ? '' : attempts;
    email = `${first.toLowerCase()}.${last.toLowerCase()}${suffix}@visioncare.com`;
    if (!generatedEmails.has(email)) {
      generatedEmails.add(email);
      return email;
    }
    attempts++;
  }
  return `user${Date.now()}@visioncare.com`;
};

const generateUniquePhone = () => {
  let phone = '';
  let attempts = 0;
  while (attempts < 1000) {
    phone = `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`;
    if (!generatedPhones.has(phone)) {
      generatedPhones.add(phone);
      return phone;
    }
    attempts++;
  }
  return `+91 ${Date.now()}`.slice(0, 14);
};

export const generateHospitalStaff = () => {
  const staff = {
    doctors: [],
    nurses: [],
    receptionists: [],
    technicians: []
  };

  let docId = 1;
  let nurId = 1;

  // Generate 80 Doctors
  DEPARTMENTS.forEach((dept) => {
    const numDoctors = Math.floor(Math.random() * 4) + 6; // 6 to 9 doctors per dept
    for (let i = 0; i < numDoctors; i++) {
      const gender = Math.random() > 0.5 ? 'M' : 'F';
      const nameObj = generateUniqueName(gender);
      const exp = Math.floor(Math.random() * 25) + 3; // 3 to 27 years
      const randStatus = Math.random();
      let status = 'Available';
      if (randStatus > 0.85) status = 'On Leave';
      else if (randStatus > 0.7) status = 'Emergency';
      else if (randStatus > 0.4) status = 'In Consultation';

      const picId = Math.floor(Math.random() * 90) + 1;
      const avatarGender = gender === 'M' ? 'men' : 'women';

      staff.doctors.push({
        id: `DOC${String(docId).padStart(3, '0')}`,
        name: `Dr. ${nameObj.full}`,
        gender,
        department: dept.name,
        specialization: dept.specs[Math.floor(Math.random() * dept.specs.length)],
        category: exp > 15 ? 'heads' : (exp > 10 ? 'consultants' : (exp > 5 ? 'specialists' : 'residents')),
        qualification: exp > 15 ? 'MBBS, MD, DM' : 'MBBS, MD',
        registrationNumber: `DOC-REG-2026-${String(docId).padStart(4, '0')}`,
        experience: exp,
        phone: generateUniquePhone(),
        email: generateUniqueEmail(nameObj.first, nameObj.last),
        room: `${dept.name.substring(0, 2).toUpperCase()}-${Math.floor(100 + Math.random() * 400)}`,
        floor: `Floor ${Math.floor(1 + Math.random() * 5)}`,
        workingDays: 'Mon - Sat',
        workingHours: exp % 2 === 0 ? '08:00 AM - 04:00 PM' : '10:00 AM - 06:00 PM',
        shift: exp % 2 === 0 ? 'Morning' : 'Evening',
        languages: gender === 'M' ? 'English, Hindi, Gujarati' : 'English, Hindi, Marathi',
        fee: `₹${(Math.floor(Math.random() * 15) + 5) * 100}`,
        status,
        rating: (4 + Math.random()).toFixed(1),
        patientsQueue: Math.floor(Math.random() * 15),
        appointmentsToday: Math.floor(Math.random() * 25),
        photo: `https://randomuser.me/api/portraits/${avatarGender}/${picId}.jpg`,
        bio: `Dr. ${nameObj.last} is a highly regarded specialist with ${exp} years of clinical excellence.`
      });
      docId++;
    }
  });

  // Generate 150 Nurses
  const nurseWards = ['ICU', 'Emergency', 'General Ward', 'Pediatrics', 'Cardiology', 'Operation Theatre', 'NICU'];
  for (let i = 0; i < 150; i++) {
    const gender = Math.random() > 0.1 ? 'F' : 'M'; // 90% female nurses
    const nameObj = generateUniqueName(gender);
    const exp = Math.floor(Math.random() * 20) + 1;
    const ward = nurseWards[Math.floor(Math.random() * nurseWards.length)];
    const picId = Math.floor(Math.random() * 90) + 1;
    const avatarGender = gender === 'M' ? 'men' : 'women';

    staff.nurses.push({
      id: `NUR${String(nurId).padStart(3, '0')}`,
      name: `Nurse ${nameObj.full}`,
      gender,
      department: 'Nursing',
      specialization: `${ward} Nurse`,
      qualification: exp > 10 ? 'M.Sc Nursing' : 'B.Sc Nursing',
      registrationNumber: `NUR-REG-2026-${String(nurId).padStart(4, '0')}`,
      experience: exp,
      phone: generateUniquePhone(),
      email: generateUniqueEmail(nameObj.first, nameObj.last),
      assignedWard: ward,
      shift: ['Morning', 'Evening', 'Night'][Math.floor(Math.random() * 3)],
      status: Math.random() > 0.8 ? 'On Leave' : 'Available',
      photo: `https://randomuser.me/api/portraits/${avatarGender}/${picId}.jpg`
    });
    nurId++;
  }

  return staff;
};

// Singleton instance to be used across the app
export const HOSPITAL_STAFF = generateHospitalStaff();
