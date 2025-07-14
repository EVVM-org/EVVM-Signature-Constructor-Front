"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { useMnsSignatureBuilder } from "@/utils/SignatureBuilder/useMnsSignatureBuilder";
import { TitleAndLink } from "@/components/SigConstructors/InputsAndModules/TitleAndLink";
import { hashPreRegisteredUsername } from "@/utils/SignatureBuilder/hashTools";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { DataDisplayWithClear } from "@/components/SigConstructors/InputsAndModules/DataDisplayWithClear";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { TextInputField } from "../InputsAndModules/TextInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { PayInputData } from "@/utils/TypeStructures/evvmTypeInputStructure";
import { PreRegistrationUsernameInputData } from "@/utils/TypeStructures/mnsTypeInputStructure";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import { contractAddress, tokenAddress } from "@/constants/address";
import { executePreRegistrationUsername } from "@/utils/TransactionExecuter/useMNSTransactionExecuter";

type InfoData = {
  PayInputData: PayInputData;
  PreRegistrationUsernameInputData: PreRegistrationUsernameInputData;
};

export const PreRegistrationUsernameConstructorComponent = () => {
  const { signPreRegistrationUsername } = useMnsSignatureBuilder();
  let account = getAccount(config);

  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const formData = {
      addressMNS: getValue("mnsAddressInput_preRegistration"),
      nonceMNS: getValue("nonceMNSInput_preRegistration"),
      username: getValue("usernameInput_preRegistration"),
      clowNumber: getValue("clowNumberInput_preRegistration"),
      priorityFeeForFisher: getValue("priorityFeeInput_preRegistration"),
      nonceEVVM: getValue("nonceEVVMInput_preRegistration"),
    };

    const priorityFlag = priority === "high";

    signPreRegistrationUsername(
      formData.addressMNS,
      BigInt(formData.nonceMNS),
      formData.username,
      BigInt(formData.clowNumber),
      BigInt(formData.priorityFeeForFisher),
      BigInt(formData.nonceEVVM),
      priorityFlag,
      (paySignature, preRegistrationSignature) => {
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
          PreRegistrationUsernameInputData: {
            user: walletData.address as `0x${string}`,
            nonce: BigInt(formData.nonceMNS),
            hashUsername: hashPreRegisteredUsername(
              formData.username,
              BigInt(formData.clowNumber)
            ),
            priorityFeeForFisher: BigInt(formData.priorityFeeForFisher),
            signature: preRegistrationSignature,
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

    executePreRegistrationUsername(
      dataToGet.PreRegistrationUsernameInputData,
      mnsAddress
    )
      .then(() => {
        console.log("Pre-registration username executed successfully");
      })
      .catch((error) => {
        console.error("Error executing pre-registration username:", error);
      });
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Pre-registration of username"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/preRegistrationUsernameStructure"
      />

      <br />

      {/* Address Input */}
      <AddressInputField
        label="MNS Address"
        inputId="mnsAddressInput_preRegistration"
        placeholder="Enter MNS address"
        defaultValue={
          contractAddress[account.chain?.id as keyof typeof contractAddress]
            ?.mns || ""
        }
      />

      <br />

      {/* Nonce section with automatic generator */}

      <NumberInputWithGenerator
        label="MNS Nonce"
        inputId="nonceMNSInput_preRegistration"
        placeholder="Enter nonce"
      />

      <NumberInputWithGenerator
        label="Clow Number"
        inputId="clowNumberInput_preRegistration"
        placeholder="Enter clow number"
      />

      {/* Basic input fields */}

      <TextInputField
        label="Username"
        inputId="usernameInput_preRegistration"
        placeholder="Enter username"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_preRegistration"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_preRegistration"
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
