import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";
import React from "react";
import ReactDOM from 'react-dom/client';
import App from './App';
import { WagmiProvider } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";

const queryClient = new QueryClient();

const projectId = "85dffe8a96cad6edf73da08d7d1152fb";

const metadata = {
  name: "Santafloki",
  description: "Santafloki V2 Minting",
  url: "https://sfminting.vercel.app/",
  icons: ["https://sfminting.vercel.app/logo192.png"],
};

const chains = [bscTestnet];
const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: true,
  enableOnramp: true,
  defaultChain:bscTestnet,
  allowUnsupportedChain: false,
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ChakraProvider>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </WagmiProvider>
  </ChakraProvider>
);
