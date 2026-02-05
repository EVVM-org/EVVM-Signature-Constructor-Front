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
  IFlushUsernameData,
  NameService,
  EVVM,
  type ISerializableSignedAction,
} from "@evvm/evvm-js";

type InfoData = {
  IPayData: ISerializableSignedAction<IPayData>;
  IFlushUsernameData: ISerializableSignedAction<IFlushUsernameData>;
};

interface FlushUsernameComponentProps {
  nameServiceAddress: string;
}

export const FlushUsernameComponent = ({
  nameServiceAddress,
}: FlushUsernameComponentProps) => {
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);

  const getValue = (id: string) =>
    (document.getElementById(id) as HTMLInputElement).value;

  const makeSig = async () => {
    const formData = {
      addressNameService: nameServiceAddress,
      nonceNameService: getValue("nonceNameServiceInput_flushUsername"),
      username: getValue("usernameInput_flushUsername"),
      priorityFee_EVVM: getValue("priorityFeeInput_flushUsername"),
      nonce_EVVM: getValue("nonceEVVMInput_flushUsername"),
      priorityFlag_EVVM: priority === "high",
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

      const priceToFlushUsername = await readContract(config, {
        abi: NameServiceABI,
        address: formData.addressNameService as `0x${string}`,
        functionName: "getPriceToFlushUsername",
        args: [formData.username],
      });
      if (!priceToFlushUsername) {
        console.error("Price to remove custom metadata is not available");
        return;
      }

      // Sign EVVM payment first
      const payAction = await evvmService.pay({
        to: formData.addressNameService,
        tokenAddress: "0x0000000000000000000000000000000000000001" as `0x${string}`,
        amount: priceToFlushUsername as bigint,
        priorityFee: BigInt(formData.priorityFee_EVVM),
        nonce: BigInt(formData.nonce_EVVM),
        priorityFlag: formData.priorityFlag_EVVM,
        executor: formData.addressNameService as `0x${string}`,
      });

      // Sign flush username action
      const flushUsernameAction = await nameServiceService.flushUsername({
        user: signer.address,
        username: formData.username,
        nonce: BigInt(formData.nonceNameService),
        evvmSignedAction: payAction,
      });

      setDataToGet({
        IPayData: payAction.toJSON(),
        IFlushUsernameData: flushUsernameAction.toJSON(),
      });
    } catch (error) {
      console.error("Error creating signature:", error);
    }
  };

  const executeAction = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }

    try {
      const signer = await getEvvmSigner();
      await execute(signer, dataToGet.IFlushUsernameData);
      console.log("Flush username executed successfully");
      setDataToGet(null);
    } catch (error) {
      console.error("Error executing flush username:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Delete Username"
        link="https://www.evvm.info/docs/SignatureStructures/NameService/flushUsernameStructure"
      />
      <br />
      <p>
        This function deletes all metadata associated with a username but does
        not remove the offers made on that username.
      </p>
      <br />

      {/* Nonce section with automatic generator */}

      <NumberInputWithGenerator
        label="NameService Nonce"
        inputId="nonceNameServiceInput_flushUsername"
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

      {/* Priority configuration */}
      <PrioritySelector onPriorityChange={setPriority} />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_flushUsername"
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
