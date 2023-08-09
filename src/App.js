import React, { useState, useEffect, createContext } from "react";
import "./App.css";
import Login from "./components/Login";
import MintPage from "./components/MintPage";
import { useAccount } from "wagmi";
import contractAbi from './assets/abi.json'
export const AppContext = createContext();

function App() {

  const { isConnected } = useAccount()

  const contractAddress = "0xCfcCbdCd09b4d6717A262451F3A8a3B4444c1e53"
  const contract = { address: contractAddress, abi: contractAbi }

  return (
    <AppContext.Provider
      value={{ contract: contract }}
    >
      <>
        <div className="App">

          {isConnected ?
            <div>
              <MintPage />
            </div>
            :
            <div>
              <Login />
            </div>
          }

        </div>
      </>
    </AppContext.Provider>
  );
}

export default App;
