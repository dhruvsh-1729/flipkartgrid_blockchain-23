import React from "react";
import { Routes, Route } from 'react-router-dom';

//components
import Navbar from "./components/Navbar";
// pages
import Patients from "./pages/Patients";
import RegistrationForm from "./pages/Register";
import Login from './pages/Login';

const App: React.FC = () => {

  return (
    <div className="h-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<RegistrationForm />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );

};

export default App;