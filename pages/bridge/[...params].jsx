import { IBM_Plex_Mono } from "@next/font/google";
import Sponsor from "../../public/SponsorExample.png";
import Hexagon from "../../public/Hexagon-only.png";
import Image from "next/image";
import { useState, useEffect } from "react";
import { providers, Contract, utils, BigNumber } from "ethers";
import ABI from "../../../../artifacts/contracts/NFTs.sol/NFTs.json";
import { GOERLI, MUMBAI } from "../../../metadata/metadata";
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
    const [isBridged, setIsBridged] = useState(false);
    const [metadata, setMetadata] = useState({});
    const [chainId, setChainId] = useState();
    const [destination, setDestination] = useState("");
    const [signer, setSigner] = useState();
    const { query } = useRouter();

    const bridge = async (e) => {
      e.preventDefault();

      let contract;
  
      if(window.ethereum) {
        const provider = new providers.Web3Provider(window.ethereum);
        const _signer = provider.getSigner();
        const network = await provider.getNetwork();
        setSigner(_signer);
  
        if(network.chainId == 5) {
          contract = new Contract("0x13a7D42DaCc1332AAC758cF53F38c00e37819289", ABI.abi, signer);
          setChainId(10109);
          setDestination(await utils.solidityPack(
            ["address", "address"],
            ["0x909CDef334088Ee049F10e0e863b515D36346fC2",
            "0x13a7D42DaCc1332AAC758cF53F38c00e37819289"]
          ));
        } else if(network.chainId == 80001) {
          contract = new Contract("0x909CDef334088Ee049F10e0e863b515D36346fC2", ABI.abi, signer);
          setChainId(10121);
          setDestination(utils.solidityPack(
            ["address", "address"],
            ["0x13a7D42DaCc1332AAC758cF53F38c00e37819289",
            "0x909CDef334088Ee049F10e0e863b515D36346fC2"]
          ));
        } else {
          contract = "";
        }
      }
  
      try {
        console.log(destination);
        const dst = (chainId == 10121) ? 
          await contract.solidityPack(0x13a7D42DaCc1332AAC758cF53F38c00e37819289, 0x909CDef334088Ee049F10e0e863b515D36346fC2) :
          await contract.solidityPack(0x909CDef334088Ee049F10e0e863b515D36346fC2, 0x13a7D42DaCc1332AAC758cF53F38c00e37819289);
        console.log(dst);
        const tx = await contract.CrossChainTransfer(
          chainId, 
          destination, 
          BigNumber.from(query.params[1]),
          { value : utils.parseEther("0.05") }
        );
        console.log(tx);
        if(chainId == 10109) {
          const contract = new Contract("0x909CDef334088Ee049F10e0e863b515D36346fC2", ABI.abi, signer);
          await contract.on("Recieve", (_srcChainId, _dstAddress, tokenId, event) => {
            console.log({_srcChainId, _dstAddress, tokenId, event});
            setMetadata({_srcChainId, _dstAddress, tokenId});
            setIsBridged(true);
          });
        } else if(chainId == 10121) {
          const contract = new Contract("0x13a7D42DaCc1332AAC758cF53F38c00e37819289", ABI.abi, signer);
          await contract.on("Recieve", (_srcChainId, _dstAddress, tokenId, event) => {
            console.log({_srcChainId, _dstAddress, tokenId, event});
            setMetadata({_srcChainId, _dstAddress, tokenId});
            setIsBridged(true);
          });
        }
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
                <h1 className="text-white text-center text-lg" style={ibm}>{query.params[0]}</h1>
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
                {!isBridged && (
                  <span className="text-black text-center text-sm font-bold" style={ibm}>
                    cLabs has a limited collection of NFTs which can be bridged across multiple chains.
                  </span>
                )}
                {isBridged && (
                  <>
                    <p className="text-black text-center text-sm font-bold" style={ibm}>
                      Name : {metadata.name}
                    </p>
                    <p className="text-black text-center text-sm font-bold" style={ibm}>
                      Description : {metadata.description}
                    </p>
                    <p className="text-black text-center text-sm font-bold" style={ibm}>
                      Image : {metadata.imageUrl}
                    </p>
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
                  {!isBridged && (
                    <a href="#" className="text-white text-xl underline" style={ibm} onClick={bridge}>
                      Bridge your NFT to {query.params[2]}
                    </a>
                  )}
                  {isBridged && (
                    <span className="text-white text-xl underline" style={ibm}>
                      WAGMI
                    </span>
                  )}
                </div>
                <div className="basis-1/4"></div>
              </div>
            </div>
        </div>
      </div>
    )
}