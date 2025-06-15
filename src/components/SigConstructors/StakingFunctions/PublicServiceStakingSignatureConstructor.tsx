"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { useSMateSignatureBuilder } from "@/utils/EVVMSignatureBuilder/useSMateSignatureBuilder";
import { TitleAndLink } from "@/components/SigConstructors/InputsAndModules/TitleAndLink";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { StakingActionSelector } from "../InputsAndModules/StakingActionSelector";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { DataDisplayWithClear } from "../InputsAndModules/DataDisplayWithClear";

type PublicServiceStakingData = {
  isStaking: string;
  serviceAddress: string;
  amount: string;
  nonce: string;
  signature: string;
  priorityFee_Evvm: string;
  nonce_Evvm: string;
  priority_Evvm: string;
  signature_Evvm: string;
};

export const PublicServiceStakingSignatureConstructor = () => {
  const account = getAccount(config);
  const { signPublicServiceStaking } = useSMateSignatureBuilder();
  const [isStaking, setIsStaking] = React.useState(true);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] =
    React.useState<PublicServiceStakingData | null>(null);
  const [showData, setShowData] = React.useState(false);

  const makeSig = async () => {
    const getInputValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const sMateAddress = getInputValue(
      "sMateAddressInput_PublicServiceStaking"
    );
    const serviceAddress = getInputValue(
      "serviceAddressInput_PublicServiceStaking"
    );
    const amount = Number(
      getInputValue("amountOfSMateInput_PublicServiceStaking")
    );
    const priorityFee = getInputValue("priorityFeeInput_PublicServiceStaking");
    const nonceEVVM = getInputValue("nonceEVVMInput_PublicServiceStaking");
    const nonceSMATE = getInputValue("nonceSMATEInput_PublicServiceStaking");

    signPublicServiceStaking(
      sMateAddress,
      serviceAddress,
      amount,
      priorityFee,
      nonceEVVM,
      priority === "high",
      isStaking,
      nonceSMATE,
      (paySignature, stakingSignature) => {
        setDataToGet({
          isStaking: isStaking.toString(),
          serviceAddress: serviceAddress as `0x${string}`,
          amount: amount.toString(),
          nonce: nonceSMATE,
          signature: stakingSignature,
          priorityFee_Evvm: priorityFee,
          nonce_Evvm: nonceEVVM,
          priority_Evvm: priority,
          signature_Evvm: paySignature,
        });
      },
      (error) => console.error("Error signing presale staking:", error)
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Service Staking"
        link="https://www.evvm.org/docs/SignatureStructures/SMate/StakingUnstakingStructure"
      />
      <br />
      {/* Configuration Section */}
      <StakingActionSelector onChange={setIsStaking} />

      {/* Address Input */}
      <AddressInputField
        label="sMate Address"
        inputId="sMateAddressInput_PublicServiceStaking"
        placeholder="Enter sMate address"
      />

      <AddressInputField
        label="Service Address"
        inputId="serviceAddressInput_PublicServiceStaking"
        placeholder="Enter service address"
      />

      {/* Nonce Generators */}

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_PublicServiceStaking"
        placeholder="Enter nonce"
      />

      <NumberInputWithGenerator
        label="sMate Nonce"
        inputId="nonceSMATEInput_PublicServiceStaking"
        placeholder="Enter nonce"
      />

      {/* Amount Inputs */}
      <NumberInputField
        label="Amount of sMate"
        inputId="amountOfSMateInput_PublicServiceStaking"
        placeholder="Enter amount of sMate"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_PublicServiceStaking"
        placeholder="Enter priority fee"
      />

      {/* Priority Selection */}
      <PrioritySelector onPriorityChange={setPriority} />

      {/* Action Button */}
      <button
        onClick={makeSig}
        style={{
          padding: "0.5rem 1rem",
          marginTop: "1rem",
          backgroundColor: "#50aad4",
          color: "white",
          border: "none",
        }}
      >
        Create Signature
      </button>

      {/* Results Section */}
      <DataDisplayWithClear
        dataToGet={dataToGet}
        onClear={() => setDataToGet(null)}
      />
    </div>
  );
};
