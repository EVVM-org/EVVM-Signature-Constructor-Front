"use client";
// import { cookieStorage, createStorage, http } from '@wagmi/core'
import { ConnectButton } from "@/components/ConnectButton";
import { InfoList } from "@/components/InfoList";
import { ActionButtonList } from "@/components/ActionButtonList";
import Image from "next/image";
import { PaySignaturesConstructorComponent } from "@/components/PaySignaturesConstructorComponent";
import { DispersePaySignatureConstructor } from "@/components/DispersePaySignatureConstructor";

export default function Home() {
  return (
    <div className={"pages"}>
      <Image src="/evvm.svg" alt="Reown" width={100} height={150} priority />
      <h1>EVVM Signature Constructor Example</h1>
      <p>Using Reown, Wagmi and Next.js</p>
      <br/>

      <ConnectButton />
      <ActionButtonList />
      <div className="advice">
        <p>
          This projectId only works on localhost. <br />
          Go to{" "}
          <a
            href="https://cloud.reown.com"
            target="_blank"
            className="link-button"
            rel="Reown Cloud"
          >
            Reown Cloud
          </a>{" "}
          to get your own.
        </p>
      </div>
      {/*<InfoList />*/}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",

          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          width: "100%",
        }}
      >
        <PaySignaturesConstructorComponent />
      </div>
      <br />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",

          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
          width: "100%",
        }}
      >
        <DispersePaySignatureConstructor />
      </div>
    </div>
  );
}
