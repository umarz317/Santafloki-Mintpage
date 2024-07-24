import React, { useState, useEffect } from "react";
import logo from "../assets/images/icon.png";
import { useReadContracts } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { contract } from "../utils/constants";
import LoadingSpinner from "./Spinner";

const WalletConnect = () => {
  const { open } = useWeb3Modal();
  const [totalMinted, setTotalMinted] = useState();
  const [loading, setLoading] = useState(true);
  const [soldout, setSoldout] = useState(false);

  const { data, isSuccess } = useReadContracts({
    contracts: [{ ...contract, functionName: "totalSupply" }],
  });

  useEffect(() => {
    if (isSuccess===true) {
      setLoading(false);
      setTotalMinted(data[0].result?.toString());
    }
  }, [data,isSuccess]);

  async function ConnectWallet() {
    open();
  }

  return (
    <div className="bg-black bg-opacity-40 text-white rounded-3xl relative w-[400px] h-[500px] flex items-center justify-center">
      <div className="flex items-center absolute justify-center top-0 w-full bg-[#360202] rounded-t-3xl">
        <img width={60} height={60} src={logo} alt="logo" />
        <h1>SantaFloki</h1>
        <h4 className="absolute top-[38px] right-[30px]">V2 Minting</h4>
      </div>

      {!loading ? (
        <>
          <div>
            <h3> {totalMinted}/500 NFTs Minted!</h3>
          </div>
          <button className="border-4 border-[#530303] bg-[#008000] text-white rounded-[15px] p-2 absolute bottom-5 font-myFont hover:bg-[#35b835]"
            onClick=
            {() => {
              ConnectWallet();
            }}
            >{!soldout ? <>Connect Wallet</> : <>Sold Out!</>}
          </button>
          <h4 className="absolute bottom-[70px]">
            Connect Wallet To Mint!
          </h4>
        </>
      ) : (
        <>
          <LoadingSpinner />
        </>
      )}
    </div>
  );
};

export default WalletConnect;
