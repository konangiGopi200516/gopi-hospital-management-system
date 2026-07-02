import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import PublicDepartments from './pages/PublicDepartments';
import PublicDoctors from './pages/PublicDoctors';
import BookAppointment from './pages/BookAppointment';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import Login from './pages/Login';
import PatientPortal from './pages/PatientPortal';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Receptionist from './pages/Receptionist';
import Wards from './pages/Wards';
import Doctors from './pages/Doctors';
import Nurses from './pages/Nurses';
import Laboratory from './pages/Laboratory';
import Pharmacy from './pages/Pharmacy';
import Payroll from './pages/Payroll';
import Housekeeping from './pages/Housekeeping';
import AdminAppointments from './pages/AdminAppointments';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Attendance from './pages/Attendance';
import AddFace from './pages/AddFace';
import FaceAttendance from './pages/FaceAttendance';
// Removed seedDatabaseIfEmpty import to prevent frontend duplicates

// Placeholder Component for unbuilt modules
const PlaceholderPage = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center h-[70vh] text-center animate-in fade-in zoom-in duration-500">
    <div className="w-20 h-20 bg-[#141D31] border border-white/5 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(24,224,255,0.05)]">
      <div className="w-10 h-10 bg-[#18E0FF]/20 rounded-full animate-ping"></div>
    </div>
    <h2 className="text-2xl font-bold text-[#F8FAFC] mb-3">{title}</h2>
    <p className="text-[#94A3B8] max-w-md text-sm">{description}</p>
  </div>
);

function App() {

  return (
    <Router>
      <Routes>
        {/* Public Routes with shared Navbar/Footer */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/departments" element={<PublicDepartments />} />
          <Route path="/departments/:slug" element={<PlaceholderPage title="Department Detail" description="Department info, doctors in that department, and available slots." />} />
          <Route path="/doctors" element={<PublicDoctors />} />
          <Route path="/doctors/:id" element={<PlaceholderPage title="Doctor Profile" description="Bio, contact, schedule, and book-appointment CTA." />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/appointments/book" element={<BookAppointment />} />
          <Route path="/receptionist" element={<Receptionist />} />
          <Route path="/patient-portal" element={<PatientPortal />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<Login />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<Layout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="patients" element={<Patients />} />
          <Route path="wards" element={<Wards />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="nurses" element={<Nurses />} />
          <Route path="housekeeping" element={<Housekeeping />} />
          <Route path="laboratory" element={<Laboratory />} />
          <Route path="pharmacy" element={<Pharmacy />} />
          <Route path="payroll" element={<Payroll />} />
          <Route path="reports" element={<Reports />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="add-face" element={<AddFace />} />
          <Route path="face-attendance" element={<FaceAttendance />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<PlaceholderPage title="Module Not Found" description="This administrative module has not been built yet." />} />
        </Route>

        <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
      <ToastContainer 
        position="top-right" 
        autoClose={4000} 
        toastClassName="!rounded-2xl !shadow-[0_10px_40px_rgba(0,0,0,0.1)] !font-sans !border !border-slate-100"
      />
    </Router>
  );
}

export default App;
