// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT is ERC721Enumerable,Ownable{

    using Strings for uint256;
    //base Price 0.04 BNB
    uint256 public basePrice = 4 * (10**16);
    //Max Supply
    uint maxSupply = 500;
    //URL
    string baseURI = "https://ipfs.io/ipfs/QmTwyNGPrUxaGEty3n6z2N3YKumATi2m3DoJvGoZsNrR7u/";
    
    constructor() ERC721("SantaFloki V2 NFT","SFV2"){

    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(),".json")) : "";
    }

    function ownerMint(address owner) public onlyOwner{
        _mint(owner,totalSupply()+1);
    }

    function mintBatch(uint numberOfMints) public payable {
        require(totalSupply()+numberOfMints<=maxSupply,"Max Minting Breached! Try minting less!");
        require(msg.value==basePrice*numberOfMints,"Invalid Amount Sent!");
        for(uint i=0;i<numberOfMints;i++){
            _mint(msg.sender, totalSupply()+1);
        }
    }

    function withdraw(address to) public onlyOwner{
        require(address(this).balance>0,"No balance to withdraw!");
        payable(to).transfer(address(this).balance);
    }

    function possibleMintingAmount() public view returns(uint256){
        return maxSupply-totalSupply();
    }

    function setPrice(uint256 price) public onlyOwner{
        basePrice = price;
    }

    function mintBatchOwner(address[] calldata addresses) public onlyOwner {
        uint numberOfMints = addresses.length;
        require(totalSupply()+numberOfMints<=maxSupply,"Max Minting Breached! Try minting less!");
        for(uint i=0;i<numberOfMints;i++){
            _mint(addresses[i], totalSupply()+1);
        }
    }
    
}