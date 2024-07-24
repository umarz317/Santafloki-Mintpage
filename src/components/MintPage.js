import React, { useState, useEffect } from "react";
import logo from "../assets/images/icon.png";
import gif from "../assets/images/nfts.gif";
import { useReadContract, useWriteContract } from "wagmi";
import { createPublicClient, formatEther, http } from "viem";
import { Spinner } from "@chakra-ui/react";
import bnb from "../assets/images/bnb.svg";
import { bscTestnet } from "wagmi/chains";
import { contract } from "../utils/constants";
import { useWeb3ModalState } from "@web3modal/wagmi/react";

const MintPage = () => {
  const { selectedNetworkId } = useWeb3ModalState();
  const [incorrectChain, setIncorrectChain] = useState(false);

  const [showNFTs, setShowNFTs] = useState(false);
  const [mintAmount, setMintAmount] = useState(1);
  const [mintedNFTs, setMintedNFTs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const url = "https://ipfs.io/ipfs";
  const cid = "/QmYTZJgpMdbHuGJbAxSTwnwHbaMr98gU4RNqUdxbH6NnAW/";

  useEffect(() => {
    console.log(selectedNetworkId);
    if (selectedNetworkId !== 97) {
      console.log("incorrect chain");
      setIncorrectChain(true);
    } else {
      setIncorrectChain(false);
    }
    setLoading(false);
  }, [selectedNetworkId]);

  const publicClient = createPublicClient({
    chain: bscTestnet,
    transport: http(),
  });

  async function getMintedNFTsImage(mintedID, mintedCount) {
    var nftArray = [];
    console.log(mintedID, mintedCount);
    for (var i = mintedID; i < mintedID + mintedCount; i++) {
      nftArray.push(i);
    }
    console.log(nftArray);
    setShowNFTs(true);
    setMintedNFTs(nftArray);
    setLoading(false);
  }

  const { refetch: fetchSupply } = useReadContract({
    ...contract,
    functionName: "totalSupply",
  });

  const { data, isSuccess } = useReadContract({
    ...contract,
    functionName: "basePrice",
  });

  const { writeContractAsync } = useWriteContract();

  async function getMintedID() {
    try {
      const response = parseInt((await fetchSupply()).data.toString()) + 1;
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  const MintFunction = async () => {
    setLoading(true);
    let value = (parseInt(data.toString()) * mintAmount).toString();
    console.log(value);
    var mintedID = await getMintedID();
    console.log(mintedID, mintAmount, value);
    console.log(contract);
    try {
      const txHash = await writeContractAsync({
        ...contract,
        args: [mintAmount],
        value: value,
        functionName: "mintBatch",
      });
      const tx = await publicClient.waitForTransactionReceipt({hash: txHash});
      if (tx.status === "success") {
        setMessage("Minted! Loading NFTs...");
        getMintedNFTsImage(mintedID, mintAmount);
      }
    } catch (err) {
      err = err.toString();
      console.log(err);
      if (err.includes("rejected")) {
        setMessage("User rejected the transaction!");
      } else if (err.includes("balance")) {
        setMessage("Low balance!");
      }
      resetLoading();
    }
  };

  async function resetLoading() {
    setTimeout(() => {
      setLoading(false);
      setMessage("");
    }, 2000);
  }

  function resetFromNFTDisplay() {
    setShowNFTs(false);
    setMintedNFTs([]);
  }

  return (
    <>
      <div className="bg-black bg-opacity-40 text-white rounded-3xl relative w-[400px] h-[500px] flex items-center justify-center">
        <div className="flex items-center absolute justify-center top-0 w-full bg-[#360202] rounded-t-3xl">
          <img width={60} height={60} src={logo} />
          <h1>SantaFloki</h1>
          <h4 className="absolute top-[38px] right-[30px]">V2 Minting</h4>
        </div>
        <>
          {loading ? (
            <div>{message === "" ? <Spinner /> : <h1>{message}</h1>}</div>
          ) : (
            <>
              {incorrectChain ? (
                <h3>Incorrect Chain Switch to bscTestnet</h3>
              ) : (
                <>
                  {!showNFTs ? (
                    <>
                      <div className="mt-[-40px] w-[180px] h-[220px] rounded-[20px] relative">
                        <img
                          className="absolute w-[180px] h-[220px] rounded-[20px] filter brightness-30"
                          src={gif}
                        />
                        <div className="w-full h-full flex items-center justify-center">
                          <h1 style={{ zIndex: 100 }}>?</h1>
                        </div>
                      </div>
                      <div className="w-1/2 absolute flex flex-col justify-center items-center bottom-6">
                        <div className="flex absolute right-[-80px] mt-4">
                          <h6>
                            {"Price: " +
                              (isSuccess && data !== undefined
                                ? mintAmount * parseFloat(formatEther(data))
                                : "...")}
                          </h6>
                          <img className="ml-2" width={20} src={bnb} />
                        </div>
                        <div className="flex justify-around w-full">
                          <button
                            className="py-2 px-2 rounded-2xl bg-blue-600"
                            onClick={() => {
                              {
                                mintAmount > 1 ? (
                                  setMintAmount(mintAmount - 1)
                                ) : (
                                  <></>
                                );
                              }
                            }}
                          >
                            -
                          </button>
                          <button className="py-2 px-2 rounded-2xl bg-blue-600">{mintAmount}</button>
                          <button
                            className="py-2 px-2 rounded-2xl bg-blue-500"
                            onClick={() => {
                              {
                                mintAmount < 4 ? (
                                  setMintAmount(mintAmount + 1)
                                ) : (
                                  <></>
                                );
                              }
                            }}
                          >
                            +
                          </button>
                        </div>
                        <div className="mt-7">
                          <button
                            onClick={MintFunction}
                            className="py-2 px-2 rounded-2xl bg-red-600"
                          >
                            Mint
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full flex items-center flex-col">
                      <h3 className="h-[20px]">NFTs Minted!</h3>
                      <div className="flex justify-center flex-wrap">
                        {mintedNFTs.map((element) => {
                          return (
                            <img
                              className="w-[120px] p-2.5 rounded-[20px]"
                              src={url + cid + element + ".png"}
                            />
                          );
                        })}
                      </div>
                      <div className="h-1/10 flex items-center justify-center absolute bottom-5 mx-auto left-0 right-0">
                        <button
                          onClick={() => {
                            resetFromNFTDisplay();
                          }}
                          className="border-4 border-[#030853] bg-[#2b28ba] text-white rounded-[15px] p-2 font-myFont hover:bg-[#3551b8]"
                        >
                          Mint More!
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </>
        <h4 style={{ position: "absolute", top: "38px", right: "30px" }}>
          V2 Minting
        </h4>
      </div>
    </>
  );
};

export default MintPage;
