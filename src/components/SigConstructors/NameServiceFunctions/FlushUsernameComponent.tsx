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
  FlushUsernameInputData,
  PayInputData,
} from "@/utils/TypeInputStructures";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import NameService from "@/constants/abi/NameService.json";
import { tokenAddress } from "@/constants/address";
import { executeFlushUsername } from "@/utils/TransactionExecuter";
import { HelperInfo } from "../InputsAndModules/HelperInfo";

type InfoData = {
  PayInputData: PayInputData;
  FlushUsernameInputData: FlushUsernameInputData;
};

interface FlushUsernameComponentProps {
  evvmID: string;
  nameServiceAddress: string;
}

export const FlushUsernameComponent = ({
  evvmID,
  nameServiceAddress,
}: FlushUsernameComponentProps) => {
  const { signFlushUsername } = useNameServiceSignatureBuilder();
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
      nonceNameService: getValue("nonceNameServiceInput_flushUsername"),
      username: getValue("usernameInput_flushUsername"),
      priorityFee_EVVM: getValue("priorityFeeInput_flushUsername"),
      nonce_EVVM: getValue("nonceEVVMInput_flushUsername"),
      priorityFlag_EVVM: priority === "high",
    };

    readContract(config, {
      abi: NameService.abi,
      address: formData.addressNameService as `0x${string}`,
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
          BigInt(formData.evvmId),
          formData.addressNameService as `0x${string}`,
          formData.username,
          BigInt(formData.nonceNameService),
          priceToFlushUsername as bigint,
          BigInt(formData.priorityFee_EVVM),
          BigInt(formData.nonce_EVVM),
          formData.priorityFlag_EVVM,
          (paySignature, flushUsernameSignature) => {
            setDataToGet({
              PayInputData: {
                from: walletData.address as `0x${string}`,
                to_address: formData.addressNameService as `0x${string}`,
                to_identity: "",
                token: tokenAddress.mate as `0x${string}`,
                amount: priceToFlushUsername as bigint,
                priorityFee: BigInt(formData.priorityFee_EVVM),
                nonce: BigInt(formData.nonce_EVVM),
                priority: formData.priorityFlag_EVVM,
                executor: formData.addressNameService as `0x${string}`,
                signature: paySignature,
              },
              FlushUsernameInputData: {
                user: walletData.address as `0x${string}`,
                username: formData.username,
                nonce: BigInt(formData.nonceNameService),
                signature: flushUsernameSignature,
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

    executeFlushUsername(dataToGet.FlushUsernameInputData, nameServiceAddress)
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
        title="Delete Username"
        link="https://www.evvm.info/docs/SignatureStructures/NameService/flushUsernameStructure"
      />

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
        onExecute={execute}
      />
    </div>
  );
};
