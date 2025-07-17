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
import {
  PayInputData,
  WithdrawOfferInputData,
} from "@/utils/TypeInputStructures";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import { contractAddress, tokenAddress } from "@/constants/address";
import { executeWithdrawOffer } from "@/utils/TransactionExecuter";

type InfoData = {
  PayInputData: PayInputData;
  WithdrawOfferInputData: WithdrawOfferInputData;
};

export const WithdrawOfferComponent = () => {
  const { signWithdrawOffer } = useMnsSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const formData = {
      addressMNS: getValue("mnsAddressInput_withdrawOffer"),
      nonceMNS: getValue("nonceMNSInput_withdrawOffer"),
      username: getValue("usernameInput_withdrawOffer"),
      offerId: getValue("offerIdInput_withdrawOffer"),
      priorityFeeForFisher: getValue("priorityFeeInput_withdrawOffer"),
      nonceEVVM: getValue("nonceEVVMInput_withdrawOffer"),
      priorityFlag: priority === "high",
    };

    signWithdrawOffer(
      formData.addressMNS,
      BigInt(formData.nonceMNS),
      formData.username,
      BigInt(formData.offerId),
      BigInt(formData.priorityFeeForFisher),
      BigInt(formData.nonceEVVM),
      formData.priorityFlag,
      (paySignature, withdrawOfferSignature) => {
        setDataToGet({
          PayInputData: {
            from: walletData.address as `0x${string}`,
            to_address: formData.addressMNS as `0x${string}`,
            to_identity: "",
            token: tokenAddress.mate as `0x${string}`,
            amount: BigInt(formData.priorityFeeForFisher),
            priorityFee: BigInt(0),
            nonce: BigInt(formData.nonceEVVM),
            priority: priority === "high",
            executor: formData.addressMNS as `0x${string}`,
            signature: paySignature,
          },
          WithdrawOfferInputData: {
            user: walletData.address as `0x${string}`,
            nonce: formData.nonceMNS,
            username: formData.username,
            offerID: formData.offerId,
            priorityFeeForFisher: formData.priorityFeeForFisher,
            signature: withdrawOfferSignature,
            nonce_Evvm: formData.nonceEVVM,
            priority_Evvm: formData.priorityFlag,
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

    executeWithdrawOffer(
      dataToGet.WithdrawOfferInputData,
      mnsAddress
    )
      .then(() => {
        console.log("Withdraw offer executed successfully");
      })
      .catch((error) => {
        console.error("Error executing withdraw offer:", error);
      });
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
        defaultValue={
          contractAddress[account.chain?.id as keyof typeof contractAddress]
            ?.mns || ""
        }
      />

      <br />

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
        onExecute={execute}
      />
    </div>
  );
};
