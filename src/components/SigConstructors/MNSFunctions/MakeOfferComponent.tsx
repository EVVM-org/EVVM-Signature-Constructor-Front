"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { TitleAndLink } from "@/components/SigConstructors/InputsAndModules/TitleAndLink";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { TextInputField } from "../InputsAndModules/TextInputField";
import { DataDisplayWithClear } from "@/components/SigConstructors/InputsAndModules/DataDisplayWithClear";
import { DateInputField } from "../InputsAndModules/DateInputField";
import { dateToUnixTimestamp } from "@/utils/dateToUnixTimestamp";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import { contractAddress, tokenAddress } from "@/constants/address";
import { useMnsSignatureBuilder } from "@/utils/SignatureBuilder/useMnsSignatureBuilder";
import { MakeOfferInputData, PayInputData } from "@/utils/TypeInputStructures";
import { executeMakeOffer } from "@/utils/TransactionExecuter";

type InfoData = {
  PayInputData: PayInputData;
  MakeOfferInputData: MakeOfferInputData;
};

export const MakeOfferComponent = () => {
  const { signMakeOffer } = useMnsSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const formData = {
      addressMNS: getValue("mnsAddressInput_makeOffer"),
      nonceMNS: getValue("nonceMNSInput_makeOffer"),
      username: getValue("usernameInput_makeOffer"),
      amount: getValue("amountInput_makeOffer"),
      expireDate: dateToUnixTimestamp(getValue("expireDateInput_makeOffer")),
      priorityFeeForFisher: getValue("priorityFeeInput_makeOffer"),
      nonceEVVM: getValue("nonceEVVMInput_makeOffer"),
    };

    const priorityFlag = priority === "high";

    signMakeOffer(
      formData.addressMNS,
      BigInt(formData.nonceMNS),
      formData.username,
      BigInt(formData.amount),
      BigInt(formData.expireDate),
      BigInt(formData.priorityFeeForFisher),
      BigInt(formData.nonceEVVM),
      priorityFlag,
      (paySignature, makeOfferSignature) => {
        setDataToGet({
          PayInputData: {
            from: walletData.address as `0x${string}`,
            to_address: formData.addressMNS as `0x${string}`,
            to_identity: "",
            token: tokenAddress.mate as `0x${string}`,
            amount: BigInt(formData.amount),
            priorityFee: BigInt(formData.priorityFeeForFisher),
            nonce: BigInt(formData.nonceEVVM),
            priority: priority === "high",
            executor: formData.addressMNS as `0x${string}`,
            signature: paySignature,
          },
          MakeOfferInputData: {
            user: walletData.address as `0x${string}`,
            nonce: BigInt(formData.nonceMNS),
            username: formData.username,
            amount: BigInt(formData.amount),
            expireDate: BigInt(formData.expireDate),
            priorityFeeForFisher: BigInt(formData.priorityFeeForFisher),
            signature: makeOfferSignature,
            nonce_Evvm: BigInt(formData.nonceEVVM),
            priority_Evvm: priorityFlag,
            signature_Evvm: paySignature,
          },
        });
      },
      (error) => console.error("Error signing payment:", error)
    );
  };

  const execute = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }
    const mnsAddress = dataToGet.PayInputData.to_address;

    executeMakeOffer(dataToGet.MakeOfferInputData, mnsAddress)
      .then(() => {
        console.log("Make offer executed successfully");
      })
      .catch((error) => {
        console.error("Error executing make offer:", error);
      });
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
        defaultValue={
          contractAddress[account.chain?.id as keyof typeof contractAddress]
            ?.mns || ""
        }
      />

      <br />

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
        onExecute={execute}
      />
    </div>
  );
};
