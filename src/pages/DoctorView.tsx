import React, { useState } from "react";

import UserInfo from "../components/UserInfo";


export default function DoctorView() {
    const [docForm , setDocForm] = useState({
        name: 'Amae',
        age: "dsg", 
        aadhar: "asdgasd",
        sex: "sdafds"})

    const [UserDiagnosis, setUserDiagnosis] = useState([])
    
    return (
        <div className="h-100">
            <UserInfo form={docForm}/>
        </div>
    )

}