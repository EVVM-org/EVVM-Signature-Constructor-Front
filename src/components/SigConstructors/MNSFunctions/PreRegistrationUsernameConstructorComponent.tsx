"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { useMnsSignatureBuilder } from "@/utils/SignatureBuilder/useMnsSignatureBuilder";
import { TitleAndLink } from "@/components/SigConstructors/InputsAndModules/TitleAndLink";
import { hashPreRegisteredUsername } from "@/utils/SignatureBuilder/hashTools";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { DataDisplayWithClear } from "@/components/SigConstructors/InputsAndModules/DataDisplayWithClear";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { TextInputField } from "../InputsAndModules/TextInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { AddressInputField } from "../InputsAndModules/AddressInputField";

type PreRegistrationData = {
  user: `0x${string}`;
  nonce: string;
  hashUsername: string;
  priorityFeeForFisher: string;
  signature: string;
  nonce_Evvm: string;
  priority_Evvm: string;
  signature_Evvm: string;
};

export const PreRegistrationUsernameConstructorComponent = () => {
  const { signPreRegistrationUsername } = useMnsSignatureBuilder();
  const account = getAccount(config);

  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<PreRegistrationData | null>(
    null
  );

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const addressMNS = getValue("mnsAddressInput_preRegistration");
    const nonceMNS = getValue("nonceMNSInput_preRegistration");
    const username = getValue("usernameInput_preRegistration");
    const clowNumber = getValue("clowNumberInput_preRegistration");
    const priorityFeeForFisher = getValue("priorityFeeInput_preRegistration");
    const nonceEVVM = getValue("nonceEVVMInput_preRegistration");
    const priorityFlag = priority === "high";

    signPreRegistrationUsername(
      addressMNS,
      BigInt(nonceMNS),
      username,
      BigInt(clowNumber),
      BigInt(priorityFeeForFisher),
      BigInt(nonceEVVM),
      priorityFlag,
      (paySignature, preRegistrationSignature) => {
        setDataToGet({
          user: account.address as `0x${string}`,
          nonce: nonceMNS,
          hashUsername: hashPreRegisteredUsername(username, BigInt(clowNumber)),
          priorityFeeForFisher: priorityFeeForFisher,
          signature: preRegistrationSignature,
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
        title="Pre-registration of username"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/preRegistrationUsernameStructure"
      />

      <br />

      {/* Address Input */}
      <AddressInputField
        label="MNS Address"
        inputId="mnsAddressInput_preRegistration"
        placeholder="Enter MNS address"
      />

      {/* Nonce section with automatic generator */}

      <NumberInputWithGenerator
        label="MNS Nonce"
        inputId="nonceMNSInput_preRegistration"
        placeholder="Enter nonce"
      />

      <NumberInputWithGenerator
        label="Clow Number"
        inputId="clowNumberInput_preRegistration"
        placeholder="Enter clow number"
      />

      {/* Basic input fields */}

      <TextInputField
        label="Username"
        inputId="usernameInput_preRegistration"
        placeholder="Enter username"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_preRegistration"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_preRegistration"
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
