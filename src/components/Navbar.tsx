import React, { useEffect, useState } from "react";
import { connectWallet, getAccount, disconnectWallet } from "../utils/wallet";
import axios from "axios";
import { useSessionStorage } from "../utils/useSessionStorage";
import { Link } from "react-router-dom";

const getResponse = async () => {

  let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:4000/api',
      headers: {
          'Content-Type': 'application/json',
      },
      withCredentials: false  
  };

  axios.request(config)
      .then((response) => {
          console.log("worked and this is the response");
          console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
          console.log(error);
      });
};


const Navbar: React.FC = () => {
  const [account, setAccount] = useState<string>("");
    
  const [token,setToken] = useSessionStorage('token','');
  const [user,setUser] = useSessionStorage('user',JSON.stringify({}));
  const [login,setLogin] = useSessionStorage('login',"false");

  const User = JSON.parse(user);

  useEffect(() => {
    (async () => {
      // TODO 5.b - Get the active account
      const account = await getAccount();
      setAccount(account);
    })();
  }, []);

  // TODO 4.a - Complete onConnectWallet function
  const onConnectWallet = async () => {
    await connectWallet();
    // TODO 5.b - Get the active account
    const account = await getAccount();
    setAccount(account);

  };

  const disconnect = async () => {
    await disconnectWallet();
    setAccount("");
  };
  return (
    <div className="navbar navbar-dark bg-dark fixed-top">
      <div className="container py-2">
        <Link to={login==="true" && token.length ? `/patient_home`:`/login`} className="navbar-brand">
          Health Record Management
        </Link>
        <span style={{color:'white', fontWeight:600, fontSize:'1rem'}}>
          {login==="true" && token.length? `Hi ${User.name}! Welcome to the Portal.` :""}
        </span>
        <div className="d-flex">
          {/* TODO 4.b - Call connectWallet function onClick  */}
          <button  onClick={onConnectWallet}className="btn btn-outline-info">
            {/* TODO 5.a - Show account address if wallet is connected */}
            {account ? <div>{account}</div> : <span>Connect Wallet</span>}
          </button>
          <button onClick={disconnect} className="btn btn-outline-danger">
            X
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
