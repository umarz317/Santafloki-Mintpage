import React from "react";
import "./App.css";
import WalletConnect from "./components/WalletConnect";
import MintPage from "./components/MintPage";
import { useAccount } from "wagmi";

function App() {
  const { isConnected } = useAccount();

  return (
    <div className="font-['myfont'] w-full min-h-screen flex items-center justify-center">
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
