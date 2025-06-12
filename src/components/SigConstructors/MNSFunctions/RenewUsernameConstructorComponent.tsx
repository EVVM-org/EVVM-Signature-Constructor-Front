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


type RenewUsernameData = {
  user: string;
  nonce: string;
  username: string;
  priorityFeeForFisher: string;
  signature: string;
  nonce_Evvm: string;
  priority_Evvm: string;
  signature_Evvm: string;
};

export const RenewUsernameConstructorComponent = () => {
  const { signRenewUsername } = useMnsSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<RenewUsernameData | null>(
    null
  );

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const addressMNS = getValue("mnsAddressInput_renewUsername");
    const nonceMNS = getValue("nonceMNSInput_renewUsername");
    const username = getValue("usernameInput_renewUsername");
    const amountToRenew = getValue("amountToRenew_renewUsername");
    const priorityFeeForFisher = getValue("priorityFeeInput_renewUsername");
    const nonceEVVM = getValue("nonceEVVMInput_renewUsername");
    const priorityFlag = priority === "high";

    signRenewUsername(
      addressMNS,
      BigInt(nonceMNS),
      username,
      BigInt(amountToRenew),
      BigInt(priorityFeeForFisher),
      BigInt(nonceEVVM),
      priorityFlag,
      (paySignature, renewUsernameSignature) => {
        setDataToGet({
          user: account.address || "",
          nonce: nonceMNS,
          username: username,
          priorityFeeForFisher: priorityFeeForFisher,
          signature: renewUsernameSignature,
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
        title="Renewal of username"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/renewUsernameStructure"
      />

      
      <br />

      <AddressInputField
        label="MNS Address"
        inputId="mnsAddressInput_renewUsername"
        placeholder="Enter MNS address"
      />

      <NumberInputWithGenerator
        label="MNS Nonce"
        inputId="nonceMNSInput_renewUsername"
        placeholder="Enter nonce"
      />

      <TextInputField
        label="Username"
        inputId="usernameInput_renewUsername"
        placeholder="Enter username"
      />

      <NumberInputField
        label="Amount to Renew"
        inputId="amountToRenew_renewUsername"
        placeholder="Enter amount to renew"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_renewUsername"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_renewUsername"
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
