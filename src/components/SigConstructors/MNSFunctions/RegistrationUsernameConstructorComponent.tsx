"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { useMnsSignatureBuilder } from "@/utils/SignatureBuilder/useMnsSignatureBuilder";
import { TitleAndLink } from "@/components/SigConstructors/InputsAndModules/TitleAndLink";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { TextInputField } from "../InputsAndModules/TextInputField";
import { DataDisplayWithClear } from "@/components/SigConstructors/InputsAndModules/DataDisplayWithClear";

type RegistrationData = {
  user: `0x${string}`;
  nonce: string;
  username: string;
  clowNumber: string;
  signature: string;
  priorityFeeForFisher: string;
  nonce_Evvm: string;
  priority_Evvm: string;
  signature_Evvm: string;
};

export const RegistrationUsernameConstructorComponent = () => {
  const { signRegistrationUsername } = useMnsSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<RegistrationData | null>(
    null
  );

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const addressMNS = getValue("mnsAddressInput_registration");
    const nonceMNS = getValue("nonceMNSInput_registration");
    const username = getValue("usernameInput_registration");
    const clowNumber = getValue("clowNumberInput_registration");
    const mateRewardAmount = getValue("mateRewardInput_registration");
    const priorityFeeForFisher = getValue("priorityFeeInput_registration");
    const nonceEVVM = getValue("nonceEVVMInput_registration");
    const priorityFlag = priority === "high";

    signRegistrationUsername(
      addressMNS,
      BigInt(nonceMNS),
      username,
      BigInt(clowNumber),
      BigInt(mateRewardAmount),
      BigInt(priorityFeeForFisher),
      BigInt(nonceEVVM),
      priorityFlag,
      (paySignature, registrationSignature) => {
        setDataToGet({
          user: account.address as `0x${string}`,
          nonce: nonceMNS,
          username,
          clowNumber,
          signature: registrationSignature,
          priorityFeeForFisher,
          nonce_Evvm: nonceEVVM,
          priority_Evvm: priorityFlag ? "true" : "false",
          signature_Evvm: paySignature,
        });
      },
      (error) => console.error("Error signing payment:", error)
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Registration of username"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/registrationUsernameStructure"
      />

      <br />

      <AddressInputField
        label="MNS Address"
        inputId="mnsAddressInput_registration"
        placeholder="Enter MNS address"
      />

      {/* Nonce section with automatic generator */}

      <NumberInputWithGenerator
        label="MNS Nonce"
        inputId="nonceMNSInput_registration"
        placeholder="Enter nonce"
      />

      <NumberInputField
        label="Clow Number"
        inputId="clowNumberInput_registration"
        placeholder="Enter clow number"
      />

      <TextInputField
        label="Username"
        inputId="usernameInput_registration"
        placeholder="Enter username"
      />

      <NumberInputField
        label="Mate reward amount"
        inputId="mateRewardInput_registration"
        placeholder="Enter mate reward amount"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_registration"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_registration"
        placeholder="Enter nonce"
      />

      {/* Priority configuration */}
      <PrioritySelector onPriorityChange={setPriority} />

      {/* Create signature button */}
      <button
        onClick={makeSig}
        style={{
          padding: "0.5rem",
          marginTop: "1rem",
        }}
      >
        Make signature
      </button>

      <DataDisplayWithClear
        dataToGet={dataToGet}
        onClear={() => setDataToGet(null)}
      />
    </div>
  );
};
