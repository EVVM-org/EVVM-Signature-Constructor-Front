// import { cookieStorage, createStorage, http } from '@wagmi/core'
import { ConnectButton } from "@/components/ConnectButton";
import { SigMenu } from "@/components/SigConstructors/SigMenu";
import Image from "next/image";

export default function Home() {
  return (
    <div className={"pages"}>
      <Image src="/evvm.svg" alt="Reown" width={100} height={150} priority />
      <h1>EVVM Signature Constructor Toolkit</h1>
      <br />
      <ConnectButton />
      <SigMenu />
    </div>
  );
}
