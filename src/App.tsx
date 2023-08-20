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

const App: React.FC = () => {

  return (
    <div className="h-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<RegistrationForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/DoctorLogin" element={<DoctorLogin />} />
        <Route path="/DoctorView" element={<DoctorView/> } />
      </Routes>
    </div>
  );

};

export default App;