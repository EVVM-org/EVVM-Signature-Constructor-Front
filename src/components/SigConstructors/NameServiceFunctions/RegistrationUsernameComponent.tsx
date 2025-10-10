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
import { PayInputData } from "@/utils/TypeInputStructures/evvmTypeInputStructure";
import { RegistrationUsernameInputData } from "@/utils/TypeInputStructures/nameServiceTypeInputStructure";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import { contractAddress, tokenAddress } from "@/constants/address";
import NameService from "@/constants/abi/NameService.json";
import Evvm from "@/constants/abi/Evvm.json";
import { executeRegistrationUsername } from "@/utils/TransactionExecuter/useNameServiceTransactionExecuter";

type InfoData = {
  PayInputData: PayInputData;
  RegistrationUsernameInputData: RegistrationUsernameInputData;
};

export const RegistrationUsernameComponent = () => {
  const { signRegistrationUsername } = useNameServiceSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);
  const [rewardAmount, setRewardAmount] = React.useState<bigint | null>(
    null
  );

  const getValue = (id: string) =>
    (document.getElementById(id) as HTMLInputElement).value;

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const formData = {
      evvmID: getValue("evvmIDInput_registrationUsername"),
      addressNameService: getValue("nameServiceAddressInput_registrationUsername"),
      nonceNameService: getValue("nonceNameServiceInput_registrationUsername"),
      username: getValue("usernameInput_registrationUsername"),
      clowNumber: getValue("clowNumberInput_registrationUsername"),
      priorityFee_EVVM: getValue("priorityFeeInput_registrationUsername"),
      nonceEVVM: getValue("nonceEVVMInput_registrationUsername"),
      priorityFlag: priority === "high",
    };

    readRewardAmount()
      .then(() => {
        signRegistrationUsername(
          BigInt(formData.evvmID),
          formData.addressNameService as `0x${string}`,
          formData.username,
          BigInt(formData.clowNumber),
          BigInt(formData.nonceNameService),
          rewardAmount as bigint,
          BigInt(formData.priorityFee_EVVM),
          BigInt(formData.nonceEVVM),
          formData.priorityFlag,
          (paySignature: string, registrationUsernameSignature: string) => {
            setDataToGet({
              PayInputData: {
                from: walletData.address as `0x${string}`,
                to_address: formData.addressNameService as `0x${string}`,
                to_identity: "",
                token: tokenAddress.mate as `0x${string}`,
                amount: BigInt(rewardAmount as bigint) * BigInt(100),
                priorityFee: BigInt(formData.priorityFee_EVVM),
                nonce: BigInt(formData.nonceEVVM),
                priority: priority === "high",
                executor: formData.addressNameService as `0x${string}`,
                signature: paySignature,
              },
              RegistrationUsernameInputData: {
                user: walletData.address as `0x${string}`,
                nonce: BigInt(formData.nonceNameService),
                username: formData.username,
                clowNumber: BigInt(formData.clowNumber),
                signature: registrationUsernameSignature,
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

  const readRewardAmount = async () => {
    let nameServiceAddress = getValue("nameServiceAddressInput_registration");

    if (!nameServiceAddress) {
      setRewardAmount(null);
    } else {
      await readContract(config, {
        abi: NameService.abi,
        address: nameServiceAddress as `0x${string}`,
        functionName: "getEvvmAddress",
        args: [],
      })
        .then((evvmAddress) => {
          if (!evvmAddress) {
            setRewardAmount(null);
          }

          readContract(config, {
            abi: Evvm.abi,
            address: evvmAddress as `0x${string}`,
            functionName: "getRewardAmount",
            args: [],
          })
            .then((reward) => {
              console.log("Mate reward amount:", reward);
              setRewardAmount(
                reward ? BigInt(reward.toString()) : null
              );
            })
            .catch((error) => {
              console.error("Error reading mate reward amount:", error);
              setRewardAmount(null);
            });
        })
        .catch((error) => {
          console.error("Error reading NameService address:", error);
          setRewardAmount(null);
        });
    }
  };

  const execute = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }
    const nameServiceAddress = dataToGet.PayInputData.to_address;

    executeRegistrationUsername(
      dataToGet.RegistrationUsernameInputData,
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
        title="Registration of username"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/registrationUsernameStructure"
      />

      <br />

      <AddressInputField
        label="NameService Address"
        inputId="nameServiceAddressInput_registrationUsername"
        placeholder="Enter NameService address"
        defaultValue={
          contractAddress[account.chain?.id as keyof typeof contractAddress]
            ?.nameService || ""
        }
      />

      <br />

      {/* Nonce section with automatic generator */}

      <NumberInputWithGenerator
        label="NameService Nonce"
        inputId="nonceNameServiceInput_registrationUsername"
        placeholder="Enter nonce"
      />

      <NumberInputField
        label="Clow Number"
        inputId="clowNumberInput_registrationUsername"
        placeholder="Enter clow number"
      />

      <TextInputField
        label="Username"
        inputId="usernameInput_registrationUsername"
        placeholder="Enter username"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_registrationUsername"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_registrationUsername"
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
