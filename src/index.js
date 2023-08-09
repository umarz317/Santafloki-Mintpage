import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { bscTestnet } from 'wagmi/chains'
import { ChakraProvider } from '@chakra-ui/react';

const chains = [bscTestnet]
const projectId = '85dffe8a96cad6edf73da08d7d1152fb'

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
const wagmiConfig = createConfig({
  autoConnect: false,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient
})
const ethereumClient = new EthereumClient(wagmiConfig, chains)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <WagmiConfig config={wagmiConfig}>
        <App />
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </ChakraProvider>
  </React.StrictMode>
);

