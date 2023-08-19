import React from "react";
import { Routes, Route } from 'react-router-dom';

//components
import Navbar from "./components/Navbar";
// pages
import Patients from "./pages/Patients";
import RegistrationForm from "./pages/Register";

const App: React.FC = () => {

  return (
    <div className="h-100">
      <Navbar />
      <Routes>
        <Route path="/" element={<RegistrationForm />} />
      </Routes>
    </div>
  );

};

export default App;