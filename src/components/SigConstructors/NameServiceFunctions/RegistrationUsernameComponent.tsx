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
import { tokenAddress } from "@/constants/address";
import NameService from "@/constants/abi/NameService.json";
import Evvm from "@/constants/abi/Evvm.json";
import { executeRegistrationUsername } from "@/utils/TransactionExecuter/useNameServiceTransactionExecuter";

type InfoData = {
  PayInputData: PayInputData;
  RegistrationUsernameInputData: RegistrationUsernameInputData;
};

interface RegistrationUsernameComponentProps {
  evvmID: string;
  nameServiceAddress: string;
}

export const RegistrationUsernameComponent = ({
  evvmID,
  nameServiceAddress,
}: RegistrationUsernameComponentProps) => {
  const { signRegistrationUsername } = useNameServiceSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);
  const [rewardAmount, setRewardAmount] = React.useState<bigint | null>(null);

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
      evvmId: BigInt(evvmID),
      addressNameService: nameServiceAddress,
      nonceNameService: BigInt(getValue("nonceNameServiceInput_registrationUsername")),
      username: getValue("usernameInput_registrationUsername"),
      clowNumber: BigInt(getValue("clowNumberInput_registrationUsername")),
      priorityFee_EVVM: BigInt(getValue("priorityFeeInput_registrationUsername")),
      nonceEVVM: BigInt(getValue("nonceEVVMInput_registrationUsername")),
      priorityFlag: priority === "high",
    };

    await readRewardAmount();

    readRewardAmount()
      .then(() => {
        signRegistrationUsername(
          {
            evvmId: formData.evvmId,
            addressNameService: formData.addressNameService as `0x${string}`,
            username: formData.username,
            clowNumber: formData.clowNumber,
            nonce: formData.nonceNameService,
            mateReward: rewardAmount as bigint,
            priorityFee_EVVM: formData.priorityFee_EVVM,
            nonce_EVVM: formData.nonceEVVM,
            priorityFlag_EVVM: formData.priorityFlag,
          },
          (paySignature: string, registrationUsernameSignature: string) => {
            setDataToGet({
              PayInputData: {
                from: walletData.address as `0x${string}`,
                to_address: formData.addressNameService as `0x${string}`,
                to_identity: "",
                token: tokenAddress.mate as `0x${string}`,
                amount: (rewardAmount ? rewardAmount * BigInt(100) : BigInt(0)),
                priorityFee: formData.priorityFee_EVVM,
                nonce: formData.nonceEVVM,
                priority: priority === "high",
                executor: formData.addressNameService as `0x${string}`,
                signature: paySignature,
              },
              RegistrationUsernameInputData: {
                user: walletData.address as `0x${string}`,
                nonce: formData.nonceNameService,
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
    // Use the prop directly instead of a missing input
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
              setRewardAmount(reward ? BigInt(reward.toString()) : null);
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
        link="https://www.evvm.info/docs/SignatureStructures/NameService/registrationUsernameStructure"
      />

      <br />

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

      

      {/* Priority configuration */}
      <PrioritySelector onPriorityChange={setPriority} />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_registrationUsername"
        placeholder="Enter nonce"
        showRandomBtn={priority !== "low"}
      />

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
