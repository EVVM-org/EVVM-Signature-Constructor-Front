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


type FlushCustomMetadataData = {
  user: `0x${string}`;
  nonce: string;
  identity: string;
  priorityFeeForFisher: string;
  signature: string;
  nonce_Evvm: string;
  priority_Evvm: string;
  signature_Evvm: string;
};

export const FlushCustomMetadataConstructorComponent = () => {
  const { signFlushCustomMetadata } = useMnsSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<FlushCustomMetadataData | null>(
    null
  );

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const addressMNS = getValue("mnsAddressInput_flushCustomMetadata");
    const nonceMNS = getValue("nonceMNSInput_flushCustomMetadata");
    const identity = getValue("identityInput_flushCustomMetadata");
    const priceToFlushCustomMetadata = getValue("priceForFlushInput_flushCustomMetadata");
    const priorityFeeForFisher = getValue("priorityFeeInput_flushCustomMetadata");
    const nonceEVVM = getValue("nonceEVVMInput_flushCustomMetadata");
    const priorityFlag = priority === "high";

    signFlushCustomMetadata(
      addressMNS,
      BigInt(nonceMNS),
      identity,
      BigInt(priceToFlushCustomMetadata),
      BigInt(priorityFeeForFisher),
      BigInt(nonceEVVM),
      priorityFlag,
      (paySignature, flushCustomMetadataSignature) => {
        setDataToGet({
          user: (account.address || "0x0") as `0x${string}`,
          nonce: nonceMNS,
          identity: identity,
          priorityFeeForFisher: priorityFeeForFisher,
          signature: paySignature,
          nonce_Evvm: nonceEVVM,
          priority_Evvm: priorityFlag.toString(),
          signature_Evvm: flushCustomMetadataSignature,
        });
      },
      (error) => console.error("Error signing payment:", error)
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Flush Custom Metadata of Identity"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/flushCustomMetadataStructure"
      />

      <br />

      <AddressInputField
        label="MNS Address"
        inputId="mnsAddressInput_flushCustomMetadata"
        placeholder="Enter MNS address"
      />

      {/* Nonce section with automatic generator */}

      <NumberInputWithGenerator
        label="MNS Nonce"
        inputId="nonceMNSInput_flushCustomMetadata"
        placeholder="Enter nonce"
      />

      <TextInputField
        label="Identity"
        inputId="identityInput_flushCustomMetadata"
        placeholder="Enter identity"
      />

      <NumberInputField
        label="Price for flush"
        inputId="priceForFlushInput_flushCustomMetadata"
        placeholder="Enter price for flush"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_flushCustomMetadata"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_flushCustomMetadata"
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
