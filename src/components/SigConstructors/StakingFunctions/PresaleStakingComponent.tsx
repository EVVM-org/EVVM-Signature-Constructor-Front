"use client";
import React from "react";
import { useStakingSignatureBuilder } from "@/utils/SignatureBuilder/useStakingSignatureBuilder";
import { TitleAndLink } from "@/components/SigConstructors/InputsAndModules/TitleAndLink";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { StakingActionSelector } from "../InputsAndModules/StakingActionSelector";
import { DataDisplayWithClear } from "../InputsAndModules/DataDisplayWithClear";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { executePresaleStaking } from "@/utils/TransactionExecuter/useStakingTransactionExecuter";
import { contractAddress, tokenAddress } from "@/constants/address";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import {
  PayInputData,
  PresaleStakingInputData,
} from "@/utils/TypeInputStructures";

type InputData = {
  PresaleStakingInputData: PresaleStakingInputData;
  PayInputData: PayInputData;
};

interface PresaleStakingComponentProps {
  evvmID: string;
  stakingAddress: string;
}

export const PresaleStakingComponent = ({ evvmID, stakingAddress }: PresaleStakingComponentProps) => {
  const { signPresaleStaking } = useStakingSignatureBuilder();

  const [isStaking, setIsStaking] = React.useState(true);
  const [priority, setPriority] = React.useState("low");

  const [dataToGet, setDataToGet] = React.useState<InputData | null>(null);

  let account = getAccount(config);

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const formData = {
      evvmID: evvmID,
      stakingAddress: stakingAddress,
      priorityFee_EVVM: getValue("priorityFeeInput_presaleStaking"),
      nonce_EVVM: getValue("nonceEVVMInput_presaleStaking"),
      nonce: getValue("nonceStakingInput_presaleStaking"),
      priorityFlag_EVVM: priority === "high",
    };

    const amountOfToken = (1 * 10 ** 18).toLocaleString(
      "fullwide",
      {
        useGrouping: false,
      }
    );

    signPresaleStaking(
      BigInt(formData.evvmID),
      formData.stakingAddress as `0x${string}`,
      isStaking,
      BigInt(formData.nonce),
      BigInt(formData.priorityFee_EVVM),
      BigInt(amountOfToken),
      BigInt(formData.nonce_EVVM),
      formData.priorityFlag_EVVM,
      (paySignature: string, stakingSignature: string) => {
        setDataToGet({
          PresaleStakingInputData: {
            isStaking: isStaking,
            user: walletData.address as `0x${string}`,
            nonce: BigInt(formData.nonce),
            signature: stakingSignature,
            priorityFee_EVVM: BigInt(formData.priorityFee_EVVM),
            priorityFlag_EVVM: priority === "high",
            nonce_EVVM: BigInt(formData.nonce_EVVM),
            signature_EVVM: paySignature,
          },
          PayInputData: {
            from: walletData.address as `0x${string}`,
            to_address: formData.stakingAddress as `0x${string}`,
            to_identity: "",
            token: tokenAddress.mate as `0x${string}`,
            amount: BigInt(amountOfToken),
            priorityFee: BigInt(formData.priorityFee_EVVM),
            nonce: BigInt(formData.nonce_EVVM),
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

    executePresaleStaking(dataToGet.PresaleStakingInputData, stakingAddress)
      .then(() => {
        console.log("Presale staking executed successfully");
      })
      .catch((error) => {
        console.error("Error executing presale staking:", error);
      });
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Presale Staking"
        link="https://www.evvm.org/docs/SignatureStructures/SMate/StakingUnstakingStructure"
      />
      <br />

      {/* EVVM ID is now passed as a prop */}


      {/* stakingAddress is now passed as a prop */}

      {/* Configuration Section */}
      <StakingActionSelector onChange={setIsStaking} />

      {/* Nonce Generators */}

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_presaleStaking"
        placeholder="Enter nonce"
      />

      <NumberInputWithGenerator
        label="staking Nonce"
        inputId="nonceStakingInput_presaleStaking"
        placeholder="Enter nonce"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_presaleStaking"
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
