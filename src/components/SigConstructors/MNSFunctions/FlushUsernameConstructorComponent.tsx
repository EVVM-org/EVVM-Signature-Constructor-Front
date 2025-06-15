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


type FlushUsernameData = {
  user: `0x${string}`;
  nonce: string;
  username: string;
  priorityFeeForFisher: string;
  signature: string;
  nonce_Evvm: string;
  priority_Evvm: string;
  signature_Evvm: string;
};

export const FlushUsernameConstructorComponent = () => {
  const { signFlushUsername } = useMnsSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<FlushUsernameData | null>(
    null
  );

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const addressMNS = getValue("mnsAddressInput_flushUsername");
    const nonceMNS = getValue("nonceMNSInput_flushUsername");
    const username = getValue("usernameInput_flushUsername");
    const priceToFlushUsername = getValue("priceForFlushInput_flushUsername");
    const priorityFeeForFisher = getValue("priorityFeeInput_flushUsername");
    const nonceEVVM = getValue("nonceEVVMInput_flushUsername");
    const priorityFlag = priority === "high";

    signFlushUsername(
      addressMNS,
      BigInt(nonceMNS),
      username,
      BigInt(priceToFlushUsername),
      BigInt(priorityFeeForFisher),
      BigInt(nonceEVVM),
      priorityFlag,
      (paySignature, flushUsernameSignature) => {
        setDataToGet({
          user: (account.address || "0x0") as `0x${string}`,
          nonce: nonceMNS,
          username: username,
          priorityFeeForFisher: priorityFeeForFisher,
          signature: paySignature,
          nonce_Evvm: nonceEVVM,
          priority_Evvm: priorityFlag.toString(),
          signature_Evvm: flushUsernameSignature,
        });
      },
      (error) => console.error("Error signing payment:", error)
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Flush Username"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/flushUsernameStructure"
      />

      <br />

      <AddressInputField
        label="MNS Address"
        inputId="mnsAddressInput_flushUsername"
        placeholder="Enter MNS address"
      />

      {/* Nonce section with automatic generator */}

      <NumberInputWithGenerator
        label="MNS Nonce"
        inputId="nonceMNSInput_flushUsername"
        placeholder="Enter nonce"
      />

      <TextInputField
        label="Identity"
        inputId="usernameInput_flushUsername"
        placeholder="Enter username"
      />

      <NumberInputField
        label="Price for flush"
        inputId="priceForFlushInput_flushUsername"
        placeholder="Enter price for flush"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_flushUsername"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_flushUsername"
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
