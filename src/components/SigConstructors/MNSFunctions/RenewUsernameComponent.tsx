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
import MateNameService from "@/constants/abi/MateNameService.json";
import {
  PayInputData,
  RenewUsernameInputData,
} from "@/utils/TypeInputStructures";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import { contractAddress, tokenAddress } from "@/constants/address";
import { executeRenewUsername } from "@/utils/TransactionExecuter";

type InfoData = {
  PayInputData: PayInputData;
  RenewUsernameInputData: RenewUsernameInputData;
};

export const RenewUsernameComponent = () => {
  const { signRenewUsername } = useMnsSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);
  const [amountToRenew, setAmountToRenew] = React.useState<bigint | null>(null);

  const getValue = (id: string) =>
    (document.getElementById(id) as HTMLInputElement).value;

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const formData = {
      addressMNS: getValue("mnsAddressInput_renewUsername"),
      nonceMNS: getValue("nonceMNSInput_renewUsername"),
      username: getValue("usernameInput_renewUsername"),
      amountToRenew: getValue("amountToRenew_renewUsername"),
      priorityFeeForFisher: getValue("priorityFeeInput_renewUsername"),
      nonceEVVM: getValue("nonceEVVMInput_renewUsername"),
      priorityFlag: priority === "high",
    };

    signRenewUsername(
      formData.addressMNS,
      BigInt(formData.nonceMNS),
      formData.username,
      BigInt(formData.amountToRenew),
      BigInt(formData.priorityFeeForFisher),
      BigInt(formData.nonceEVVM),
      formData.priorityFlag,
      (paySignature, renewUsernameSignature) => {
        setDataToGet({
          PayInputData: {
            from: walletData.address as `0x${string}`,
            to_address: formData.addressMNS as `0x${string}`,
            to_identity: "",
            token: tokenAddress.mate as `0x${string}`,
            amount: BigInt(formData.priorityFeeForFisher),
            priorityFee: BigInt(0),
            nonce: BigInt(formData.nonceEVVM),
            priority: priority === "high",
            executor: formData.addressMNS as `0x${string}`,
            signature: paySignature,
          },
          RenewUsernameInputData: {
            user: walletData.address as `0x${string}`,
            nonce: BigInt(formData.nonceMNS),
            username: formData.username,
            priorityFeeForFisher: BigInt(formData.priorityFeeForFisher),
            signature: renewUsernameSignature,
            nonce_Evvm: BigInt(formData.nonceEVVM),
            priority_Evvm: formData.priorityFlag,
            signature_Evvm: paySignature,
          },
        });
      },
      (error) => console.error("Error signing payment:", error)
    );
  };

  const readAmountToRenew = async () => {
    let mnsAddress = getValue("mnsAddressInput_renewUsername");

    if (!mnsAddress) {
      setAmountToRenew(null);
    } else {
      const username = getValue("usernameInput_renewUsername");
      try {
        const result = await readContract(config, {
          abi: MateNameService.abi,
          address: mnsAddress as `0x${string}`,
          functionName: "seePriceToRenew",
          args: [username],
        });
        console.log("Amount to renew:", result);
        setAmountToRenew(result ? BigInt(result.toString()) : null);
      } catch (error) {
        console.error("Error reading amount to renew:", error);
        setAmountToRenew(null);
      }
    }
  };

  const execute = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }
    const mnsAddress = dataToGet.PayInputData.to_address;

    executeRenewUsername(dataToGet.RenewUsernameInputData, mnsAddress)
      .then(() => {
        console.log("Renew username executed successfully");
      })
      .catch((error) => {
        console.error("Error executing renew username:", error);
      });
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    readAmountToRenew();
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Renewal of username"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/renewUsernameStructure"
      />

      <br />

      <AddressInputField
        label="MNS Address"
        inputId="mnsAddressInput_renewUsername"
        placeholder="Enter MNS address"
        defaultValue={
          contractAddress[account.chain?.id as keyof typeof contractAddress]
            ?.mns || ""
        }
      />

      <br />

      <NumberInputWithGenerator
        label="MNS Nonce"
        inputId="nonceMNSInput_renewUsername"
        placeholder="Enter nonce"
      />

      <TextInputField
        label="Username"
        inputId="usernameInput_renewUsername"
        placeholder="Enter username"
        onChange={handleUsernameChange}
      />

      <NumberInputField
        label="Amount to Renew"
        inputId="amountToRenew_renewUsername"
        placeholder="Enter amount to renew"
        defaultValue={amountToRenew !== null ? amountToRenew.toString() : ""}
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_renewUsername"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_renewUsername"
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
