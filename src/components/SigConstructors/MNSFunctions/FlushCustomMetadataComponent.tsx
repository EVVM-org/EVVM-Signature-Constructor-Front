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
  FlushCustomMetadataInputData,
  PayInputData,
} from "@/utils/TypeInputStructures";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import MateNameService from "@/constants/abi/MateNameService.json";
import { contractAddress, tokenAddress } from "@/constants/address";
import { executeFlushCustomMetadata } from "@/utils/TransactionExecuter";

type InfoData = {
  PayInputData: PayInputData;
  FlushCustomMetadataInputData: FlushCustomMetadataInputData;
};

export const FlushCustomMetadataComponent = () => {
  const { signFlushCustomMetadata } = useMnsSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);

  const getValue = (id: string) =>
    (document.getElementById(id) as HTMLInputElement).value;

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const formData = {
      addressMNS: getValue("mnsAddressInput_flushCustomMetadata"),
      nonceMNS: getValue("nonceMNSInput_flushCustomMetadata"),
      identity: getValue("identityInput_flushCustomMetadata"),
      priorityFeeForFisher: getValue("priorityFeeInput_flushCustomMetadata"),
      nonceEVVM: getValue("nonceEVVMInput_flushCustomMetadata"),
      priorityFlag: priority === "high",
    };

    readContract(config, {
      abi: MateNameService.abi,
      address: formData.addressMNS as `0x${string}`,
      functionName: "getPriceToFlushCustomMetadata",
      args: [formData.identity],
    })
      .then((price) => {
        if (!price) {
          console.error("Price to flush custom metadata is not available");
          return;
        }

        signFlushCustomMetadata(
          formData.addressMNS,
          BigInt(formData.nonceMNS),
          formData.identity,
          price as bigint,
          BigInt(formData.priorityFeeForFisher),
          BigInt(formData.nonceEVVM),
          formData.priorityFlag,
          (paySignature, flushCustomMetadataSignature) => {
            setDataToGet({
              PayInputData: {
                from: walletData.address as `0x${string}`,
                to_address: formData.addressMNS as `0x${string}`,
                to_identity: "",
                token: tokenAddress.mate as `0x${string}`,
                amount: price as bigint,
                priorityFee: BigInt(formData.priorityFeeForFisher),
                nonce: BigInt(formData.nonceEVVM),
                priority: priority === "high",
                executor: formData.addressMNS as `0x${string}`,
                signature: paySignature,
              },
              FlushCustomMetadataInputData: {
                user: walletData.address as `0x${string}`,
                nonce: BigInt(formData.nonceMNS),
                identity: formData.identity,
                priorityFeeForFisher: BigInt(formData.priorityFeeForFisher),
                signature: flushCustomMetadataSignature,
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
        console.error("Error fetching price:", error);
      });
  };

  const execute = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }
    const mnsAddress = dataToGet.PayInputData.to_address;

    executeFlushCustomMetadata(
      dataToGet.FlushCustomMetadataInputData,
      mnsAddress
    )
      .then(() => {
        console.log("Flush custom metadata executed successfully");
      })
      .catch((error) => {
        console.error("Error executing flush custom metadata:", error);
      });
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Flush Custom Metadata of Identity"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/flushCustomMetadataStructure"
      />

      <br />

      <AddressInputField
        label="MNS Address"
        inputId="mnsAddressInput_flushCustomMetadata"
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
        inputId="nonceMNSInput_flushCustomMetadata"
        placeholder="Enter nonce"
      />

      <TextInputField
        label="Identity"
        inputId="identityInput_flushCustomMetadata"
        placeholder="Enter identity"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_flushCustomMetadata"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_flushCustomMetadata"
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
