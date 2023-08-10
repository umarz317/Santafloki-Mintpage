import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../App";
import logo from "../assets/images/icon.png";
import gif from '../assets/images/nfts.gif'
import { useAccount, useContractRead, useContractWrite, useNetwork } from "wagmi";
import { createPublicClient, formatEther, http, parseEther } from "viem";
import { Spinner } from "@chakra-ui/react";
import bnb from '../assets/images/bnb.svg'
import { bscTestnet } from 'wagmi/chains'
const MintPage = () => {

  const { contract } = useContext(AppContext);
  const network = useNetwork()
  const [incorrectChain,setIncorrectChain] = useState(false)


  const [showNFTs, setShowNFTs] = useState(false)
  const [mintAmount, setMintAmount] = useState(1);
  const [mintedNFTs, setMintedNFTs] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const url = 'https://santafloki.mypinata.cloud/ipfs'
  const cid = '/QmYTZJgpMdbHuGJbAxSTwnwHbaMr98gU4RNqUdxbH6NnAW/'

  useEffect(()=>{
    if(network.chain.id!==97){
      setIncorrectChain(true)
    }
    else{
      setIncorrectChain(false)
    }
    setLoading(false)
  },[network])

  const publicClient = createPublicClient({ 
    chain: bscTestnet,
    transport: http()
  })

  async function getMintedNFTsImage(mintedID, mintedCount) {
    var nftArray = []
    console.log(mintedID,mintedCount)
    for (var i = mintedID; i < mintedID + mintedCount; i++) {
      nftArray.push(i)
    }
    console.log(nftArray)
    setShowNFTs(true);
    setMintedNFTs(nftArray);
    setLoading(false);
  }

  const { refetch: fetchSupply } = useContractRead({
    ...contract,
    functionName: 'totalSupply'
  })

  const { data,isSuccess } = useContractRead({
    ...contract,
    functionName: 'basePrice'
  })

  const { writeAsync } = useContractWrite({
    ...contract,
    functionName: 'mintBatch'
  })

  async function getMintedID() {
    try {
      const response = parseInt(((await fetchSupply()).data).toString()) + 1;
      return response;
    } catch (err) {
      console.log(err);
    }
  }

  const MintFunction = async () => {
    setLoading(true);
    let value = (parseInt(data.toString())*mintAmount).toString()
    console.log(value)
    var mintedID = await getMintedID()

    try {
      const txHash = await writeAsync({ args: [mintAmount],value: value});
      const tx = await publicClient.waitForTransactionReceipt(txHash)
      if (tx.status === 'success') {
        setMessage("Minted! Loading NFTs...")
        getMintedNFTsImage(mintedID, mintAmount)
      }
    }
    catch (err) {
      err=err.toString()
      console.log(err)
      if(err.includes('rejected')){
        setMessage('User rejected the transaction!');
      }
      else if(err.includes('balance')){
        setMessage('Low balance!');
      }
      resetLoading();
    }

  }

  async function resetLoading() {
    setTimeout(() => {
      setLoading(false)
      setMessage("");
    }, 2000);
  }

  function resetFromNFTDisplay() {
    setShowNFTs(false);
    setMintedNFTs([]);
  }
  return (
    <>
      <div className="Container">
        <div className="transparentBox">
          <div className="logoDiv">
            <img width={60} height={60} src={logo} />
            <h1>SantaFloki</h1>
          </div>
          <>
            {loading ?
            <div>
              {message===''?
              <Spinner/>:
              <h1>{message}</h1>
              }
            </div>
              :
              <>
              {incorrectChain?
              <h3>Incorrect Chain Switch to bscTestnet</h3>:
              <>
                {!showNFTs ?
                  <>
                    <div className="gifDiv">
                      <img className="nftsGif" src={gif} />
                      <div className="nftsGifTextDiv">
                        <h1 style={{ zIndex: 100 }}>?</h1>
                      </div>
                    </div>
                    <div className="mintBtnDiv">
                      <div style={{display:'flex',position:'absolute',right:'-60px'}}><h6>{"Price: "+isSuccess&&data!==undefined?mintAmount*parseFloat(formatEther(data)):'...'}</h6><img style={{marginLeft:'8px'}} width={20} src={bnb}/></div>
                      <div style={{width:'100%',display:'flex',justifyContent:'space-around'}}>
                        <button className="mintBtn"
                          onClick={() => {
                            {
                              mintAmount > 1 ? setMintAmount(mintAmount - 1) : <></>;
                            }
                          }}
                        >
                          -
                        </button>
                        <button className="mintBtn">
                          {mintAmount}
                        </button>
                        <button className="mintBtn"
                          onClick={() => {
                            {
                              mintAmount < 4 ? setMintAmount(mintAmount + 1) : <></>;
                            }
                          }}
                        >
                          +
                        </button>
                      </div>
                      <div style={{ marginTop: '30px' }}>
                        <button onClick={MintFunction} className="mintBtn" style={{ backgroundColor: 'red' }}>Mint</button>
                      </div>
                    </div>
                  </> :

                  <div className="nftBox">
                    <h3 className="nftText">NFTs Minted!</h3>
                    <div className="nftImagesDiv ">
                      {mintedNFTs.map(element => {
                        return (<img className="nftImage" src={url + cid + element + '.png'} />);
                      })}
                    </div>
                    <div className="nftBackBtnDiv">
                      <button onClick={() => {
                        resetFromNFTDisplay()
                      }} className="buttonBlue">Mint More!</button>
                    </div>
                  </div>


                }
              </>
            }
            </>
            }
          </>
          <h4 style={{ position: 'absolute', top: '38px', right: '30px' }}>V2 Minting</h4>
        </div>
      </div>
    </>
  );
};

export default MintPage;
