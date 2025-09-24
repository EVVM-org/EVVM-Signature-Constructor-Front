"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { useNameServiceSignatureBuilder } from "@/utils/SignatureBuilder/useNameServiceSignatureBuilder";
import { TitleAndLink } from "@/components/SigConstructors/InputsAndModules/TitleAndLink";
import { hashPreRegisteredUsername } from "@/utils/SignatureBuilder/hashTools";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { DataDisplayWithClear } from "@/components/SigConstructors/InputsAndModules/DataDisplayWithClear";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { TextInputField } from "../InputsAndModules/TextInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { PayInputData } from "@/utils/TypeInputStructures/evvmTypeInputStructure";
import { PreRegistrationUsernameInputData } from "@/utils/TypeInputStructures/nameServiceTypeInputStructure";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import { contractAddress, tokenAddress } from "@/constants/address";
import { executePreRegistrationUsername } from "@/utils/TransactionExecuter/useNameServiceTransactionExecuter";

type InfoData = {
  PayInputData: PayInputData;
  PreRegistrationUsernameInputData: PreRegistrationUsernameInputData;
};

export const PreRegistrationUsernameComponent = () => {
  const { signPreRegistrationUsername } = useNameServiceSignatureBuilder();
  const account = getAccount(config);

  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const formData = {
      addressNameService: getValue("nameServiceAddressInput_preRegistration"),
      username: getValue("usernameInput_preRegistration"),
      nonce: getValue("nonceNameServiceInput_preRegistration"),
      clowNumber: getValue("clowNumberInput_preRegistration"),
      nonce_EVVM: getValue("nonceEVVMInput_preRegistration"),
      priorityFee_EVVM: getValue("priorityFeeInput_preRegistration"),
      priorityFlag_EVVM: priority === "high",
    };

    signPreRegistrationUsername(
      formData.addressNameService,
      formData.username,
      BigInt(formData.clowNumber),
      BigInt(formData.nonce),
      BigInt(formData.priorityFee_EVVM),
      BigInt(formData.nonce_EVVM),
      formData.priorityFlag_EVVM,
      (paySignature, preRegistrationSignature) => {
        const hashUsername = hashPreRegisteredUsername(
          formData.username,
          BigInt(formData.clowNumber)
        );

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
          PreRegistrationUsernameInputData: {
            user: walletData.address as `0x${string}`,
            hashPreRegisteredUsername:
              hashUsername.toLowerCase().slice(0, 2) +
              hashUsername.toUpperCase().slice(2),
            nonce: BigInt(formData.nonce),
            signature: preRegistrationSignature,
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

    executePreRegistrationUsername(
      dataToGet.PreRegistrationUsernameInputData,
      nameServiceAddress
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
        label="NameService Address"
        inputId="nameServiceAddressInput_preRegistration"
        placeholder="Enter NameService address"
        defaultValue={
          contractAddress[account.chain?.id as keyof typeof contractAddress]
            ?.nameService || ""
        }
      />

      <br />

      {/* Nonce section with automatic generator */}

      <NumberInputWithGenerator
        label="NameService Nonce"
        inputId="nonceNameServiceInput_preRegistration"
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
        dataToGet={dataToGet ?? {}}
        onClear={() => setDataToGet(null)}
        onExecute={execute}
      />
    </div>
  );
};
