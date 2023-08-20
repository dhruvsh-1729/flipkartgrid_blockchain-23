import React from "react";
import { Routes, Route } from 'react-router-dom';

//components
import Navbar from "./components/Navbar";
// pages
import Patients from "./pages/Patients";
import RegistrationForm from "./pages/Register";
import Login from './pages/Login';
import DoctorLogin from "./pages/DoctorLogin";
import DoctorView from "./pages/DoctorView";
import DoctorRegister from "./pages/DoctorRegister";
import Sidebar from "./components/Sidebar";
import DoctorSidebar from "./components/DoctorSidebar";
import { useSessionStorage } from "./utils/useSessionStorage";

const App: React.FC = () => {
  const [login, setLogin] = useSessionStorage("login", "");
  const [token, setToken] = useSessionStorage("token", "");
  const [user, setUser] = useSessionStorage(
    "user",
    JSON.stringify({})
  );

  return (
    <div className="h-100">
      <Navbar />
      <Routes>
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/doctor_login" element={<DoctorLogin />} />
        <Route path="/doctor_view" element={(login==="true" && token.length)?<DoctorView/> :""} />
        <Route path="/doctor_register" element={<DoctorRegister />} />
      </Routes>
    </div>
  );

};

export default App;