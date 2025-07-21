"use client";
import React from "react";
import { getAccount, readContract } from "@wagmi/core";
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
  FlushUsernameInputData,
  PayInputData,
} from "@/utils/TypeInputStructures";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import MateNameService from "@/constants/abi/MateNameService.json";
import { contractAddress, tokenAddress } from "@/constants/address";
import { executeFlushUsername } from "@/utils/TransactionExecuter";

type InfoData = {
  PayInputData: PayInputData;
  FlushUsernameInputData: FlushUsernameInputData;
};

export const FlushUsernameComponent = () => {
  const { signFlushUsername } = useMnsSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);

  const getValue = (id: string) =>
    (document.getElementById(id) as HTMLInputElement).value;

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const formData = {
      addressMNS: getValue("mnsAddressInput_flushUsername"),
      nonceMNS: getValue("nonceMNSInput_flushUsername"),
      username: getValue("usernameInput_flushUsername"),
      priorityFeeForFisher: getValue("priorityFeeInput_flushUsername"),
      nonceEVVM: getValue("nonceEVVMInput_flushUsername"),
      priorityFlag: priority === "high",
    };

    readContract(config, {
      abi: MateNameService.abi,
      address: formData.addressMNS as `0x${string}`,
      functionName: "getPriceToFlushUsername",
      args: [formData.username],
    })
      .then((priceToFlushUsername) => {
        console.log("Price to flush username:", priceToFlushUsername);
        if (!priceToFlushUsername) {
          console.error("Price to remove custom metadata is not available");
          return;
        }
        signFlushUsername(
          formData.addressMNS,
          BigInt(formData.nonceMNS),
          formData.username,
          priceToFlushUsername as bigint,
          BigInt(formData.priorityFeeForFisher),
          BigInt(formData.nonceEVVM),
          formData.priorityFlag,
          (paySignature, flushUsernameSignature) => {
            setDataToGet({
              PayInputData: {
                from: walletData.address as `0x${string}`,
                to_address: formData.addressMNS as `0x${string}`,
                to_identity: "",
                token: tokenAddress.mate as `0x${string}`,
                amount: priceToFlushUsername as bigint,
                priorityFee: BigInt(formData.priorityFeeForFisher),
                nonce: BigInt(formData.nonceEVVM),
                priority: formData.priorityFlag,
                executor: formData.addressMNS as `0x${string}`,
                signature: paySignature,
              },
              FlushUsernameInputData: {
                user: walletData.address as `0x${string}`,
                identity: formData.username,
                priorityFeeForFisher: BigInt(formData.priorityFeeForFisher),
                nonce: BigInt(formData.nonceMNS),
                signature: flushUsernameSignature,
                nonce_Evvm: BigInt(formData.nonceEVVM),
                priority_Evvm: formData.priorityFlag,
                signature_Evvm: paySignature,
              },
            });
          },
          (error) => console.error("Error signing payment:", error)
        );
      })
      .catch((error) => {
        console.error("Error reading mate reward amount:", error);
        return;
      });
  };

  const execute = async () => {
      if (!dataToGet) {
        console.error("No data to execute payment");
        return;
      }
      const mnsAddress = dataToGet.PayInputData.to_address;
  
      executeFlushUsername(
        dataToGet.FlushUsernameInputData,
        mnsAddress
      )
        .then(() => {
          console.log("Registration username executed successfully");
        })
        .catch((error) => {
          console.error("Error executing registration username:", error);
        });
    };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Flush Username"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/flushUsernameStructure"
      />

      <br />

      <AddressInputField
        label="MNS Address"
        inputId="mnsAddressInput_flushUsername"
        placeholder="Enter MNS address"
        defaultValue={
          contractAddress[account.chain?.id as keyof typeof contractAddress]
            ?.mns || ""
        }
      />

      {/* Nonce section with automatic generator */}

      <NumberInputWithGenerator
        label="MNS Nonce"
        inputId="nonceMNSInput_flushUsername"
        placeholder="Enter nonce"
      />

      <TextInputField
        label="Identity"
        inputId="usernameInput_flushUsername"
        placeholder="Enter username"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_flushUsername"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_flushUsername"
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
