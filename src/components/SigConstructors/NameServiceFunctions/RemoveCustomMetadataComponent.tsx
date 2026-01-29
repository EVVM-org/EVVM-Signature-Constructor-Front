"use client";
import React from "react";
import { config } from "@/config/index";
import { readContract } from "@wagmi/core";
import {
  TitleAndLink,
  NumberInputWithGenerator,
  PrioritySelector,
  DataDisplayWithClear,
  HelperInfo,
  NumberInputField,
  TextInputField,
} from "@/components/SigConstructors/InputsAndModules";
import { execute } from "@evvm/evvm-js";
import { getEvvmSigner, getCurrentChainId } from "@/utils/evvm-signer";
import { NameServiceABI } from "@evvm/evvm-js";
import {
  IPayData,
  IRemoveCustomMetadataData,
  NameService,
  EVVM,
  type ISerializableSignedAction,
} from "@evvm/evvm-js";

type InfoData = {
  IPayData: ISerializableSignedAction<IPayData>;
  IRemoveCustomMetadataData: ISerializableSignedAction<IRemoveCustomMetadataData>;
};

interface RemoveCustomMetadataComponentProps {
  nameServiceAddress: string;
}

export const RemoveCustomMetadataComponent = ({
  nameServiceAddress,
}: RemoveCustomMetadataComponentProps) => {
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);

  const getValue = (id: string) =>
    (document.getElementById(id) as HTMLInputElement).value;

  const makeSig = async () => {
    const formData = {
      addressNameService: nameServiceAddress,
      nonceNameService: getValue("nonceNameServiceInput_removeCustomMetadata"),
      identity: getValue("identityInput_removeCustomMetadata"),
      key: getValue("keyInput_removeCustomMetadata"),
      priorityFee_EVVM: getValue("priorityFeeInput_removeCustomMetadata"),
      nonceEVVM: getValue("nonceEVVMInput_removeCustomMetadata"),
      priorityFlag: priority === "high",
    };

    try {
      const signer = await getEvvmSigner();
      
      // Create EVVM service for payment
      const evvmService = new EVVM({
        signer,
        address: formData.addressNameService as `0x${string}`,
        chainId: getCurrentChainId(),
      });
      
      // Create NameService service
      const nameServiceService = new NameService({
        signer,
        address: formData.addressNameService as `0x${string}`,
        chainId: getCurrentChainId(),
      });

      const price = await readContract(config, {
        abi: NameServiceABI,
        address: formData.addressNameService as `0x${string}`,
        functionName: "getPriceToRemoveCustomMetadata",
        args: [],
      });
      if (!price) {
        console.error("Price to remove custom metadata is not available");
        return;
      }

      // Sign EVVM payment first
      const payAction = await evvmService.pay({
        to: formData.addressNameService,
        tokenAddress: "0x0000000000000000000000000000000000000001" as `0x${string}`,
        amount: price as bigint,
        priorityFee: BigInt(formData.priorityFee_EVVM),
        nonce: BigInt(formData.nonceEVVM),
        priorityFlag: formData.priorityFlag,
        executor: formData.addressNameService as `0x${string}`,
      });

      // Sign remove custom metadata action
      const removeCustomMetadataAction = await nameServiceService.removeCustomMetadata({
        user: signer.address,
        identity: formData.identity,
        key: BigInt(formData.key),
        nonce: BigInt(formData.nonceNameService),
        evvmSignedAction: payAction,
      });

      setDataToGet({
        IPayData: payAction.toJSON(),
        IRemoveCustomMetadataData: removeCustomMetadataAction.toJSON(),
      });
    } catch (error) {
      console.error("Error signing accept offer:", error);
    }
  };

  const executeAction = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }

    try {
      const signer = await getEvvmSigner();
      await execute(signer, dataToGet.IRemoveCustomMetadataData);
      console.log("Remove custom metadata executed successfully");
      setDataToGet(null);
    } catch (error) {
      console.error("Error executing remove custom metadata:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Remove custom metadata of identity"
        link="https://www.evvm.info/docs/SignatureStructures/NameService/removeCustomMetadataStructure"
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

      {/* Priority configuration */}
      <PrioritySelector onPriorityChange={setPriority} />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_removeCustomMetadata"
        placeholder="Enter nonce"
        showRandomBtn={priority !== "low"}
      />

      <div>
        {priority === "low" && (
          <HelperInfo label="How to find my sync nonce?">
            <div>
              You can retrieve your next sync nonce from the EVVM contract using
              the <code>getNextCurrentSyncNonce</code> function.
            </div>
          </HelperInfo>
        )}
      </div>

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
        onExecute={executeAction}
      />
    </div>
  );
};
