"use client";
import React from "react";
import { useSMateSignatureBuilder } from "@/utils/EVVMSignatureBuilder/useSMateSignatureBuilder";
import { TitleAndLink } from "@/components/SigConstructors/InputsAndModules/TitleAndLink";
import { DetailedData } from "@/components/SigConstructors/InputsAndModules/DetailedData";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { StakingActionSelector } from "../InputsAndModules/StakingActionSelector";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { DataDisplayWithClear } from "../InputsAndModules/DataDisplayWithClear";

type PublicStakingData = {
  isStaking: string;
  amount: string;
  nonce: string;
  signature: string;
  priorityFee_Evvm: string;
  nonce_Evvm: string;
  priority_Evvm: string;
  signature_Evvm: string;
};

export const PublicStakingSignatureConstructor = () => {
  const { signPublicStaking } = useSMateSignatureBuilder();
  const [isStaking, setIsStaking] = React.useState(true);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<PublicStakingData | null>(
    null
  );

  const makeSig = async () => {
    // Get form values
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const sMateAddress = getValue("sMateAddressInput_PublicStaking");
    if (!sMateAddress) {
      alert("Please enter a sMate address");
      return;
    }

    const formData = {
      nonceEVVM: getValue("nonceEVVMInput_PublicStaking"),
      nonceSMATE: getValue("nonceSMATEInput_PublicStaking"),
      amount: Number(getValue("amountOfSMateInput_PublicStaking")),
      priorityFee: getValue("priorityFeeInput_PublicStaking"),
    };

    // Sign message
    signPublicStaking(
      sMateAddress,
      formData.amount,
      formData.priorityFee,
      formData.nonceEVVM,
      priority === "high",
      isStaking,
      formData.nonceSMATE,
      (paySignature, stakingSignature) => {
        setDataToGet({
          isStaking: isStaking.toString(),
          amount: formData.amount.toString(),
          nonce: formData.nonceSMATE,
          signature: stakingSignature,
          priorityFee_Evvm: formData.priorityFee,
          nonce_Evvm: formData.nonceEVVM,
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
        title="Public Staking"
        link="https://www.evvm.org/docs/SignatureStructures/SMate/StakingUnstakingStructure"
      />
      <br />
      {/* Configuration Section */}
      <StakingActionSelector onChange={setIsStaking} />

      {/* Address Input */}
      <AddressInputField
        label="sMate Address"
        inputId="sMateAddressInput_PublicStaking"
        placeholder="Enter sMate address"
      />

      {/* Nonce Generators */}
      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_PublicStaking"
        placeholder="Enter nonce"
      />

      <NumberInputWithGenerator
        label="sMate Nonce"
        inputId="nonceSMATEInput_PublicStaking"
        placeholder="Enter nonce"
      />

      {/* Amount Inputs */}
      <NumberInputField
        label="Amount of sMate"
        inputId="amountOfSMateInput_PublicStaking"
        placeholder="Enter amount of sMate"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_PublicStaking"
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
