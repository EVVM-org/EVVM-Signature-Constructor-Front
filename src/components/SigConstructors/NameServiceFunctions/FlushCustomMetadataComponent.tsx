"use client";
import React from "react";
import { getAccount, readContract } from "@wagmi/core";
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
  FlushCustomMetadataInputData,
  PayInputData,
} from "@/utils/TypeInputStructures";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import NameService from "@/constants/abi/NameService.json";
import { tokenAddress } from "@/constants/address";
import { executeFlushCustomMetadata } from "@/utils/TransactionExecuter";

type InfoData = {
  PayInputData: PayInputData;
  FlushCustomMetadataInputData: FlushCustomMetadataInputData;
};


interface FlushCustomMetadataComponentProps {
  evvmID: string;
  nameServiceAddress: string;
}

export const FlushCustomMetadataComponent = ({ evvmID, nameServiceAddress }: FlushCustomMetadataComponentProps) => {
  const { signFlushCustomMetadata } = useNameServiceSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);

  const getValue = (id: string) =>
    (document.getElementById(id) as HTMLInputElement).value;

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;


    const formData = {
      evvmId: evvmID,
      addressNameService: nameServiceAddress,
      nonceNameService: getValue("nonceNameServiceInput_flushCustomMetadata"),
      identity: getValue("identityInput_flushCustomMetadata"),
      priorityFee_EVVM: getValue("priorityFeeInput_flushCustomMetadata"),
      nonce_EVVM: getValue("nonceEVVMInput_flushCustomMetadata"),
      priorityFlag_EVVM: priority === "high",
    };

    readContract(config, {
      abi: NameService.abi,
      address: formData.addressNameService as `0x${string}`,
      functionName: "getPriceToFlushCustomMetadata",
      args: [formData.identity],
    })
      .then((price) => {
        if (!price) {
          console.error("Price to flush custom metadata is not available");
          return;
        }

        signFlushCustomMetadata(
          BigInt(formData.evvmId),
          formData.addressNameService as `0x${string}`,
          formData.identity,
          BigInt(formData.nonceNameService),
          price as bigint,
          BigInt(formData.priorityFee_EVVM),
          BigInt(formData.nonce_EVVM),
          formData.priorityFlag_EVVM,
          (paySignature, flushCustomMetadataSignature) => {
            setDataToGet({
              PayInputData: {
                from: walletData.address as `0x${string}`,
                to_address: formData.addressNameService as `0x${string}`,
                to_identity: "",
                token: tokenAddress.mate as `0x${string}`,
                amount: price as bigint,
                priorityFee: BigInt(formData.priorityFee_EVVM),
                nonce: BigInt(formData.nonce_EVVM),
                priority: priority === "high",
                executor: formData.addressNameService as `0x${string}`,
                signature: paySignature,
              },
              FlushCustomMetadataInputData: {
                user: walletData.address as `0x${string}`,
                identity: formData.identity,
                nonce: BigInt(formData.nonceNameService),
                signature: flushCustomMetadataSignature,
                priorityFee_EVVM: BigInt(formData.priorityFee_EVVM),
                nonce_EVVM: BigInt(formData.nonce_EVVM),
                priorityFlag_EVVM: formData.priorityFlag_EVVM,
                signature_EVVM: paySignature,
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
    const nameServiceAddress = dataToGet.PayInputData.to_address;

    executeFlushCustomMetadata(
      dataToGet.FlushCustomMetadataInputData,
      nameServiceAddress
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






      {/* Nonce section with automatic generator */}

      <NumberInputWithGenerator
        label="NameService Nonce"
        inputId="nonceNameServiceInput_flushCustomMetadata"
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
