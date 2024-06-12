import React from "react";
import "./App.css";
import WalletConnect from "./components/WalletConnect";
import MintPage from "./components/MintPage";
import { useAccount } from "wagmi";

function App() {
  const { isConnected } = useAccount();

  return (
    <div className="App">
      {isConnected ? (
        <div>
          <MintPage />
        </div>
      ) : (
        <div>
          <WalletConnect />
        </div>
      )}
    </div>
  );
}

export default App;
