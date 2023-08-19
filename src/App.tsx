import React, { useState, useEffect } from "react";
import AnotherPage from './other';
// import { Routes, Route, Link, useNavigate } from 'react-router-dom';

// const navigate = useNavigate();
// Components
import Navbar from "./components/Navbar";
import { fetchnameageStorage , fetchtransactions} from "./utils/tzkt";
import { addTransaction , setname, set_both_name_age, updateDiagnosis} from "./utils/operation";
import { getAccount } from "./utils/wallet";

const App: React.FC = () => {
  // Players holding lottery tickets
  const [players, setPlayers] = useState<string[]>([]);
  const [tickets, setTickets] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);
  const [name, setNameDisplay] = useState<string[]>([]);
  const [age, setageDisplay] = useState<number>(0);
  const [fileContent, setFileContent] = useState('');
  const [dataMap, setDataMap] = useState<{ [key: string]: any[] }>({});

  const [textBoxesData, setTextBoxesData] = useState(['', '', '', '']);

  // Set players and tickets remaining
  useEffect(() => {
    // TODO 9 - Fetch players and tickets remaining from storage
    const fetchData = async () => {
      setPlayers([]);
      setTickets(3);

    };

    const updateDataMap = (data: { [key: string]: any[] }) => {
      setDataMap(data);
    };

    const setfromstorage = async () => {
      let obj = await fetchnameageStorage();
      setNameDisplay(obj.name);
      setageDisplay(obj.age);

      let obj2 = await fetchtransactions();
      const current_user = await getAccount();
      if (current_user === "") {
        return;
      }
      if (obj2[current_user] !== undefined)
      updateDataMap({"user":obj2[current_user]});
      
    };

    fetchData();
    setfromstorage();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const contents = event.target.result;
        setFileContent(contents); // Save ArrayBuffer in state
      };

      reader.readAsArrayBuffer(file);
    }
    else {
      console.log("NO FILE is selected");
    }
  };

  const handleInputChange = (index, value) => {
    const newData = [...textBoxesData];
    newData[index] = value;
    setTextBoxesData(newData);
  };

  const handleExtractData = () => {
    console.log('Textbox data:', textBoxesData);
  };

  // TODO 7.a - Complete onBuyTicket function
  const onBuyTicket = async () => {
    const current_user = await getAccount();
    if (current_user === "") {
      alert("Please connect wallet first");
      return;
    }
    await addTransaction(textBoxesData[0], 
      textBoxesData[1], textBoxesData[2], current_user);

  };

  const setName = async () => {
    // await addPatient("25", "Aayush", "2347896520", "Male", "57194378890");
    // await addDoctor("Bones", "899021786786", "Female", "24354633545", 
    // "Nirali", "Andaman Hospital", "32");
    // await addRecord("body pain", "hay fever", "rakesh sinha", "dfgkjv23", "doc Ramesh", "pdf", 
    // "2034092384");
    // await controlVisibility("32", "2345", "0");
    // await makeAppointment("2345", "weakness", "32");
    // await shareDiagnosis("1234234", "1001", "32", "1");
    // await addPatient("Male", "1001", "dsgg435fg", "Aayush", "25");
    await updateDiagnosis("dfsagy2354", "2345", "sdfh4355463", "32", "pdf", "5", "sfdh435");
    // await setname();
  };

  const setBoth = async () => {
    await set_both_name_age();
  };

  // TODO 11.a - Complete onEndGame function
  const onEndGame = async () => {
  };

  function anoterPage(){
    return (
      <nav >
        <h1>
          Working
        </h1>
      </nav>
    )
  }

  return (
    <div className="h-100">
      <Navbar />
      <div className="d-flex flex-column justify-content-center align-items-center h-100">
        {/* Ticket remaining display */}



      <div>
      {textBoxesData.map((value, index) => (
        <input
          key={index}
          type="text"
          value={value}
          onChange={(e) => handleInputChange(index, e.target.value)}
        />
      ))}
      <button onClick={handleExtractData}>Extract and Log Data</button>
    </div>




        <div className="py-1">Name: {name}</div>
        <div className="py-1">Age: {age}</div>
        <div className="py-1"> Following is the transaction data:</div>
        <div>
      {Object.keys(dataMap).map((userKey) => (
        <div key={userKey}>
          {dataMap[userKey].map((item, index) => (
            <div key={index}>
              <p>doc_link: {item.doc_link}</p>
              <p>doctor_name: {item.doctor_name}</p>
              <p>hospital_name: {item.hospital_name}</p>
            </div>
          ))}
        </div>
      ))}
    </div>
      

    <div>
      <input type="file" onChange={handleFileChange} />
      
    </div>

        <div className="py-1">Tickets remaining: {tickets}</div>
        {/* Action Buttons */}
        {tickets > 0 ? (
          <button onClick={onBuyTicket} className="btn btn-primary btn-lg">
            {/* TODO 7.b - Call onBuyTicket on click */}
            {/* TODO 7.c - Show "loading..." when buying operation is pending */}
            Buy Ticket
          </button>
        ) : (
          <button  className="btn btn-success btn-lg">
            {/* TODO 11.b - Call onEndGame on click */}
            {/* TODO 11.c - Show "loading..." when buying operation is pending */}
            End Game
          </button>
        )}
        <button onClick={setName} className="btn btn-primary btn-lg">
            set name
        </button>


        <button onClick={setBoth} className="btn btn-primary btn-lg">
            set both name and age
        </button>
        {/* List of Players */}
        <div className="mt-2">
          {players.map((player, index) => (
            <div key={index}>
              <b>Ticket {index + 1}:</b> {player}
            </div>
          ))}
        </div>
      </div>

      <AnotherPage/>
        


    </div>
  );

};

export default App;