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
import { PayInputData } from "@/utils/TypeInputStructures/evvmTypeInputStructure";
import { RegistrationUsernameInputData } from "@/utils/TypeInputStructures/mnsTypeInputStructure";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import { contractAddress, tokenAddress } from "@/constants/address";
import MateNameService from "@/constants/abi/MateNameService.json";
import Evvm from "@/constants/abi/Evvm.json";
import { executeRegistrationUsername } from "@/utils/TransactionExecuter/useMNSTransactionExecuter";

type InfoData = {
  PayInputData: PayInputData;
  RegistrationUsernameInputData: RegistrationUsernameInputData;
};

export const RegistrationUsernameComponent = () => {
  const { signRegistrationUsername } = useMnsSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);
  const [mateRewardAmount, setMateRewardAmount] = React.useState<bigint | null>(
    null
  );

  const getValue = (id: string) =>
    (document.getElementById(id) as HTMLInputElement).value;

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const formData = {
      addressMNS: getValue("mnsAddressInput_registration"),
      nonceMNS: getValue("nonceMNSInput_registration"),
      username: getValue("usernameInput_registration"),
      clowNumber: getValue("clowNumberInput_registration"),
      priorityFeeForFisher: getValue("priorityFeeInput_registration"),
      nonceEVVM: getValue("nonceEVVMInput_registration"),
      priorityFlag: priority === "high",
    };

    readMateRewardAmount()
      .then(() => {
        signRegistrationUsername(
          formData.addressMNS,
          BigInt(formData.nonceMNS),
          formData.username,
          BigInt(formData.clowNumber),
          mateRewardAmount
            ? BigInt(mateRewardAmount)
            : BigInt(5000000000000000000),
          BigInt(formData.priorityFeeForFisher),
          BigInt(formData.nonceEVVM),
          formData.priorityFlag,
          (paySignature, registrationSignature) => {
            setDataToGet({
              PayInputData: {
                from: walletData.address as `0x${string}`,
                to_address: formData.addressMNS as `0x${string}`,
                to_identity: "",
                token: tokenAddress.mate as `0x${string}`,
                amount: (mateRewardAmount as bigint) * BigInt(100),
                priorityFee: BigInt(formData.priorityFeeForFisher),
                nonce: BigInt(formData.nonceEVVM),
                priority: priority === "high",
                executor: formData.addressMNS as `0x${string}`,
                signature: paySignature,
              },
              RegistrationUsernameInputData: {
                user: walletData.address as `0x${string}`,
                nonce: BigInt(formData.nonceMNS),
                username: formData.username,
                clowNumber: BigInt(formData.clowNumber),
                signature: registrationSignature,
                priorityFeeForFisher: BigInt(formData.priorityFeeForFisher),
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

  const readMateRewardAmount = async () => {
    let mnsAddress = getValue("mnsAddressInput_registration");

    if (!mnsAddress) {
      setMateRewardAmount(null);
    } else {
      await readContract(config, {
        abi: MateNameService.abi,
        address: mnsAddress as `0x${string}`,
        functionName: "getEvvmAddress",
        args: [],
      })
        .then((evvmAddress) => {
          if (!evvmAddress) {
            setMateRewardAmount(null);
          }

          readContract(config, {
            abi: Evvm.abi,
            address: evvmAddress as `0x${string}`,
            functionName: "seeMateReward",
            args: [],
          })
            .then((mateReward) => {
              console.log("Mate reward amount:", mateReward);
              setMateRewardAmount(
                mateReward ? BigInt(mateReward.toString()) : null
              );
            })
            .catch((error) => {
              console.error("Error reading mate reward amount:", error);
              setMateRewardAmount(null);
            });
        })
        .catch((error) => {
          console.error("Error reading MNS address:", error);
          setMateRewardAmount(null);
        });
    }
  };

  const execute = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }
    const mnsAddress = dataToGet.PayInputData.to_address;

    executeRegistrationUsername(
      dataToGet.RegistrationUsernameInputData,
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
        title="Registration of username"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/registrationUsernameStructure"
      />

      <br />

      <AddressInputField
        label="MNS Address"
        inputId="mnsAddressInput_registration"
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
        inputId="nonceMNSInput_registration"
        placeholder="Enter nonce"
      />

      <NumberInputField
        label="Clow Number"
        inputId="clowNumberInput_registration"
        placeholder="Enter clow number"
      />

      <TextInputField
        label="Username"
        inputId="usernameInput_registration"
        placeholder="Enter username"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_registration"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_registration"
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
