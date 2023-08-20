import React from "react";
import { Routes, Route } from 'react-router-dom';

//components
import Navbar from "./components/Navbar";
import NewSidebar from './components/NewSidebar';
// pages
import Patients from "./pages/Patients";
import RegistrationForm from "./pages/Register";
import Login from './pages/Login';
import PatientHome from './pages/PatientHome';
import PatientAddDiag from "./pages/PatientAddDiag";
import PatientAppointment from "./pages/PatientAppointment";
import Error from './pages/Error';

import {useSessionStorage} from './utils/useSessionStorage'
import PatientProfile from "./pages/PatientProfile";

const App: React.FC = () => {

  const [token,setToken] = useSessionStorage('token','');
  const [user,setUser] = useSessionStorage('user',JSON.stringify({}));
  const [login,setLogin] = useSessionStorage('login',false);

  return (
    <div className="h-100">
      <Navbar />
      {login && token && <NewSidebar />}
      <Routes>
        <Route path="/" element={<RegistrationForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patient_home" element={(login && token) ? <PatientHome />:<Error />} />
        <Route path="/patient_profile" element={(login && token) ? <PatientProfile />:<Error />} />
        <Route path="/patient_adddiag" element={(login && token) ? <PatientAddDiag />:<Error />} />
        <Route path="/patient_appointment" element={(login && token) ? <PatientAppointment />:<Error />} />        
      </Routes>
    </div>
  );

};

export default App;