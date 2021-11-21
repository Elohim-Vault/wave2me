import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import wavePortal from "./utils/WavePortal.json";

export default function App() {
  const [currentAccount, setCurrentAccount] = useState('');
  const [waveTotal , setWaveTotal] = useState(0);
  const [contract, setContract] = useState(null);
  const contractAddress = "0xE0E661Ff886c3870F99eef41e69c97Be5F2e9573";
  const contractABI = wavePortal.abi;

  const loadData = async () => {
    const {ethereum} = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
    let count = await wavePortalContract.getTotalWaves();
    console.log(count);
    setWaveTotal(count.toNumber());
    setContract(wavePortalContract);
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
        let count = await contract.getTotalWaves();
        console.log("Retrieved total we have count...", count.toNumber());

        const waveTxn = await contract.wave();
        console.log("Mining...", waveTxn.hash);
  
        await waveTxn.wait();
        console.log("Mined --", waveTxn.hash);
  
        count = await contract.getTotalWaves();
        setWaveTotal(count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    loadData();
  }, []);

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am farza and I worked on self-driving cars so that's pretty cool right? Connect your Ethereum wallet and wave at me!
        </div>

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect Wallet
          </button>
        )}

        <h1>
          Total number of waves: {waveTotal}
        </h1>
      </div>
    </div>
  );
}
