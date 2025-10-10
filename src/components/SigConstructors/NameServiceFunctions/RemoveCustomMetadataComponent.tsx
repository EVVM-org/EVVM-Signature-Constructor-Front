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
  RemoveCustomMetadataInputData,
  PayInputData,
} from "@/utils/TypeInputStructures";
import NameService from "@/constants/abi/NameService.json";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import { executeRemoveCustomMetadata } from "@/utils/TransactionExecuter";
import { tokenAddress } from "@/constants/address";

type InfoData = {
  PayInputData: PayInputData;
  RemoveCustomMetadataInputData: RemoveCustomMetadataInputData;
};


interface RemoveCustomMetadataComponentProps {
  evvmID: string;
  nameServiceAddress: string;
}

export const RemoveCustomMetadataComponent = ({ evvmID, nameServiceAddress }: RemoveCustomMetadataComponentProps) => {
  const { signRemoveCustomMetadata } = useNameServiceSignatureBuilder();
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
      nonceNameService: getValue("nonceNameServiceInput_removeCustomMetadata"),
      identity: getValue("identityInput_removeCustomMetadata"),
      key: getValue("keyInput_removeCustomMetadata"),
      priorityFee_EVVM: getValue("priorityFeeInput_removeCustomMetadata"),
      nonceEVVM: getValue("nonceEVVMInput_removeCustomMetadata"),
      priorityFlag: priority === "high",
    };

    readContract(config, {
      abi: NameService.abi,
      address: formData.addressNameService as `0x${string}`,
      functionName: "getPriceToRemoveCustomMetadata",
      args: [],
    })
      .then((price) => {
        if (!price) {
          console.error("Price to remove custom metadata is not available");
          return;
        }
        signRemoveCustomMetadata(
          BigInt(formData.evvmId),
          formData.addressNameService as `0x${string}`,
          formData.identity,
          BigInt(formData.key),
          BigInt(formData.nonceNameService),
          price as bigint,
          BigInt(formData.priorityFee_EVVM),
          BigInt(formData.nonceEVVM),
          formData.priorityFlag,
          (paySignature: string, removeCustomMetadataSignature: string) => {
            setDataToGet({
              PayInputData: {
                from: walletData.address as `0x${string}`,
                to_address: formData.addressNameService as `0x${string}`,
                to_identity: "",
                token: tokenAddress.mate as `0x${string}`,
                amount: price as bigint,
                priorityFee: BigInt(formData.priorityFee_EVVM),
                nonce: BigInt(formData.nonceEVVM),
                priority: priority === "high",
                executor: formData.addressNameService as `0x${string}`,
                signature: paySignature,
              },
              RemoveCustomMetadataInputData: {
                user: walletData.address as `0x${string}`,
                nonce: BigInt(formData.nonceNameService),
                identity: formData.identity,
                key: BigInt(formData.key),
                priorityFee_EVVM: BigInt(formData.priorityFee_EVVM),
                signature: removeCustomMetadataSignature,
                nonce_EVVM: BigInt(formData.nonceEVVM),
                priorityFlag_EVVM: formData.priorityFlag,
                signature_EVVM: paySignature,
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
    const nameServiceAddress = dataToGet.PayInputData.to_address;

    executeRemoveCustomMetadata(
      dataToGet.RemoveCustomMetadataInputData,
      nameServiceAddress
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
        title="Remove custom metadata of identity"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/removeCustomMetadataStructure"
      />

      <br />



      <br />

      <NumberInputWithGenerator
        label="NameService Nonce"
        inputId="nonceNameServiceInput_removeCustomMetadata"
        placeholder="Enter nonce"
      />

      <TextInputField
        label="Identity"
        inputId="identityInput_removeCustomMetadata"
        placeholder="Enter identity"
      />

      <TextInputField
        label="Key"
        inputId="keyInput_removeCustomMetadata"
        placeholder="Enter key"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_removeCustomMetadata"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_removeCustomMetadata"
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
