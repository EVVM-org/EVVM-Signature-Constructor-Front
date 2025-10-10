"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { useNameServiceSignatureBuilder } from "@/utils/SignatureBuilder/useNameServiceSignatureBuilder";
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
  const { signWithdrawOffer } = useNameServiceSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const formData = {
      evvmID: getValue("evvmIDInput_withdrawOffer"),
      addressNameService: getValue("nameServiceAddressInput_withdrawOffer"),
      nonceNameService: getValue("nonceNameServiceInput_withdrawOffer"),
      username: getValue("usernameInput_withdrawOffer"),
      offerId: getValue("offerIdInput_withdrawOffer"),
      priorityFee_EVVM: getValue("priorityFeeInput_withdrawOffer"),
      nonce_EVVM: getValue("nonceEVVMInput_withdrawOffer"),
      priorityFlag_EVVM: priority === "high",
    };

    signWithdrawOffer(
      BigInt(formData.evvmID),
      formData.addressNameService as `0x${string}`,
      formData.username,
      BigInt(formData.offerId),
      BigInt(formData.nonceNameService),
      BigInt(formData.priorityFee_EVVM),
      BigInt(formData.nonce_EVVM),
      formData.priorityFlag_EVVM,
      (paySignature: string, withdrawOfferSignature: string) => {
        setDataToGet({
          PayInputData: {
            from: walletData.address as `0x${string}`,
            to_address: formData.addressNameService as `0x${string}`,
            to_identity: "",
            token: tokenAddress.mate as `0x${string}`,
            amount: BigInt(0),
            priorityFee: BigInt(formData.priorityFee_EVVM),
            nonce: BigInt(formData.nonce_EVVM),
            priority: priority === "high",
            executor: formData.addressNameService as `0x${string}`,
            signature: paySignature,
          },
          WithdrawOfferInputData: {
            user: walletData.address as `0x${string}`,
            nonce: BigInt(formData.nonceNameService),
            username: formData.username,
            offerID: BigInt(formData.offerId),
            priorityFee_EVVM: BigInt(formData.priorityFee_EVVM),
            signature: withdrawOfferSignature,
            nonce_EVVM: BigInt(formData.nonce_EVVM),
            priorityFlag_EVVM: formData.priorityFlag_EVVM,
            signature_EVVM: paySignature,
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
    const nameServiceAddress = dataToGet.PayInputData.to_address;

    executeWithdrawOffer(
      dataToGet.WithdrawOfferInputData,
      nameServiceAddress
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
        label="NameService Address"
        inputId="nameServiceAddressInput_withdrawOffer"
        placeholder="Enter NameService address"
        defaultValue={
          contractAddress[account.chain?.id as keyof typeof contractAddress]
            ?.nameService || ""
        }
      />

      <br />

      <NumberInputWithGenerator
        label="NameService Nonce"
        inputId="nonceNameServiceInput_withdrawOffer"
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

      <NumberInputField
        label="EVVM ID"
        inputId="evvmIDInput_withdrawOffer"
        placeholder="Enter EVVM ID"
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
