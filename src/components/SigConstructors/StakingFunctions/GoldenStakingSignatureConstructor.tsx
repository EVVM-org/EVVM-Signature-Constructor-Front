"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { useSMateSignatureBuilder } from "@/utils/SignatureBuilder/useSMateSignatureBuilder";
import { DetailedData } from "@/components/SigConstructors/InputsAndModules/DetailedData";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { DataDisplayWithClear } from "../InputsAndModules/DataDisplayWithClear";
import { StakingActionSelector } from "../InputsAndModules/StakingActionSelector";
import { PayInputData } from "@/utils/TypeStructures/evvmTypeInputStructure";
import { GoldenStakingInputData } from "@/utils/TypeStructures/sMateTypeInputStructure";
import { contractAddress, tokenAddress } from "@/constants/address";
import { executeGoldenStaking } from "@/utils/TransactionExecuter/useSMateTransactionExecuter";

type InfoData = {
  PayInputData: PayInputData;
  GoldenStakingInputData: GoldenStakingInputData;
};

export const GoldenStakingSignatureConstructor = () => {
  let account = getAccount(config);
  const { signGoldenStaking } = useSMateSignatureBuilder();
  const [isStaking, setIsStaking] = React.useState(true);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);

  const makeSig = async () => {
    // Get form values
    let walletData = getAccount(config);

    if (!walletData.address) {
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        console.error("Account address is undefined, retrying...");
        walletData = getAccount(config);
        if (walletData.address || attempts >= 10) {
          clearInterval(interval);
        }
      }, 200);
    }

    if (!walletData.address) {
      console.error("Account address is still undefined after retries");
      return;
    }

    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const nonce = getValue("nonceInput_GoldenStaking");
    const sMateAddress = getValue("sMateAddressInput_GoldenStaking");
    const amountStaking = Number(getValue("amountOfSMateInput_GoldenStaking"));
    const amountToken =
      BigInt(getValue("amountOfSMateInput_GoldenStaking")) *
      (BigInt(5083) * BigInt(10) ** BigInt(18));

    // Sign and set data
    signGoldenStaking(
      sMateAddress,
      amountStaking,
      nonce,
      priority === "high",
      (signature) => {
        setDataToGet({
          PayInputData: {
            from: walletData.address as `0x${string}`,
            to_address: sMateAddress as `0x${string}`,
            to_identity: "",
            token: tokenAddress.mate as `0x${string}`,
            amount: amountToken,
            priorityFee: BigInt(0),
            nonce: BigInt(nonce),
            priority: priority === "high",
            executor: sMateAddress as `0x${string}`,
            signature,
          },
          GoldenStakingInputData: {
            isStaking: isStaking,
            amountOfSMate: BigInt(amountStaking),
            signature,
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
    const sMateAddress = dataToGet.PayInputData.to_address;

    executeGoldenStaking(dataToGet.GoldenStakingInputData, sMateAddress)
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

      {/* Recipient configuration section */}
      <AddressInputField
        label="sMate Address"
        inputId="sMateAddressInput_GoldenStaking"
        placeholder="Enter sMate address"
        defaultValue={
          (account.chain?.id && contractAddress[account.chain.id as keyof typeof contractAddress]?.sMate) || ""
        }
      />
      <br />

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
        inputId="amountOfSMateInput_GoldenStaking"
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
