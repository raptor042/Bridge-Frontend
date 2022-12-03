import { IBM_Plex_Mono } from "@next/font/google";
import Sponsor from "../../public/SponsorExample.png";
import Hexagon from "../../public/Hexagon-only.png";
import Image from "next/image";
import { useState, useEffect } from "react";
import { providers, Contract } from "ethers";
import ABI from "../../../../artifacts/contracts/NFTs.sol/NFTs.json";
import Link from "next/link";
import { useRouter } from "next/router";

const IBM = IBM_Plex_Mono({
  weight : ["400", "500", "600", "700"],
  subsets : [
      "latin"
  ]
});

const ibm = {
  fontFamily: `${IBM.style.fontFamily}`
}

const bgImg = {
  backgroundImage: `url(${Hexagon.src})`,
  backgroundSize: "contain",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center"
};

export default function HomePage() {
    const [isMInted, setIsMinted] = useState(false);
    const [metadata, setMetadata] = useState();
    const [address, setAddress] = useState("");
    const [tokenId, setTokenId] = useState();
    const [chain, setChain] = useState();
    const [contract, setContract] = useState();
    const { query } = useRouter();

    useEffect(() => {
      setAddress(query.account);
      fetchCred();
    });

    const fetchCred = async () => {
      if(window.ethereum) {
        const provider = new providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const network = await provider.getNetwork();
  
        if(network.chainId == 5) {
          const contract = new Contract("0x13a7D42DaCc1332AAC758cF53F38c00e37819289", ABI.abi, signer);
          setChain("Mumbai");
          setContract(contract);
        } else if(network.chainId == 80001) {
          const contract = new Contract("0x909CDef334088Ee049F10e0e863b515D36346fC2", ABI.abi, signer);
          setChain("Goerli");
          setContract(contract);
        } else {
          const contract = "";
          setContract(contract);
        }
      }
    }

    const mint = async (e) => {
      e.preventDefault();
  
      try {
        await contract.mint();
        console.log(isMInted);
        setTimeout(() => {
          setIsMinted(true);
          console.log(isMInted);
        }, 15000);
        console.log(isMInted);
      } catch (error) {
        console.log(error);
      }
    };

    const tokenCred = async (e) => {
      e.preventDefault();

        try {
          const supply = await contract.supply();
          console.log(supply.toNumber());
          const tokenUri = await contract.tokenURI(supply.toNumber());
  
          const response = await fetch(tokenUri);
          const json = await response.json();
          console.log(json);
          setMetadata(json);
          setTokenId(supply.toNumber());
        } catch (error) {
          console.log(error);
        }
    };
  
    return (
      <div id="app" className="grid justify-center content-center sm:my-10">
        <div className="w-full sm:w-[30rem] sm:shadow-lg">
          <div className="container bg-black">
            <div className="container flex flex-row">
              <div className="basis-1/4"></div>
              <div className="basis-1/2">
                <h1 className="text-white text-center text-lg" style={ibm}>{address}</h1>
              </div>
              <div className="basis-1/4"></div>
            </div>
          </div>
          <div className="container bg-zinc-300">
            <div className="container flex flex-row py-4">
              <div className="basis-1/4"></div>
              <div className="basis-1/2">
                <Image src={Sponsor} alt="CLABS"/>
              </div>
              <div className="basis-1/4"></div>
            </div>
          </div>
          <div className="container bg-white" style={bgImg}>
            <div className="container flex flex-row py-5">
              <div className="basis-1/3"></div>
              <div className="basis-1/3">
                {!metadata && (
                  <span className="text-black text-center text-sm font-bold" style={ibm}>
                    cLabs has a limited collection of NFTs which can be bridged across multiple chains.
                  </span>
                )}
                {metadata && (
                  <>
                    <p className="text-black text-center text-sm font-bold" style={ibm}>
                      Name : {metadata.name}
                    </p>
                    <p className="text-black text-center text-sm font-bold truncate" style={ibm}>
                      Description : {metadata.description}
                    </p>
                    <a href={metadata.imageUrl} className="text-black text-center text-sm font-bold truncate underline" style={ibm}>
                      Image : {metadata.imageUrl}
                    </a>
                  </>
                )}
              </div>
              <div className="basis-1/3"></div>
            </div>
          </div>
            <div className="container bg-green-500">
              <div className="container flex flex-row py-2">
                <div className="basis-1/4"></div>
                <div className="basis-1/2 text-center">
                  {!isMInted && (
                    <button className="text-white text-xl" style={ibm} onClick={mint}>
                      Mint your NFT
                    </button>
                  )}
                  {isMInted && !metadata && (
                    <button className="text-white text-xl" style={ibm} onClick={tokenCred}>
                      Get Token Credentials
                    </button>
                  )}
                  {metadata && (
                    <Link href={`/bridge/${address}/${tokenId}/${chain}`} className="text-white text-xl underline" style={ibm}>
                      Brigde your NFT
                    </Link>
                  )}
                </div>
                <div className="basis-1/4"></div>
              </div>
            </div>
        </div>
      </div>
    )
}