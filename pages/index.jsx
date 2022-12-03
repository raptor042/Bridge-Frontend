import { IBM_Plex_Mono } from "@next/font/google";
import Sponsor from "../public/SponsorExample.png";
import Hexagon from "../public/Hexagon-only.png";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

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
  const [account, setAccount] = useState("");
  const [connected, setConnected] = useState(false);

  const connectWallet = async(e) => {
		e.preventDefault();

		if(window.ethereum) {
	    const _account = await window.ethereum.request({method: "eth_requestAccounts"});
	    setAccount(_account[0]);
      setConnected(true);
	  };
	};

  return (
    <div id="app" className="grid justify-center content-center sm:my-10">
      <div className="w-full sm:w-[30rem] sm:shadow-lg">
        <div className="container bg-black">
          <div className="container flex flex-row">
            <div className="basis-1/4"></div>
            <div className="basis-1/2">
              {!connected && (
                <h1 className="text-white text-center text-xl" style={ibm}>OMNICHAIN NFTs</h1>
              )}
              {connected && (
                <h1 className="text-white text-center text-lg" style={ibm}>{account}</h1>
              )}
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
              <span className="text-black text-center text-sm font-bold" style={ibm}>
                cLabs has a limited collection of NFTs which can be bridged across multiple chains.
              </span>
            </div>
            <div className="basis-1/3"></div>
          </div>
        </div>
        {!connected && (
          <div className="container bg-green-500">
            <div className="container flex flex-row py-2">
              <div className="basis-1/4"></div>
              <div className="basis-1/2 text-center">
                <a href="#" className="text-white text-xl" style={ibm} onClick={connectWallet}>Connect Wallet</a>
              </div>
              <div className="basis-1/4"></div>
            </div>
          </div>
        )}
        {connected && (
          <div className="container bg-green-500">
            <div className="container flex flex-row py-2">
              <div className="basis-1/4"></div>
              <div className="basis-1/2 text-center">
                <Link href={`/mint/${account}`} className="text-white text-xl underline" style={ibm}>Mint your NFT</Link>
              </div>
              <div className="basis-1/4"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}