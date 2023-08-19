import React, { useEffect, useState } from "react";
import { connectWallet, getAccount, disconnectWallet } from "../utils/wallet";
import axios from "axios";


const getResponse = async () => {

  let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:3000/api',
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
        <a href="/" className="navbar-brand">
          Health Record Management
        </a>
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
