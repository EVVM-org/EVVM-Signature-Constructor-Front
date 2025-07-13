"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { useSMateSignatureBuilder } from "@/utils/SignatureBuilder/useSMateSignatureBuilder";
import { TitleAndLink } from "@/components/SigConstructors/InputsAndModules/TitleAndLink";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { StakingActionSelector } from "../InputsAndModules/StakingActionSelector";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { DataDisplayWithClear } from "../InputsAndModules/DataDisplayWithClear";
import { PublicServiceStakingInputData } from "@/utils/TypeStructures/sMateTypeInputStructure";
import { PayInputData } from "@/utils/TypeStructures/evvmTypeInputStructure";
import { contractAddress, tokenAddress } from "@/constants/address";
import { executePublicServiceStaking } from "@/utils/TransactionExecuter/useSMateTransactionExecuter";

type InputData = {
  PublicServiceStakingInputData: PublicServiceStakingInputData;
  PayInputData: PayInputData;
};

export const PublicServiceStakingSignatureConstructor = () => {
  let account = getAccount(config);
  const { signPublicServiceStaking } = useSMateSignatureBuilder();
  const [isStaking, setIsStaking] = React.useState(true);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InputData | null>(null);

  const makeSig = async () => {
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

    const getInputValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const sMateAddress = getInputValue(
      "sMateAddressInput_PublicServiceStaking"
    );
    const serviceAddress = getInputValue(
      "serviceAddressInput_PublicServiceStaking"
    );
    const amountOfSMate = Number(
      getInputValue("amountOfSMateInput_PublicServiceStaking")
    );
    const priorityFee = getInputValue("priorityFeeInput_PublicServiceStaking");
    const nonceEVVM = getInputValue("nonceEVVMInput_PublicServiceStaking");
    const nonceSMATE = getInputValue("nonceSMATEInput_PublicServiceStaking");

    const amountOfToken = (amountOfSMate * 10 ** 18).toLocaleString(
      "fullwide",
      {
        useGrouping: false,
      }
    );

    signPublicServiceStaking(
      sMateAddress,
      serviceAddress,
      amountOfSMate,
      priorityFee,
      nonceEVVM,
      priority === "high",
      isStaking,
      nonceSMATE,
      (paySignature, stakingSignature) => {
        setDataToGet({
          PublicServiceStakingInputData: {
            isStaking: isStaking,
            user: walletData.address as `0x${string}`,
            service: serviceAddress as `0x${string}`,
            nonce: BigInt(nonceSMATE),
            amountOfSMate: BigInt(amountOfSMate),
            signature: stakingSignature,
            priorityFee_Evvm: BigInt(priorityFee),
            priority_Evvm: priority === "high",
            nonce_Evvm: BigInt(nonceEVVM),
            signature_Evvm: paySignature,
          },
          PayInputData: {
            from: walletData.address as `0x${string}`,
            to_address: sMateAddress as `0x${string}`,
            to_identity: "",
            token: tokenAddress.mate as `0x${string}`,
            amount: BigInt(amountOfToken),
            priorityFee: BigInt(priorityFee),
            nonce: BigInt(nonceEVVM),
            priority: priority === "high",
            executor: sMateAddress as `0x${string}`,
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

    const sMateAddress = dataToGet.PayInputData.to_address;

    executePublicServiceStaking(
      dataToGet.PublicServiceStakingInputData,
      sMateAddress
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

      {/* Address Input */}
      <AddressInputField
        label="sMate Address"
        inputId="sMateAddressInput_PublicServiceStaking"
        placeholder="Enter sMate address"
        defaultValue={
          contractAddress[account.chain?.id as keyof typeof contractAddress]
            ?.sMate || ""
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
        label="sMate Nonce"
        inputId="nonceSMATEInput_PublicServiceStaking"
        placeholder="Enter nonce"
      />

      {/* Amount Inputs */}
      <NumberInputField
        label="Amount of sMate"
        inputId="amountOfSMateInput_PublicServiceStaking"
        placeholder="Enter amount of sMate"
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
