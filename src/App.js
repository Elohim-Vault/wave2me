import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import wavePortal from "./utils/WavePortal.json";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [allWaves, setAllWaves] = useState([]);
  const [waveTotal , setWaveTotal] = useState(0);
  const [contract, setContract] = useState(null);
  const [message, setMessage] = useState("");
  const contractAddress = "0x6c79cF5a98eBf1758584816B50A09Eb7AcB644A4";
  const contractABI = wavePortal.abi;

  const loadBlockchain = async () => {
    const {ethereum} = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    setContract(wavePortalContract);
    const count = await wavePortalContract.getTotalWaves();
    setWaveTotal(count.toNumber());
  }

  const checkIfWalletIsConnected = async () => {
    try {
      const {ethereum} = window;
      if (!ethereum) {
        console.log("Make sure you have metamask");
        return ; 
      }
      else {
        console.log("We have the ethereum object: ", ethereum);
      }
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length != 0) {
        setCurrentAccount(accounts[0]);
        console.log("Found an authorized account: ", currentAccount);
      }
      else {
        console.log("No authorized account found");
      }
    } catch (err) {
      console.error(err);
    }
  }

  const connectWallet = async () => {
    try {
      const {ethereum} = window;

      if (!ethereum) {
        alert("Get metamask!");
        return ;
      }
      const accounts = await ethereum.request({ method: 'eth_requestAccounts'});
      setCurrentAccount(accounts[0]);
      console.log("Connected", currentAccount);
    } catch (err) {
      console.error(err);
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const waveTxn = await contract.wave(message);
        setMessage("");
        await waveTxn.wait();
        const count = await contract.getTotalWaves();
        setWaveTotal(count.toNumber());
      } else {
        console.error("Ethereum object doesn't exist!");
      }
    } catch (err) {
      console.error(err);
    }
  }

  const getAllWaves = async () => {
    try {
      const {ethereum} = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(wavePortalContract);

        const waves = await wavePortalContract.getAllWaves();
        let formatedWaves = [];
        waves.forEach(wave => {
          formatedWaves.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        setAllWaves(formatedWaves);
      }
      else {
        alert("Ethereum object doesn't exist");
      }
    } catch (err) {
      console.error(err);
    }
  }
  useEffect(() => {
    checkIfWalletIsConnected();
    loadBlockchain();
    getAllWaves();
  }, []);

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          <div className="title">
            <img src="android-chrome-512x512.png" />
            <h1>Wave portal</h1>
          </div>
          <h3>A music, an image link or just a message, send a wave to me!</h3>
        </div>

        <div className="waveCounter">
          <h2>
            Total waves send
          </h2>
          <h3>
            {waveTotal}
          </h3>
        </div>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}
        
        
        <textarea resize="false" value={message} onChange={(e) => setMessage(e.target.value)}>

        </textarea>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        <div className="lastWaves">
          <h2>Last waves</h2>
          {allWaves.map((wave, index) => {
              return (
              <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
                <div>Address: {wave.address}</div>
                <div>Time: {wave.timestamp.toString()}</div>
                <div>Message: {wave.message}</div>
              </div>
              )
          })}
        </div>
      </div>
    </div>
  );
}
