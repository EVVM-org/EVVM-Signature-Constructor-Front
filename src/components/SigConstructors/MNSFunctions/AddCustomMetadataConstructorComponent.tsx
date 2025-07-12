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

type AddCustomMetadataData = {
  user: string;
  nonce: string;
  identity: string;
  value: string;
  priorityFeeForFisher: string;
  signature: string;
  nonce_Evvm: string;
  priority_Evvm: string;
  signature_Evvm: string;
};

export const AddCustomMetadataConstructorComponent = () => {
  const { signAddCustomMetadata } = useMnsSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] =
    React.useState<AddCustomMetadataData | null>(null);

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const addressMNS = getValue("mnsAddressInput_addCustomMetadata");
    const nonceMNS = getValue("nonceMNSInput_addCustomMetadata");
    const identity = getValue("identityInput_addCustomMetadata");
    const schema = getValue("schemaInput_addCustomMetadata");
    const subschema = getValue("subschemaInput_addCustomMetadata");
    const value = getValue("valueInput_addCustomMetadata");
    const priorityFeeForFisher = getValue("priorityFeeInput_addCustomMetadata");
    const amountOfMateReward = getValue("amountOfMateRewardInput_addCustomMetadata");
    const nonceEVVM = getValue("nonceEVVMInput_addCustomMetadata");
    const priorityFlag = priority === "high";
    
    signAddCustomMetadata(
      addressMNS,
      BigInt(nonceMNS),
      identity,
      schema,
      subschema,
      value,
      BigInt(amountOfMateReward),
      BigInt(priorityFeeForFisher),
      BigInt(nonceEVVM),
      priorityFlag,
      (paySignature, addCustomMetadataSignature) => {
        setDataToGet({
          user: account.address || "",
          nonce: nonceMNS,
          identity: identity,
          value: `${schema}:${subschema}>${value}`,
          priorityFeeForFisher: priorityFeeForFisher,
          signature: addCustomMetadataSignature,
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
        title="Add custom metadata of identity"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/addCustomMetadataStructure"
      />

      <br />

      <AddressInputField
        label="MNS Address"
        inputId="mnsAddressInput_addCustomMetadata"
        placeholder="Enter MNS address"
      />

      <NumberInputWithGenerator
        label="MNS Nonce"
        inputId="nonceMNSInput_addCustomMetadata"
        placeholder="Enter nonce"
      />

      <TextInputField
        label="Identity"
        inputId="identityInput_addCustomMetadata"
        placeholder="Enter identity"
      />

      <TextInputField
        label="Schema"
        inputId="schemaInput_addCustomMetadata"
        placeholder="Enter schema"
      />

      <TextInputField
        label="Subschema"
        inputId="subschemaInput_addCustomMetadata"
        placeholder="Enter subschema"
      />

      <TextInputField
        label="Value"
        inputId="valueInput_addCustomMetadata"
        placeholder="Enter value"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_addCustomMetadata"
        placeholder="Enter priority fee"
      />

      <NumberInputField
        label="Amount of MATE reward"
        inputId="amountOfMateRewardInput_addCustomMetadata"
        placeholder="Enter amount of MATE reward"
      />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_addCustomMetadata"
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
