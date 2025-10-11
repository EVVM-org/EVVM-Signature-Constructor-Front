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
  AcceptOfferInputData,
  PayInputData,
} from "@/utils/TypeInputStructures";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import { tokenAddress } from "@/constants/address";
import { executeAcceptOffer } from "@/utils/TransactionExecuter";

type InfoData = {
  PayInputData: PayInputData;
  AcceptOfferInputData: AcceptOfferInputData;
};

interface AcceptOfferComponentProps {
  evvmID: string;
  nameServiceAddress: string;
}

export const AcceptOfferComponent = ({
  evvmID,
  nameServiceAddress,
}: AcceptOfferComponentProps) => {
  const { signAcceptOffer } = useNameServiceSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const formData = {
      evvmId: evvmID,
      addressNameService: nameServiceAddress,
      username: getValue("usernameInput_acceptOffer"),
      offerId: getValue("offerIdInput_acceptOffer"),
      nonce: getValue("nonceInput_acceptOffer"),
      priorityFee_EVVM: getValue("priorityFeeEVVMInput_acceptOffer"),
      priorityFlag_EVVM: priority === "high",
      nonce_EVVM: getValue("nonceEVVMInput_acceptOffer"),
    };

    signAcceptOffer(
      BigInt(formData.evvmId),
      formData.addressNameService as `0x${string}`,
      formData.username,
      BigInt(formData.offerId),
      BigInt(formData.nonce),
      BigInt(formData.priorityFee_EVVM),
      BigInt(formData.nonce_EVVM),
      formData.priorityFlag_EVVM,
      (paySignature, acceptOfferSignature) => {
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
          AcceptOfferInputData: {
            user: walletData.address as `0x${string}`,
            username: formData.username,
            offerID: BigInt(formData.offerId),
            nonce: formData.nonce,
            signature: acceptOfferSignature,
            priorityFee_EVVM: BigInt(formData.priorityFee_EVVM),
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

    executeAcceptOffer(dataToGet.AcceptOfferInputData, nameServiceAddress)
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
        title="Accept offer of username"
        link="https://www.evvm.info/docs/SignatureStructures/MNS/acceptOfferStructure"
      />

      <br />

      <NumberInputWithGenerator
        label="MNS Nonce"
        inputId="nonceInput_acceptOffer"
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
        inputId="priorityFeeEVVMInput_acceptOffer"
        placeholder="Enter priority fee"
      />

      {/* Priority configuration */}
      <PrioritySelector onPriorityChange={setPriority} />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_acceptOffer"
        placeholder="Enter nonce"
        showRandomBtn={priority === "low"}
      />

      {/* Create signature button */}
      <button
        onClick={makeSig}
        style={{
          padding: "0.5rem",
          marginTop: "1rem",
        }}
      >
        Create signature
      </button>

      <DataDisplayWithClear
        dataToGet={dataToGet}
        onClear={() => setDataToGet(null)}
        onExecute={execute}
      />
    </div>
  );
};
