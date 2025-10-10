"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { useStakingSignatureBuilder } from "@/utils/SignatureBuilder/useStakingSignatureBuilder";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { DataDisplayWithClear } from "../InputsAndModules/DataDisplayWithClear";
import { StakingActionSelector } from "../InputsAndModules/StakingActionSelector";
import { contractAddress, tokenAddress } from "@/constants/address";
import { executeGoldenStaking } from "@/utils/TransactionExecuter/useStakingTransactionExecuter";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import {
  GoldenStakingInputData,
  PayInputData,
} from "@/utils/TypeInputStructures";

type InfoData = {
  PayInputData: PayInputData;
  GoldenStakingInputData: GoldenStakingInputData;
};

interface GoldenStakingComponentProps {
  evvmID: string;
  stakingAddress: string;
}

export const GoldenStakingComponent = ({ evvmID, stakingAddress }: GoldenStakingComponentProps) => {
  let account = getAccount(config);
  const { signGoldenStaking } = useStakingSignatureBuilder();
  const [isStaking, setIsStaking] = React.useState(true);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;


    const formData = {
      evvmID: evvmID,
      nonce: getValue("nonceInput_GoldenStaking"),
      stakingAddress: stakingAddress,
      amountOfStaking: Number(getValue("amountOfStakingInput_GoldenStaking")),
    };

    const amountOfToken =
      BigInt(formData.amountOfStaking) *
      (BigInt(5083) * BigInt(10) ** BigInt(18));

    // Sign and set data
    signGoldenStaking(
      BigInt(formData.evvmID),
      formData.stakingAddress as `0x${string}`,
      amountOfToken,
      BigInt(formData.nonce),
      priority === "high",
      (signaturePay: string) => {
        setDataToGet({
          PayInputData: {
            from: walletData.address as `0x${string}`,
            to_address: formData.stakingAddress as `0x${string}`,
            to_identity: "",
            token: tokenAddress.mate as `0x${string}`,
            amount: amountOfToken,
            priorityFee: BigInt(0),
            nonce: BigInt(formData.nonce),
            priority: priority === "high",
            executor: formData.stakingAddress as `0x${string}`,
            signature: signaturePay,
          },
          GoldenStakingInputData: {
            isStaking: isStaking,
            amountOfStaking: BigInt(formData.amountOfStaking),
            signature_EVVM: signaturePay,
          },
        } as InfoData);
      }
    );
  };

  const execute = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }
    const stakingAddress = dataToGet.PayInputData.to_address;

    executeGoldenStaking(dataToGet.GoldenStakingInputData, stakingAddress)
      .then(() => {
        console.log("Golden staking executed successfully");
      })
      .catch((error) => {
        console.error("Error executing golden staking:", error);
      });
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <h1>Golden staking</h1>
      <br />

      {/* EVVM ID is now passed as a prop */}


      {/* stakingAddress is now passed as a prop */}

      {/* Configuration Section */}
      <StakingActionSelector onChange={setIsStaking} />

      {/* Nonce section with automatic generator */}

      <NumberInputWithGenerator
        label="Nonce"
        inputId="nonceInput_GoldenStaking"
        placeholder="Enter nonce"
      />

      {/* Basic input fields */}
      <NumberInputField
        label="Amount of sMATE"
        inputId="amountOfStakingInput_GoldenStaking"
        placeholder="Enter amount of sMATE"
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

      {/* Results section */}
      <DataDisplayWithClear
        dataToGet={dataToGet}
        onClear={() => setDataToGet(null)}
        onExecute={execute}
      />
    </div>
  );
};
