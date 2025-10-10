"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { useStakingSignatureBuilder } from "@/utils/SignatureBuilder/useStakingSignatureBuilder";
import { TitleAndLink } from "@/components/SigConstructors/InputsAndModules/TitleAndLink";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { StakingActionSelector } from "../InputsAndModules/StakingActionSelector";
// ...existing code...
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { DataDisplayWithClear } from "../InputsAndModules/DataDisplayWithClear";
import { tokenAddress } from "@/constants/address";
import { executePublicStaking } from "@/utils/TransactionExecuter/useStakingTransactionExecuter";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import {
  PayInputData,
  PublicStakingInputData,
} from "@/utils/TypeInputStructures";

type InputData = {
  PublicStakingInputData: PublicStakingInputData;
  PayInputData: PayInputData;
};

interface PublicStakingComponentProps {
  evvmID: string;
  stakingAddress: string;
}

export const PublicStakingComponent = ({ evvmID, stakingAddress }: PublicStakingComponentProps) => {
  const { signPublicStaking } = useStakingSignatureBuilder();
  const [isStaking, setIsStaking] = React.useState(true);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InputData | null>(null);

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const formData = {
      evvmID: evvmID,
  stakingAddress: stakingAddress,
      nonceEVVM: getValue("nonceEVVMInput_PublicStaking"),
      nonceStaking: getValue("nonceStakingInput_PublicStaking"),
      amountOfStaking: Number(getValue("amountOfStakingInput_PublicStaking")),
      priorityFee: getValue("priorityFeeInput_PublicStaking"),
    };

    if (!formData.stakingAddress) {
      alert("Please enter a staking address");
      return;
    }

    const amountOfToken =
      BigInt(formData.amountOfStaking) *
      (BigInt(5083) * BigInt(10) ** BigInt(18));

    // Sign message
    signPublicStaking(
      BigInt(formData.evvmID),
      formData.stakingAddress as `0x${string}`,
      isStaking,
      BigInt(formData.amountOfStaking),
      BigInt(formData.nonceStaking),
      amountOfToken,
      BigInt(formData.priorityFee),
      BigInt(formData.nonceEVVM),
      priority === "high",
      (paySignature: string, stakingSignature: string) => {
        setDataToGet({
          PublicStakingInputData: {
            isStaking: isStaking,
            user: walletData.address as `0x${string}`,
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
      (error: Error) => console.error("Error signing presale staking:", error)
    );
  };

  const execute = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }

    const stakingAddress = dataToGet.PayInputData.to_address;

    executePublicStaking(dataToGet.PublicStakingInputData, stakingAddress)
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
        title="Public Staking"
        link="https://www.evvm.info/docs/SignatureStructures/Staking/PublicServiceStakingStructure"
      />
      <br />

      {/* EVVM ID is now passed as a prop */}


      {/* stakingAddress is now passed as a prop */}

      {/* Configuration Section */}
      <StakingActionSelector onChange={setIsStaking} />

      {/* Nonce Generators */}
      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_PublicStaking"
        placeholder="Enter nonce"
      />

      <NumberInputWithGenerator
        label="staking Nonce"
        inputId="nonceStakingInput_PublicStaking"
        placeholder="Enter nonce"
      />

      {/* Amount Inputs */}
      <NumberInputField
        label="Amount of staking"
        inputId="amountOfStakingInput_PublicStaking"
        placeholder="Enter amount of staking"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_PublicStaking"
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
