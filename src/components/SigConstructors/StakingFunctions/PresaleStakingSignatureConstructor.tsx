"use client";
import React from "react";
import { useSMateSignatureBuilder } from "@/utils/EVVMSignatureBuilder/useSMateSignatureBuilder";
import { TitleAndLink } from "@/components/SigConstructors/InputsAndModules/TitleAndLink";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { StakingActionSelector } from "../InputsAndModules/StakingActionSelector";
import { DataDisplayWithClear } from "../InputsAndModules/DataDisplayWithClear";

type PresaleStakingData = {
  isStaking: string;
  amount: string;
  nonce: string;
  signature: string;
  priorityFee_Evvm: string;
  nonce_Evvm: string;
  priority_Evvm: string;
  signature_Evvm: string;
};

export const PresaleStakingSignatureConstructor = () => {
  const { signPresaleStaking } = useSMateSignatureBuilder();

  const [isStaking, setIsStaking] = React.useState(true);
  const [priority, setPriority] = React.useState("low");

  const [dataToGet, setDataToGet] = React.useState<PresaleStakingData | null>(
    null
  );

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const sMateAddress = getValue("sMateAddressInput_presaleStaking");
    const amount = Number(getValue("amountOfSMateInput_presaleStaking"));
    const priorityFee = getValue("priorityFeeInput_presaleStaking");
    const nonceEVVM = getValue("nonceEVVMInput_presaleStaking");
    const nonceSMATE = getValue("nonceSMATEInput_presaleStaking");

    signPresaleStaking(
      sMateAddress,
      amount,
      priorityFee,
      nonceEVVM,
      priority === "high",
      isStaking,
      nonceSMATE,
      (paySignature, stakingSignature) => {
        setDataToGet({
          isStaking: isStaking.toString(),
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
        title="Presale Staking"
        link="https://www.evvm.org/docs/SignatureStructures/SMate/StakingUnstakingStructure"
      />
      <br />
      {/* Configuration Section */}
      <StakingActionSelector onChange={setIsStaking} />

      {/* Address Input */}
      <AddressInputField
        label="sMate Address"
        inputId="sMateAddressInput_presaleStaking"
        placeholder="Enter sMate address"
      />

      {/* Nonce Generators */}

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_presaleStaking"
        placeholder="Enter nonce"
      />

      <NumberInputWithGenerator
        label="sMate Nonce"
        inputId="nonceSMATEInput_presaleStaking"
        placeholder="Enter nonce"
      />

      {/* Amount Inputs */}
      <NumberInputField
        label="Amount of sMate"
        inputId="amountOfSMateInput_presaleStaking"
        placeholder="Enter amount of sMate"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_presaleStaking"
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
