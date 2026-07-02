const HOSPITAL_STRUCTURE_DEF = [
  { floor: 'Ground Floor', dept: 'Eye Emergency Ward', prefix: 'ER', floorNum: 1, nurseType: 'Emergency Ophthalmic Nurse' },
  { floor: 'First Floor', dept: 'Recovery & Observation', prefix: 'REC', floorNum: 2, nurseType: 'Ward Nurse' },
  { floor: 'Second Floor', dept: 'Retina & Vitreous', prefix: 'RET', floorNum: 3, nurseType: 'Senior Staff Nurse' },
  { floor: 'Third Floor', dept: 'Cataract Services', prefix: 'CAT', floorNum: 4, nurseType: 'Staff Nurse' },
  { floor: 'Fourth Floor', dept: 'Eye Surgery Theatre (ICU)', prefix: 'OT', floorNum: 5, nurseType: 'OT Nurse' }
];

const FEMALE_NAMES = [
  'Anjali Sharma', 'Priya Desai', 'Kavita Iyer', 'Sneha Patel', 'Riya Menon',
  'Neha Verma', 'Aisha Gupta', 'Divya Singh', 'Geeta Reddy', 'Anita Joshi',
  'Sunita Chauhan', 'Rekha Shah', 'Meena Nair', 'Seema Bhat', 'Kiran Das',
  'Suman Rao', 'Poonam Sen', 'Reena Kapoor', 'Megha Bansal', 'Shruti Agarwal',
  'Swati Garg', 'Preeti Jain', 'Jyoti Mishra', 'Shikha Pandey', 'Nidhi Tiwari'
];

const generateNursesAndWards = () => {
  const wards = [];
  const nurses = [];
  let nurseCounter = 1;
  let bedIdCounter = 1;

  HOSPITAL_STRUCTURE_DEF.forEach((level, floorIndex) => {
    const rooms = Array.from({ length: 5 }, (_, roomIndex) => {
      const roomNumber = `${level.prefix}-${level.floorNum}0${roomIndex + 1}`;
      
      // Generate unique nurse for this room
      const name = FEMALE_NAMES[nurseCounter - 1];
      const firstName = name.split(' ')[0].toLowerCase();
      const lastName = name.split(' ')[1].toLowerCase();
      const exp = Math.floor(Math.random() * 15) + 2; // 2-16 years
      
      const statuses = ['Available', 'With Patient', 'Assisting Procedure', 'Medication Round', 'Break', 'Emergency Response'];
      
      const nurse = {
        id: `NUR${String(nurseCounter).padStart(3, '0')}`,
        name: name,
        gender: 'Female',
        age: 22 + exp,
        email: `${firstName}.${lastName}@visioncare.com`,
        mobile: `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
        registrationNumber: `NUR-REG-2026-${String(nurseCounter).padStart(4, '0')}`,
        qualification: exp > 10 ? 'M.Sc Nursing' : (exp > 5 ? 'B.Sc Nursing' : 'GNM'),
        experience: exp,
        designation: level.nurseType,
        workingHours: '08:00 AM - 08:00 PM',
        floor: level.floor,
        room: roomNumber,
        department: level.dept,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        languages: 'English, Hindi',
        joiningDate: `20${24 - Math.floor(exp / 2)}-0${Math.floor(Math.random() * 9) + 1}-15`,
        bloodGroup: ['O+', 'A+', 'B+', 'AB+'][Math.floor(Math.random() * 4)],
        emergencyContact: `+91 ${Math.floor(6000000000 + Math.random() * 3999999999)}`,
        photo: `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 90) + 1}.jpg`
      };

      nurses.push(nurse);
      nurseCounter++;

      const beds = Array.from({ length: 10 }, (_, bedIndex) => ({
        id: `B${String(bedIdCounter++).padStart(3, '0')}`,
        room: roomNumber,
        floorIndex,
        roomIndex,
        bedIndex,
        state: 'available', 
        patient: null
      }));

      return { 
        id: roomNumber, 
        beds,
        assignedNurse: nurse, // Reference to the exact nurse object
        assignedDoctor: `Dr. ${['Ravi Patel', 'Sanjay Gupta', 'Neha Verma', 'Vikram Singh', 'Amit Shah'][floorIndex]}`
      };
    });
    wards.push({ ...level, rooms });
  });

  return { wards, nurses };
};

export const HOSPITAL_DATA = generateNursesAndWards();
