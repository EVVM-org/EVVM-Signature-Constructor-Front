// import { cookieStorage, createStorage, http } from '@wagmi/core'
import { ConnectButton } from "@/components/ConnectButton";
import { SigMenu } from "@/components/SigConstructors/SigMenu";
import Image from "next/image";

export default function Home() {
  return (
    <div className={"pages"}>
      <a href="https://www.evvm.info/docs/intro"><Image src="/evvm.svg" alt="Reown" width={100} height={150} priority /></a>
      <h1>EVVM Signature Constructor Toolkit For Devs</h1>
      <br />
      <ConnectButton />
      <SigMenu />
    </div>
  );
}
