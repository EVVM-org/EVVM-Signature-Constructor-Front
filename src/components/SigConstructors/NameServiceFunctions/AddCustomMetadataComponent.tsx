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
  AddCustomMetadataInputData,
  PayInputData,
} from "@/utils/TypeInputStructures";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import { tokenAddress } from "@/constants/address";
import { executeAddCustomMetadata } from "@/utils/TransactionExecuter";
import NameService from "@/constants/abi/NameService.json";

type InfoData = {
  PayInputData: PayInputData;
  AddCustomMetadataInputData: AddCustomMetadataInputData;
};


interface AddCustomMetadataComponentProps {
  evvmID: string;
  nameServiceAddress: string;
}

export const AddCustomMetadataComponent = ({ evvmID, nameServiceAddress }: AddCustomMetadataComponentProps) => {
  const { signAddCustomMetadata } = useNameServiceSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);
  const [amountToAddCustomMetadata, setAmountToAddCustomMetadata] =
    React.useState<bigint | null>(null);

  const getValue = (id: string) => {
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (!el) {
      throw new Error(`Input element with id '${id}' not found. Ensure the input is rendered and the id is correct.`);
    }
    return el.value;
  };

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;


    const formData = {
      evvmId: evvmID,
      addressNameService: nameServiceAddress,
      nonceNameService: getValue("nonceNameServiceInput_addCustomMetadata"),
      identity: getValue("identityInput_addCustomMetadata"),
      schema: getValue("schemaInput_addCustomMetadata"),
      subschema: getValue("subschemaInput_addCustomMetadata"),
      value: getValue("valueInput_addCustomMetadata"),
      priorityFee_EVVM: getValue("priorityFeeInput_addCustomMetadata"),
      nonceEVVM: getValue("nonceEVVMInput_addCustomMetadata"),
      priorityFlag: priority === "high",
    };

    let valueCustomMetadata = `${formData.schema}:${formData.subschema}>${formData.value}`;

    getPriceToAddCustomMetadata()
      .then(() => {
        signAddCustomMetadata(
          BigInt(formData.evvmId),
          formData.addressNameService as `0x${string}`,
          BigInt(formData.nonceNameService),
          formData.identity,
          valueCustomMetadata,
          amountToAddCustomMetadata
            ? BigInt(amountToAddCustomMetadata)
            : BigInt(5000000000000000000 * 10),
          BigInt(formData.priorityFee_EVVM),
          BigInt(formData.nonceEVVM),
          formData.priorityFlag,
          (paySignature, addCustomMetadataSignature) => {
            setDataToGet({
              PayInputData: {
                from: walletData.address as `0x${string}`,
                to_address: formData.addressNameService as `0x${string}`,
                to_identity: "",
                token: tokenAddress.mate as `0x${string}`,
                amount: amountToAddCustomMetadata
                  ? BigInt(amountToAddCustomMetadata)
                  : BigInt(5000000000000000000 * 10),
                priorityFee: BigInt(formData.priorityFee_EVVM),
                nonce: BigInt(formData.nonceEVVM),
                priority: priority === "high",
                executor: formData.addressNameService as `0x${string}`,
                signature: paySignature,
              },
              AddCustomMetadataInputData: {
                user: walletData.address as `0x${string}`,
                identity: formData.identity,
                value: valueCustomMetadata,
                nonce: BigInt(formData.nonceNameService),
                signature: addCustomMetadataSignature,
                priorityFee_EVVM: BigInt(formData.priorityFee_EVVM),
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

  const getPriceToAddCustomMetadata = async () => {
    // Use nameServiceAddress from props, not input
    if (!nameServiceAddress) {
      setAmountToAddCustomMetadata(null);
    } else {
      await readContract(config, {
        abi: NameService.abi,
        address: nameServiceAddress as `0x${string}`,
        functionName: "getPriceToAddCustomMetadata",
        args: [],
      })
        .then((price) => {
          console.log("Price to add custom metadata:", price);
          setAmountToAddCustomMetadata(price ? BigInt(price.toString()) : null);
        })
        .catch((error) => {
          console.error("Error reading price to add custom metadata:", error);
          setAmountToAddCustomMetadata(null);
        });
    }
  };

  const execute = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }
    const nameServiceAddress = dataToGet.PayInputData.to_address;

    executeAddCustomMetadata(dataToGet.AddCustomMetadataInputData, nameServiceAddress)
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
        title="Add custom metadata of identity"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/addCustomMetadataStructure"
      />

      <br />






      <NumberInputWithGenerator
        label="NameService Nonce"
        inputId="nonceNameServiceInput_addCustomMetadata"
        placeholder="Enter nonce"
      />

      <TextInputField
        label="Identity"
        inputId="identityInput_addCustomMetadata"
        placeholder="Enter identity"
      />

      <TextInputField
        label="Schema"
        inputId="schemaInput_addCustomMetadata"
        placeholder="Enter schema"
      />

      <TextInputField
        label="Subschema"
        inputId="subschemaInput_addCustomMetadata"
        placeholder="Enter subschema"
      />

      <TextInputField
        label="Value"
        inputId="valueInput_addCustomMetadata"
        placeholder="Enter value"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_addCustomMetadata"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_addCustomMetadata"
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
