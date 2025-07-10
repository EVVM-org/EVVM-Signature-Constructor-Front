"use client";
import { useState } from "react";
import { PaySignaturesConstructorComponent } from "@/components/SigConstructors/PaymentFunctions/PaySignaturesConstructor";
import { DispersePaySignatureConstructor } from "@/components/SigConstructors/PaymentFunctions/DispersePaySignatureConstructor";
import { GoldenStakingSignatureConstructor } from "@/components/SigConstructors/StakingFunctions/GoldenStakingSignatureConstructor";
import { PresaleStakingSignatureConstructor } from "@/components/SigConstructors/StakingFunctions/PresaleStakingSignatureConstructor";
import { PublicStakingSignatureConstructor } from "@/components/SigConstructors/StakingFunctions/PublicStakingSignatureConstructor";
import { PublicServiceStakingSignatureConstructor } from "@/components/SigConstructors/StakingFunctions/PublicServiceStakingSignatureConstructor";
import { PreRegistrationUsernameConstructorComponent } from "@/components/SigConstructors/MNSFunctions/PreRegistrationUsernameConstructorComponent";
import { RegistrationUsernameConstructorComponent } from "@/components/SigConstructors/MNSFunctions/RegistrationUsernameConstructorComponent";
import { MakeOfferConstructorComponent } from "@/components/SigConstructors/MNSFunctions/MakeOfferConstructorComponent";
import { WithdrawOfferConstructorComponent } from "@/components/SigConstructors/MNSFunctions/WithdrawOfferConstructorComponent";
import { AcceptOfferConstructorComponent } from "@/components/SigConstructors/MNSFunctions/AcceptOfferConstructorComponent";
import { RenewUsernameConstructorComponent } from "./MNSFunctions/RenewUsernameConstructorComponent";
import { AddCustomMetadataConstructorComponent } from "./MNSFunctions/AddCustomMetadataConstructorComponent";
import { RemoveCustomMetadataConstructorComponent } from "./MNSFunctions/RemoveCustomMetadataConstructorComponent";
import { FlushCustomMetadataConstructorComponent } from "./MNSFunctions/FlushCustomMetadataConstructorComponent";
import { FlushUsernameConstructorComponent } from "./MNSFunctions/FlushUsernameConstructorComponent";
import { FaucetFunctionsComponent } from "./FaucetFunctions/FaucetFunctionsComponent";

const boxStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  padding: "1rem",
  border: "1px solid #ccc",
  borderRadius: "8px",
  width: "100%",
  marginBottom: "1rem",
} as const;

const selectStyle = {
  padding: "1rem",
  border: "1px solid #ccc",
  borderRadius: "8px",
  width: "100%",
  backgroundColor: "#f9f9f9",
  color: "#333",
  marginBottom: "1rem",
} as const;

export const SigMenu = () => {
  const [menu, setMenu] = useState("faucet");

  const FaucetFunctions = [
    <FaucetFunctionsComponent key="faucet" />,
    
  ];

  const payComponents = [
    <PaySignaturesConstructorComponent key="pay" />,
    <DispersePaySignatureConstructor key="disperse" />,
  ];

  const stakingComponents = [
    <GoldenStakingSignatureConstructor key="golden" />,
    <PresaleStakingSignatureConstructor key="presale" />,
    <PublicStakingSignatureConstructor key="public" />,
    <PublicServiceStakingSignatureConstructor key="publicService" />,
  ];

  const mnsComponents = [
    <PreRegistrationUsernameConstructorComponent key="preReg" />,
    <RegistrationUsernameConstructorComponent key="reg" />,
    <MakeOfferConstructorComponent key="makeOffer" />,
    <WithdrawOfferConstructorComponent key="withdrawOffer" />,
    <AcceptOfferConstructorComponent key="acceptOffer" />,
    <RenewUsernameConstructorComponent key="renewUsername" />,
    <AddCustomMetadataConstructorComponent key="addCustomMetadata" />,
    <RemoveCustomMetadataConstructorComponent key="removeCustomMetadata" />,
    <FlushCustomMetadataConstructorComponent key="flushCustomMetadata" />,
    <FlushUsernameConstructorComponent key="flushUsername" />,
  ];

  const components =
    menu === "faucet"
      ? FaucetFunctions
      : menu === "pay"
      ? payComponents
      : menu === "staking"
      ? stakingComponents
      : menu === "mns"
      ? mnsComponents
      : [];

  return (
    <>
      <select onChange={(e) => setMenu(e.target.value)} style={selectStyle}>
        <option value="faucet">Faucet functions</option>
        <option value="pay">Payment signatures</option>
        <option value="staking">Staking signatures</option>
        <option value="mns">MNS signatures</option>
      </select>

      <div>
        {components.map((Component, index) => (
          <div key={index} style={boxStyle}>
            {Component}
          </div>
        ))}
      </div>
    </>
  );
};
