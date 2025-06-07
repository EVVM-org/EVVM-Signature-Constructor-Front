"use client";
import { useState } from "react";
import { PaySignaturesConstructorComponent } from "@/components/SigConstructors/PaymentFunctions/PaySignaturesConstructor";
import { DispersePaySignatureConstructor } from "@/components/SigConstructors/PaymentFunctions/DispersePaySignatureConstructor";
import { GoldenStakingSignatureConstructor } from "@/components/SigConstructors/StakingFunctions/GoldenStakingSignatureConstructor";
import { PresaleStakingSignatureConstructor } from "./StakingFunctions/PresaleStakingSignatureConstructor";
import { PublicStakingSignatureConstructor } from "./StakingFunctions/PublicStakingSignatureConstructor";
import { PublicServiceStakingSignatureConstructor } from "./StakingFunctions/PublicServiceStakingSignatureConstructor";
import { PreRegistrationUsernameConstructorComponent } from "./MNSFunctions/PreRegistrationUsernameConstructorComponent";
import { RegistrationUsernameConstructorComponent } from "./MNSFunctions/RegistrationUsernameConstructorComponent";

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
  const [menu, setMenu] = useState("pay");

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
  ];

  const components =
    menu === "pay"
      ? payComponents
      : menu === "staking"
      ? stakingComponents
      : menu === "mns"
      ? mnsComponents
      : [];

  return (
    <>
      <select onChange={(e) => setMenu(e.target.value)} style={selectStyle}>
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
