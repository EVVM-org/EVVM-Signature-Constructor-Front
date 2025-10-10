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
import { tokenAddress } from "@/constants/address";
import { useNameServiceSignatureBuilder } from "@/utils/SignatureBuilder/useNameServiceSignatureBuilder";
import { MakeOfferInputData, PayInputData } from "@/utils/TypeInputStructures";
import { executeMakeOffer } from "@/utils/TransactionExecuter";

type InfoData = {
  PayInputData: PayInputData;
  MakeOfferInputData: MakeOfferInputData;
};


interface MakeOfferComponentProps {
  evvmID: string;
  nameServiceAddress: string;
}

export const MakeOfferComponent = ({ evvmID, nameServiceAddress }: MakeOfferComponentProps) => {
  const { signMakeOffer } = useNameServiceSignatureBuilder();
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
      nonceNameService: getValue("nonceNameServiceInput_makeOffer"),
      username: getValue("usernameInput_makeOffer"),
      amount: getValue("amountInput_makeOffer"),
      expireDate: dateToUnixTimestamp(getValue("expireDateInput_makeOffer")),
      priorityFee_EVVM: getValue("priorityFeeInput_makeOffer"),
      nonceEVVM: getValue("nonceEVVMInput_makeOffer"),
      priorityFlag: priority === "high",
    };

    signMakeOffer(
      BigInt(formData.evvmId),
      formData.addressNameService as `0x${string}`,
      formData.username,
      BigInt(formData.expireDate),
      BigInt(formData.amount),
      BigInt(formData.nonceNameService),
      BigInt(formData.priorityFee_EVVM),
      BigInt(formData.nonceEVVM),
      formData.priorityFlag,
      (paySignature: string, makeOfferSignature: string) => {
        setDataToGet({
          PayInputData: {
            from: walletData.address as `0x${string}`,
            to_address: formData.addressNameService as `0x${string}`,
            to_identity: "",
            token: tokenAddress.mate as `0x${string}`,
            amount: BigInt(formData.amount),
            priorityFee: BigInt(formData.priorityFee_EVVM),
            nonce: BigInt(formData.nonceEVVM),
            priority: priority === "high",
            executor: formData.addressNameService as `0x${string}`,
            signature: paySignature,
          },
          MakeOfferInputData: {
            user: walletData.address as `0x${string}`,

            username: formData.username,
            expireDate: BigInt(formData.expireDate),
            amount: BigInt(formData.amount),
            nonce: BigInt(formData.nonceNameService),
            signature: makeOfferSignature,
            priorityFee_EVVM: BigInt(formData.priorityFee_EVVM),
            nonce_EVVM: BigInt(formData.nonceEVVM),
            priorityFlag_EVVM: formData.priorityFlag,
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

    executeMakeOffer(dataToGet.MakeOfferInputData, nameServiceAddress)
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
        link="https://www.evvm.info/docs/SignatureStructures/NameService/makeOfferStructure"
      />

      <br />




      <NumberInputWithGenerator
        label="NameService Nonce"
        inputId="nonceNameServiceInput_makeOffer"
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
