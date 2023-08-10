import React, { useState, useEffect, useContext, useMemo } from "react";
import logo from "../assets/images/icon.png";
import { useAccount, useConnect, useContractReads } from "wagmi";
import contractAbi from '../assets/abi.json'
import { AppContext } from "../App";
import { Spinner } from "@chakra-ui/react";

import { InjectedConnector } from 'wagmi/connectors/injected'
import { useWeb3Modal } from "@web3modal/react";


const Login = () => {
  const {open} = useWeb3Modal()
  const [totalMinted, setTotalMinted] = useState()
  const [loading, setLoading] = useState(true)
  const [soldout, setSoldout] = useState(false)

  const { contract } = useContext(AppContext)
  
  const {connect,isLoading} = useConnect({chainId:97,connector:new InjectedConnector()})

  const { data, isSuccess } = useContractReads({
    contracts: [
      { ...contract, functionName: 'totalSupply' },
    ]
  })

  useMemo(() => {
    if (isSuccess) {
      setLoading(false)
      setTotalMinted(data[0].result.toString())
    }
  }
    , [isSuccess])

  console.log(data)

  useEffect(() => {

  }, []);

  async function ConnectWallet() {
      if(window.ethereum){
          connect()
      }
      else{
        open()
      }

  }


  return (
    <div className="Container">
      <div className="transparentBox">
        <div className="logoDiv">
          <img width={60} height={60} src={logo} />
          <h1>SantaFloki</h1>
          <h4 style={{ position: 'absolute', top: '38px', right: '30px' }}>V2 Minting</h4>
        </div>
        
        {!loading?
        <>
        <div>
          <h3> {totalMinted}/500 NFTs Minted!</h3>
        </div>
        <button
          className="buttonConnect"
          onClick={() => {
            ConnectWallet();
          }}
        >
          {!soldout?<>Connect Wallet</>:<>Sold Out!</>}
        </button>
        <h4 style={{ position: 'absolute', bottom: '75px' }}>Connect Wallet To Mint!</h4>
        </>:
        <>
        <Spinner/>
        </>
        }
      </div>
    </div>
  );
};

export default Login;
