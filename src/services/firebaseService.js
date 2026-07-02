import { ref, get, set, push, update, remove, child } from 'firebase/database';
import { db } from '../config/firebase';
import { DOCTOR_PAYROLL, OTHER_PAYROLL } from '../data/mockData';

// Paths
const DOCTORS_PATH = 'doctors';
const NURSES_PATH = 'nurses';
const HOUSEKEEPING_PATH = 'housekeeping';
const APPOINTMENTS_PATH = 'appointments';
const SETTINGS_PATH = 'settings';
const PATIENTS_PATH = 'patients';
const ENROLLED_FACES_PATH = 'enrolled_faces';
const FACE_ATTENDANCE_LOG_PATH = 'face_attendance_log';

// --- Staff Management ---
const getPathByCategory = (category) => {
  if (category === 'Doctors') return DOCTORS_PATH;
  if (category === 'Nurses') return NURSES_PATH;
  if (category === 'Housekeeping') return HOUSEKEEPING_PATH;
  return DOCTORS_PATH;
};

export const getStaff = async () => {
  const [docSnap, nurseSnap, houseSnap] = await Promise.all([
    get(ref(db, DOCTORS_PATH)),
    get(ref(db, NURSES_PATH)),
    get(ref(db, HOUSEKEEPING_PATH))
  ]);
  
  let allStaff = [];
  
  if (docSnap.exists()) {
    const data = docSnap.val();
    allStaff = [...allStaff, ...Object.keys(data).map(key => ({ firebaseId: key, ...data[key] }))];
  }
  if (nurseSnap.exists()) {
    const data = nurseSnap.val();
    allStaff = [...allStaff, ...Object.keys(data).map(key => ({ firebaseId: key, ...data[key] }))];
  }
  if (houseSnap.exists()) {
    const data = houseSnap.val();
    allStaff = [...allStaff, ...Object.keys(data).map(key => ({ firebaseId: key, ...data[key] }))];
  }
  
  return allStaff;
};

export const addStaff = async (staffData) => {
  const path = getPathByCategory(staffData.category);
  const newStaffRef = push(ref(db, path));
  await set(newStaffRef, staffData);
  return { firebaseId: newStaffRef.key, ...staffData };
};

export const updateStaff = async (firebaseId, updateData) => {
  const path = getPathByCategory(updateData.category);
  const staffRef = ref(db, `${path}/${firebaseId}`);
  await update(staffRef, updateData);
  return { firebaseId, ...updateData };
};

export const deleteStaff = async (firebaseId, category) => {
  const path = getPathByCategory(category);
  const staffRef = ref(db, `${path}/${firebaseId}`);
  await remove(staffRef);
};

// --- Settings Management ---
export const getSettings = async () => {
  const settingsRef = ref(db, SETTINGS_PATH);
  const snapshot = await get(settingsRef);
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
};

export const updateSettings = async (settingsData) => {
  const settingsRef = ref(db, SETTINGS_PATH);
  await update(settingsRef, settingsData);
  return settingsData;
};

// --- Appointments Management ---
export const getAppointments = async () => {
  const apptRef = ref(db, APPOINTMENTS_PATH);
  const snapshot = await get(apptRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data).map(key => ({ firebaseId: key, ...data[key] }));
  }
  return [];
};

export const addAppointment = async (appointmentData) => {
  const newApptRef = push(ref(db, APPOINTMENTS_PATH));
  await set(newApptRef, appointmentData);
  return { firebaseId: newApptRef.key, ...appointmentData };
};

export const updateAppointmentStatus = async (firebaseId, status) => {
  const apptRef = ref(db, `${APPOINTMENTS_PATH}/${firebaseId}`);
  await update(apptRef, { status });
};

// --- Patients Management ---
export const getPatients = async () => {
  const patientRef = ref(db, PATIENTS_PATH);
  const snapshot = await get(patientRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data).map(key => ({ firebaseId: key, ...data[key] }));
  }
  return [];
};

export const addPatient = async (patientData) => {
  const newPatientRef = push(ref(db, PATIENTS_PATH));
  await set(newPatientRef, patientData);
  return { firebaseId: newPatientRef.key, ...patientData };
};

export const deletePatientFirebase = async (firebaseId) => {
  const patientRef = ref(db, `${PATIENTS_PATH}/${firebaseId}`);
  await remove(patientRef);
};

// --- Face Enrollment & Attendance ---
export const getEnrolledFaces = async () => {
  const facesRef = ref(db, ENROLLED_FACES_PATH);
  const snapshot = await get(facesRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data).map(key => ({ firebaseId: key, ...data[key] }));
  }
  return [];
};

export const addEnrolledFace = async (faceData) => {
  const newFaceRef = push(ref(db, ENROLLED_FACES_PATH));
  await set(newFaceRef, faceData);
  return { firebaseId: newFaceRef.key, ...faceData };
};

export const getFaceAttendanceLog = async () => {
  const logRef = ref(db, FACE_ATTENDANCE_LOG_PATH);
  const snapshot = await get(logRef);
  if (snapshot.exists()) {
    const data = snapshot.val();
    return Object.keys(data).map(key => ({ firebaseId: key, ...data[key] }));
  }
  return [];
};

export const addFaceAttendanceLog = async (logData) => {
  const newLogRef = push(ref(db, FACE_ATTENDANCE_LOG_PATH));
  await set(newLogRef, logData);
  return { firebaseId: newLogRef.key, ...logData };
};

// --- Seed Database ---
export const seedDatabaseIfEmpty = async () => {
  try {
    const docRef = ref(db, DOCTORS_PATH);
    const snapshot = await get(docRef);
    
    if (!snapshot.exists()) {
      console.log('Seeding Realtime Database with separate nodes for Doctors, Nurses, and Housekeeping...');
      
      for (const staff of DOCTOR_PAYROLL) {
        await push(ref(db, DOCTORS_PATH), staff);
      }
      
      for (const staff of OTHER_PAYROLL) {
        let additionalData = {};
        if (staff.category === 'Nurses' || staff.category === 'Housekeeping') {
          additionalData = {
            attendance: 'Present',
            mobile: '+91 ' + Math.floor(6000000000 + Math.random() * 3999999999),
            email: staff.name.toLowerCase().replace(' ', '.') + '@visioncare.com',
            workingHours: '08:00 AM - 08:00 PM',
            shift: 'Morning'
          };
        }
        
        if (staff.category === 'Nurses') {
          await push(ref(db, NURSES_PATH), { ...staff, ...additionalData });
        } else if (staff.category === 'Housekeeping') {
          await push(ref(db, HOUSEKEEPING_PATH), { ...staff, ...additionalData });
        }
      }
      console.log('Database seeded successfully into separate nodes!');
    }

    // Migrate Appointments from LocalStorage if they exist and Firebase is empty
    const apptRef = ref(db, APPOINTMENTS_PATH);
    const apptSnapshot = await get(apptRef);
    if (!apptSnapshot.exists()) {
      const storedAppts = JSON.parse(localStorage.getItem('visionCare_pendingRequests') || '[]');
      if (storedAppts.length > 0) {
        console.log('Migrating appointments from LocalStorage to Firebase...');
        for (const appt of storedAppts) {
          await push(apptRef, appt);
        }
        console.log('Appointments migrated successfully!');
      } else {
        // Create a dummy appointment so the node appears in Firebase
        await push(apptRef, {
          patient: "John Doe",
          phone: "+91 9876543210",
          email: "john@example.com",
          dept: "Retina & Vitreous",
          docId: "doc_1",
          doc: "Dr. Konangi Gopi",
          date: new Date().toISOString().split('T')[0],
          time: "10:00 AM",
          status: "pending",
          createdAt: new Date().toISOString()
        });
        console.log('Dummy appointment created successfully!');
      }
    }

    // Migrate Patients from LocalStorage if they exist and Firebase is empty
    const patientRef = ref(db, PATIENTS_PATH);
    const patientSnapshot = await get(patientRef);
    if (!patientSnapshot.exists()) {
      const storedPatients = JSON.parse(localStorage.getItem('visionCare_patients') || '[]');
      if (storedPatients.length > 0) {
        console.log('Migrating patients from LocalStorage to Firebase...');
        for (const patient of storedPatients) {
          await push(patientRef, patient);
        }
        console.log('Patients migrated successfully!');
      }
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// --- Reset Database (One-time use) ---
export const resetDatabase = async () => {
  try {
    console.log('Wiping existing staff databases...');
    await set(ref(db, DOCTORS_PATH), null);
    await set(ref(db, NURSES_PATH), null);
    await set(ref(db, HOUSEKEEPING_PATH), null);
    await set(ref(db, 'cleaning'), null); // Remove old node
    await set(ref(db, 'staff'), null); // Remove old node
    
    console.log('Databases wiped. Reseeding purely from mock data...');
    
    for (const staff of DOCTOR_PAYROLL) {
      await push(ref(db, DOCTORS_PATH), staff);
    }
    
    for (const staff of OTHER_PAYROLL) {
      let additionalData = {};
      if (staff.category === 'Nurses' || staff.category === 'Housekeeping') {
        additionalData = {
          attendance: 'Present',
          mobile: '+91 ' + Math.floor(6000000000 + Math.random() * 3999999999),
          email: staff.name.toLowerCase().replace(' ', '.') + '@visioncare.com',
          workingHours: '08:00 AM - 08:00 PM',
          shift: 'Morning'
        };
      }
      
      if (staff.category === 'Nurses') {
        await push(ref(db, NURSES_PATH), { ...staff, ...additionalData });
      } else if (staff.category === 'Housekeeping') {
        await push(ref(db, HOUSEKEEPING_PATH), { ...staff, ...additionalData });
      }
    }
    console.log('Database reset and seeded cleanly with no duplicates!');
  } catch (error) {
    console.error('Error resetting database:', error);
  }
};
