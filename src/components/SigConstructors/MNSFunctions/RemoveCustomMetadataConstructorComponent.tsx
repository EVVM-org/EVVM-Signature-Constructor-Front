"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { useMnsSignatureBuilder } from "@/utils/EVVMSignatureBuilder/useMnsSignatureBuilder";
import { TitleAndLink } from "@/components/SigConstructors/InputsAndModules/TitleAndLink";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { TextInputField } from "../InputsAndModules/TextInputField";
import { DataDisplayWithClear } from "@/components/SigConstructors/InputsAndModules/DataDisplayWithClear";


type RemoveCustomMetadataData = {
  user: string;
  nonce: string;
  identity: string;
  key: string;
  priorityFeeForFisher: string;
  signature: string;
  nonce_Evvm: string;
  priority_Evvm: string;
  signature_Evvm: string;
};

export const RemoveCustomMetadataConstructorComponent = () => {
  const { signRemoveCustomMetadata } = useMnsSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] =
    React.useState<RemoveCustomMetadataData | null>(null);

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const addressMNS = getValue("mnsAddressInput_removeCustomMetadata");
    const nonceMNS = getValue("nonceMNSInput_removeCustomMetadata");
    const identity = getValue("identityInput_removeCustomMetadata");
    const key = getValue("keyInput_removeCustomMetadata");
    const priorityFeeForFisher = getValue("priorityFeeInput_removeCustomMetadata");
    const amountOfMateReward = getValue("amountOfMateRewardInput_removeCustomMetadata");
    const nonceEVVM = getValue("nonceEVVMInput_removeCustomMetadata");
    const priorityFlag = priority === "high";
    
    signRemoveCustomMetadata(
      addressMNS,
      BigInt(nonceMNS),
      identity,
      BigInt(key),
      BigInt(amountOfMateReward),
      BigInt(priorityFeeForFisher),
      BigInt(nonceEVVM),
      priorityFlag,
      (paySignature, removeCustomMetadataSignature) => {
        setDataToGet({
          user: account.address || "",
          nonce: nonceMNS,
          identity: identity,
          key: key,
          priorityFeeForFisher: priorityFeeForFisher,
          signature: removeCustomMetadataSignature,
          nonce_Evvm: nonceEVVM,
          priority_Evvm: priorityFlag ? "high" : "low",
          signature_Evvm: paySignature,
        });
      },
      (error) => console.error("Error signing payment:", error)
    );
    
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Remove custom metadata of identity"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/removeCustomMetadataStructure"
      />

      <br />

      <AddressInputField
        label="MNS Address"
        inputId="mnsAddressInput_removeCustomMetadata"
        placeholder="Enter MNS address"
      />

      <NumberInputWithGenerator
        label="MNS Nonce"
        inputId="nonceMNSInput_removeCustomMetadata"
        placeholder="Enter nonce"
      />

      <TextInputField
        label="Identity"
        inputId="identityInput_removeCustomMetadata"
        placeholder="Enter identity"
      />

      <TextInputField
        label="Key"
        inputId="keyInput_removeCustomMetadata"
        placeholder="Enter key"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_removeCustomMetadata"
        placeholder="Enter priority fee"
      />

      <NumberInputField
        label="Amount of MATE reward"
        inputId="amountOfMateRewardInput_removeCustomMetadata"
        placeholder="Enter amount of MATE reward"
      />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_removeCustomMetadata"
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
