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
import { off } from "process";

type WithdrawOfferData = {
  user: `0x${string}`;
  nonce: string;
  username: string;
  offerID: string;
  priorityFeeForFisher: string;
  signature: string;
  nonce_Evvm: string;
  priority_Evvm: string;
  signature_Evvm: string;
};

export const WithdrawOfferConstructorComponent = () => {
  const { signWithdrawOffer } = useMnsSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<WithdrawOfferData | null>(
    null
  );

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const addressMNS = getValue("mnsAddressInput_withdrawOffer");
    const nonceMNS = getValue("nonceMNSInput_withdrawOffer");
    const username = getValue("usernameInput_withdrawOffer");
    const offerId = getValue("offerIdInput_withdrawOffer");
    const priorityFeeForFisher = getValue("priorityFeeInput_withdrawOffer");
    const nonceEVVM = getValue("nonceEVVMInput_withdrawOffer");
    const priorityFlag = priority === "high";

    signWithdrawOffer(
      addressMNS,
      BigInt(nonceMNS),
      username,
      BigInt(offerId),
      BigInt(priorityFeeForFisher),
      BigInt(nonceEVVM),
      priorityFlag,
      (paySignature, withdrawOfferSignature) => {
        setDataToGet({
          user: account.address as `0x${string}`,
          nonce: nonceMNS,
          username: username,
          offerID: offerId,
          priorityFeeForFisher: priorityFeeForFisher,
          signature: withdrawOfferSignature,
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
        title="Withdraw offer of username"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/withdrawOfferStructure"
      />

      <br />

      <AddressInputField
        label="MNS Address"
        inputId="mnsAddressInput_withdrawOffer"
        placeholder="Enter MNS address"
      />

      <NumberInputWithGenerator
        label="MNS Nonce"
        inputId="nonceMNSInput_withdrawOffer"
        placeholder="Enter nonce"
      />

      <TextInputField
        label="Username"
        inputId="usernameInput_withdrawOffer"
        placeholder="Enter username"
      />

      <NumberInputField
        label="Offer ID"
        inputId="offerIdInput_withdrawOffer"
        placeholder="Enter offer ID"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_withdrawOffer"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_withdrawOffer"
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
