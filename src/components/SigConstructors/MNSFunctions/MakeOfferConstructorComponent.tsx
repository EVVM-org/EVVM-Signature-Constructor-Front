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
import { DateInputField } from "../InputsAndModules/DateInputField";
import { dateToUnixTimestamp } from "@/utils/dateToUnixTimestamp";

type MakeOfferData = {
  user: `0x${string}`;
  nonce: string;
  username: string;
  amount: string;
  expireDate: string;
  priorityFeeForFisher: string;
  signature: string;
  nonce_Evvm: string;
  priority_Evvm: string;
  signature_Evvm: string;
};

export const MakeOfferConstructorComponent = () => {
  const { signMakeOffer } = useMnsSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<MakeOfferData | null>(null);

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const addressMNS = getValue("mnsAddressInput_makeOffer");
    const nonceMNS = getValue("nonceMNSInput_makeOffer");
    const username = getValue("usernameInput_makeOffer");
    const amount = getValue("amountInput_makeOffer");
    const expireDate = dateToUnixTimestamp(getValue("expireDateInput_makeOffer"));
    const priorityFeeForFisher = getValue("priorityFeeInput_makeOffer");
    const nonceEVVM = getValue("nonceEVVMInput_makeOffer");
    const priorityFlag = priority === "high";

    
    signMakeOffer(
      addressMNS,
      BigInt(nonceMNS),
      username,
      BigInt(amount),
      BigInt(expireDate),
      BigInt(priorityFeeForFisher),
      BigInt(nonceEVVM),
      priorityFlag,
      (paySignature, registrationSignature) => {
        setDataToGet({
          user: account.address as `0x${string}`,
          nonce: nonceMNS,
          username: username,
          amount: amount,
          expireDate: expireDate.toString(),
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
        title="Make offer of username"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/makeOfferStructure"
      />

      <br />

      <AddressInputField
        label="MNS Address"
        inputId="mnsAddressInput_makeOffer"
        placeholder="Enter MNS address"
      />

      <NumberInputWithGenerator
        label="MNS Nonce"
        inputId="nonceMNSInput_makeOffer"
        placeholder="Enter nonce"
      />

      <TextInputField
        label="Username"
        inputId="usernameInput_makeOffer"
        placeholder="Enter username"
      />

      <NumberInputField
        label="Amount to offer"
        inputId="amountInput_makeOffer"
        placeholder="Enter amount to offer"
      />
      
      <DateInputField
        label="Expiration Date"
        inputId="expireDateInput_makeOffer"
        defaultValue="2025-12-31"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_makeOffer"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_makeOffer"
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
