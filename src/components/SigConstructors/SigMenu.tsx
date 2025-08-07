"use client";
import { useState } from "react";
import { FaucetFunctionsComponent } from "./FaucetFunctions/FaucetFunctionsComponent";
import { PaySignaturesComponent } from "./PaymentFunctions/PaySignaturesComponent";
import { DispersePayComponent } from "./PaymentFunctions/DispersePayComponent";
import { GoldenStakingComponent } from "./StakingFunctions/GoldenStakingComponent";
import { PresaleStakingComponent } from "./StakingFunctions/PresaleStakingComponent";
import { PublicStakingComponent } from "./StakingFunctions/PublicStakingComponent";
import { PublicServiceStakingComponent } from "./StakingFunctions/PublicServiceStakingComponent";
import { PreRegistrationUsernameComponent } from "./NameServiceFunctions/PreRegistrationUsernameComponent";
import { RegistrationUsernameComponent } from "./NameServiceFunctions/RegistrationUsernameComponent";
import { MakeOfferComponent } from "./NameServiceFunctions/MakeOfferComponent";
import { WithdrawOfferComponent } from "./NameServiceFunctions/WithdrawOfferComponent";
import { AcceptOfferComponent } from "./NameServiceFunctions/AcceptOfferComponent";
import { RenewUsernameComponent } from "./NameServiceFunctions/RenewUsernameComponent";
import { AddCustomMetadataComponent } from "./NameServiceFunctions/AddCustomMetadataComponent";
import { RemoveCustomMetadataComponent } from "./NameServiceFunctions/RemoveCustomMetadataComponent";
import { FlushCustomMetadataComponent } from "./NameServiceFunctions/FlushCustomMetadataComponent";
import { FlushUsernameComponent } from "./NameServiceFunctions/FlushUsernameComponent";

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
    <PaySignaturesComponent key="pay" />,
    <DispersePayComponent key="disperse" />,
  ];

  const stakingComponents = [
    <GoldenStakingComponent key="golden" />,
    <PresaleStakingComponent key="presale" />,
    <PublicStakingComponent key="public" />,
    <PublicServiceStakingComponent key="publicService" />,
  ];

  const mnsComponents = [
    <PreRegistrationUsernameComponent key="preReg" />,
    <RegistrationUsernameComponent key="reg" />,
    <MakeOfferComponent key="makeOffer" />,
    <WithdrawOfferComponent key="withdrawOffer" />,
    <AcceptOfferComponent key="acceptOffer" />,
    <RenewUsernameComponent key="renewUsername" />,
    <AddCustomMetadataComponent key="addCustomMetadata" />,
    <RemoveCustomMetadataComponent key="removeCustomMetadata" />,
    <FlushCustomMetadataComponent key="flushCustomMetadata" />,
    <FlushUsernameComponent key="flushUsername" />,
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
