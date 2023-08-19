import React from "react";
import { makeAppointment } from "../utils/operation";

export default function AddAppointment(props) {
    const [newDiagnosis, setNewDiagnosis] = React.useState({
        doctorAadhar: "",
        symptoms: "",
    })

    const handleChange = (event) => {
        const {name, value} = event.target
        setNewDiagnosis(prevValue => (
               { ...prevValue,
                [name]: value
               })
        )
    }

    const submitBut = async (event) => {
        event.preventDefault()

        await makeAppointment(props.userAadhar, newDiagnosis.symptoms,  newDiagnosis.doctorAadhar )
        console.log("added appointment" ,newDiagnosis)
        alert("added appointment")
    }
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <form>
            <div className="mb-3">
              <label htmlFor="doctorName" className="form-label">
                Doctor Aadhar
              </label>
              <input
                type="text"
                className="form-control"
                id="doctorAadhar"
                name="doctorAadhar"
                value={newDiagnosis.doctorAadhar}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="symptoms" className="form-label">
                Symptoms
              </label>
              <input
                type="text"
                className="form-control"
                id="symptoms"
                name="symptoms"
                value={newDiagnosis.symptoms}
                onChange={handleChange}
              />
            </div>
            
            <button className="btn btn-primary" onClick={submitBut}>Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}