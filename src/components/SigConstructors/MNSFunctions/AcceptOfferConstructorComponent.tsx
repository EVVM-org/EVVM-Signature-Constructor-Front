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


type AcceptOfferData = {
  user: string;
  nonce: string;
  username: string;
  offerID: string;
  priorityFeeForFisher: string;
  signature: string;
  nonce_Evvm: string;
  priority_Evvm: string;
  signature_Evvm: string;
};

export const AcceptOfferConstructorComponent = () => {
  const { signAcceptOffer } = useMnsSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<AcceptOfferData | null>(
    null
  );

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const addressMNS = getValue("mnsAddressInput_acceptOffer");
    const nonceMNS = getValue("nonceMNSInput_acceptOffer");
    const username = getValue("usernameInput_acceptOffer");
    const offerId = getValue("offerIdInput_acceptOffer");
    const priorityFeeForFisher = getValue("priorityFeeInput_acceptOffer");
    const nonceEVVM = getValue("nonceEVVMInput_acceptOffer");
    const priorityFlag = priority === "high";

    signAcceptOffer(
      addressMNS,
      BigInt(nonceMNS),
      username,
      BigInt(offerId),
      BigInt(priorityFeeForFisher),
      BigInt(nonceEVVM),
      priorityFlag,
      (paySignature, acceptOfferSignature) => {
        setDataToGet({
          user: account.address || "",
          nonce: nonceMNS,
          username: username,
          offerID: offerId,
          priorityFeeForFisher: priorityFeeForFisher,
          signature: acceptOfferSignature,
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
        title="Accept offer of username"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/acceptOfferStructure"
      />

      
      <br />

      <AddressInputField
        label="MNS Address"
        inputId="mnsAddressInput_acceptOffer"
        placeholder="Enter MNS address"
      />

      <NumberInputWithGenerator
        label="MNS Nonce"
        inputId="nonceMNSInput_acceptOffer"
        placeholder="Enter nonce"
      />

      <TextInputField
        label="Username"
        inputId="usernameInput_acceptOffer"
        placeholder="Enter username"
      />

      <NumberInputField
        label="Offer ID"
        inputId="offerIdInput_acceptOffer"
        placeholder="Enter offer ID"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_acceptOffer"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_acceptOffer"
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
