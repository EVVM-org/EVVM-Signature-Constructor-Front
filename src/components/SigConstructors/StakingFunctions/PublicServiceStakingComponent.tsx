"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { useStakingSignatureBuilder } from "@/utils/SignatureBuilder/useStakingSignatureBuilder";
import { TitleAndLink } from "@/components/SigConstructors/InputsAndModules/TitleAndLink";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { StakingActionSelector } from "../InputsAndModules/StakingActionSelector";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { DataDisplayWithClear } from "../InputsAndModules/DataDisplayWithClear";
import { contractAddress, tokenAddress } from "@/constants/address";
import { executePublicServiceStaking } from "@/utils/TransactionExecuter/useStakingTransactionExecuter";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import {
  PayInputData,
  PublicServiceStakingInputData,
} from "@/utils/TypeInputStructures";

type InputData = {
  PublicServiceStakingInputData: PublicServiceStakingInputData;
  PayInputData: PayInputData;
};

export const PublicServiceStakingComponent = () => {
  let account = getAccount(config);
  const { signPublicServiceStaking } = useStakingSignatureBuilder();
  const [isStaking, setIsStaking] = React.useState(true);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InputData | null>(null);

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const formData = {
      evvmID: getValue("evvmIDInput_PublicServiceStaking"),
      stakingAddress: getValue("stakingAddressInput_PublicServiceStaking"),
      serviceAddress: getValue("serviceAddressInput_PublicServiceStaking"),
      amountOfStaking: Number(
        getValue("amountOfStakingInput_PublicServiceStaking")
      ),
      priorityFee: getValue("priorityFeeInput_PublicServiceStaking"),
      nonceEVVM: getValue("nonceEVVMInput_PublicServiceStaking"),
      nonceStaking: getValue("nonceStakingInput_PublicServiceStaking"),
    };

    const amountOfToken = (formData.amountOfStaking * 10 ** 18).toLocaleString(
      "fullwide",
      {
        useGrouping: false,
      }
    );

    signPublicServiceStaking(
      BigInt(formData.evvmID),
      formData.stakingAddress as `0x${string}`,
      formData.serviceAddress,
      isStaking,
      BigInt(formData.amountOfStaking),
      BigInt(formData.nonceStaking),
      BigInt(formData.priorityFee),
      BigInt(formData.nonceEVVM),
      priority === "high",
      (paySignature: string, stakingSignature: string) => {
        setDataToGet({
          PublicServiceStakingInputData: {
            isStaking: isStaking,
            user: walletData.address as `0x${string}`,
            service: formData.serviceAddress as `0x${string}`,
            nonce: BigInt(formData.nonceStaking),
            amountOfStaking: BigInt(formData.amountOfStaking),
            signature: stakingSignature,
            priorityFee_EVVM: BigInt(formData.priorityFee),
            priorityFlag_EVVM: priority === "high",
            nonce_EVVM: BigInt(formData.nonceEVVM),
            signature_EVVM: paySignature,
          },
          PayInputData: {
            from: walletData.address as `0x${string}`,
            to_address: formData.stakingAddress as `0x${string}`,
            to_identity: "",
            token: tokenAddress.mate as `0x${string}`,
            amount: BigInt(amountOfToken),
            priorityFee: BigInt(formData.priorityFee),
            nonce: BigInt(formData.nonceEVVM),
            priority: priority === "high",
            executor: formData.stakingAddress as `0x${string}`,
            signature: paySignature,
          },
        });
      },
      (error) => console.error("Error signing presale staking:", error)
    );
  };

  const execute = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }

    const stakingAddress = dataToGet.PayInputData.to_address;

    executePublicServiceStaking(
      dataToGet.PublicServiceStakingInputData,
      stakingAddress
    )
      .then(() => {
        console.log("Public staking executed successfully");
      })
      .catch((error) => {
        console.error("Error executing public staking:", error);
      });
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Service Staking"
        link="https://www.evvm.org/docs/SignatureStructures/SMate/StakingUnstakingStructure"
      />
      <br />

      {/* EVVM ID Input */}
      <NumberInputField
        label="EVVM ID"
        inputId="evvmIDInput_PublicServiceStaking"
        placeholder="Enter EVVM ID"
      />

      {/* Address Input */}
      <AddressInputField
        label="staking Address"
        inputId="stakingAddressInput_PublicServiceStaking"
        placeholder="Enter staking address"
        defaultValue={
          contractAddress[account.chain?.id as keyof typeof contractAddress]
            ?.staking || ""
        }
      />
      <br />

      {/* Configuration Section */}
      <StakingActionSelector onChange={setIsStaking} />

      <AddressInputField
        label="Service Address"
        inputId="serviceAddressInput_PublicServiceStaking"
        placeholder="Enter service address"
      />

      {/* Nonce Generators */}

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_PublicServiceStaking"
        placeholder="Enter nonce"
      />

      <NumberInputWithGenerator
        label="staking Nonce"
        inputId="nonceStakingInput_PublicServiceStaking"
        placeholder="Enter nonce"
      />

      {/* Amount Inputs */}
      <NumberInputField
        label="Amount of staking"
        inputId="amountOfStakingInput_PublicServiceStaking"
        placeholder="Enter amount of staking"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_PublicServiceStaking"
        placeholder="Enter priority fee"
      />

      {/* Priority Selection */}
      <PrioritySelector onPriorityChange={setPriority} />

      {/* Action Button */}
      <button
        onClick={makeSig}
        style={{
          padding: "0.5rem 1rem",
          marginTop: "1rem",
          backgroundColor: "#50aad4",
          color: "white",
          border: "none",
        }}
      >
        Create Signature
      </button>

      {/* Results Section */}
      <DataDisplayWithClear
        dataToGet={dataToGet}
        onClear={() => setDataToGet(null)}
        onExecute={execute}
      />
    </div>
  );
};
