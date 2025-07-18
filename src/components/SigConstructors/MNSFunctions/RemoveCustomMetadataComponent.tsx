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
  RemoveCustomMetadataInputData,
  PayInputData,
} from "@/utils/TypeInputStructures";
import MateNameService from "@/constants/abi/MateNameService.json";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import { executeRemoveCustomMetadata } from "@/utils/TransactionExecuter";
import { contractAddress, tokenAddress } from "@/constants/address";

type InfoData = {
  PayInputData: PayInputData;
  RemoveCustomMetadataInputData: RemoveCustomMetadataInputData;
};

export const RemoveCustomMetadataComponent = () => {
  const { signRemoveCustomMetadata } = useMnsSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);
  const [amountToRemoveCustomMetadata, setAmountToRemoveCustomMetadata] =
    React.useState<bigint | null>(null);

  const getValue = (id: string) =>
    (document.getElementById(id) as HTMLInputElement).value;

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const formData = {
      addressMNS: getValue("mnsAddressInput_removeCustomMetadata"),
      nonceMNS: getValue("nonceMNSInput_removeCustomMetadata"),
      identity: getValue("identityInput_removeCustomMetadata"),
      key: getValue("keyInput_removeCustomMetadata"),
      priorityFeeForFisher: getValue("priorityFeeInput_removeCustomMetadata"),
      nonceEVVM: getValue("nonceEVVMInput_removeCustomMetadata"),
      priorityFlag: priority === "high",
    };

    getPriceToRemoveCustomMetadata()
      .then(() => {
        signRemoveCustomMetadata(
          formData.addressMNS,
          BigInt(formData.nonceMNS),
          formData.identity,
          BigInt(formData.key),
          BigInt(
            amountToRemoveCustomMetadata
              ? amountToRemoveCustomMetadata
              : 5000000000000000000 * 10
          ),
          BigInt(formData.priorityFeeForFisher),
          BigInt(formData.nonceEVVM),
          formData.priorityFlag,
          (paySignature, removeCustomMetadataSignature) => {
            setDataToGet({
              PayInputData: {
                from: walletData.address as `0x${string}`,
                to_address: formData.addressMNS as `0x${string}`,
                to_identity: "",
                token: tokenAddress.mate as `0x${string}`,
                amount: BigInt(
                  amountToRemoveCustomMetadata
                    ? amountToRemoveCustomMetadata
                    : 5000000000000000000 * 10
                ),
                priorityFee: BigInt(formData.priorityFeeForFisher),
                nonce: BigInt(formData.nonceEVVM),
                priority: priority === "high",
                executor: formData.addressMNS as `0x${string}`,
                signature: paySignature,
              },
              RemoveCustomMetadataInputData: {
                user: walletData.address as `0x${string}`,
                nonce: BigInt(formData.nonceMNS),
                identity: formData.identity,
                key: BigInt(formData.key),
                priorityFeeForFisher: BigInt(formData.priorityFeeForFisher),
                signature: removeCustomMetadataSignature,
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

  const getPriceToRemoveCustomMetadata = async () => {
    let mnsAddress = getValue("mnsAddressInput_removeCustomMetadata");

    if (!mnsAddress) {
      setAmountToRemoveCustomMetadata(null);
    } else {
      await readContract(config, {
        abi: MateNameService.abi,
        address: mnsAddress as `0x${string}`,
        functionName: "getPriceToRemoveCustomMetadata",
        args: [],
      })
        .then((price) => {
          console.log("Price to add custom metadata:", price);
          setAmountToRemoveCustomMetadata(
            price ? BigInt(price.toString()) : null
          );
        })
        .catch((error) => {
          console.error("Error reading price to add custom metadata:", error);
          setAmountToRemoveCustomMetadata(null);
        });
    }
  };

  const execute = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }
    const mnsAddress = dataToGet.PayInputData.to_address;

    executeRemoveCustomMetadata(
      dataToGet.RemoveCustomMetadataInputData,
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
        title="Remove custom metadata of identity"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/removeCustomMetadataStructure"
      />

      <br />

      <AddressInputField
        label="MNS Address"
        inputId="mnsAddressInput_removeCustomMetadata"
        placeholder="Enter MNS address"
        defaultValue={
          contractAddress[account.chain?.id as keyof typeof contractAddress]
            ?.mns || ""
        }
      />

      <br />

      <NumberInputWithGenerator
        label="MNS Nonce"
        inputId="nonceMNSInput_removeCustomMetadata"
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
