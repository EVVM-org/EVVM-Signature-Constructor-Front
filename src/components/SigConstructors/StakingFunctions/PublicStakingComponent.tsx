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
import { contractAddress, tokenAddress } from "@/constants/address";
import { executePublicStaking } from "@/utils/TransactionExecuter/useSMateTransactionExecuter";
import { PublicStakingInputData } from "@/utils/TypeStructures/sMateTypeInputStructure";
import { PayInputData } from "@/utils/TypeStructures/evvmTypeInputStructure";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";

type InputData = {
  PublicStakingInputData: PublicStakingInputData;
  PayInputData: PayInputData;
};

export const PublicStakingComponent = () => {
  let account = getAccount(config);
  const { signPublicStaking } = useSMateSignatureBuilder();
  const [isStaking, setIsStaking] = React.useState(true);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InputData | null>(null);

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const formData = {
      sMateAddress: getValue("sMateAddressInput_PublicStaking"),
      nonceEVVM: getValue("nonceEVVMInput_PublicStaking"),
      nonceSMATE: getValue("nonceSMATEInput_PublicStaking"),
      amountOfSMate: Number(getValue("amountOfSMateInput_PublicStaking")),
      priorityFee: getValue("priorityFeeInput_PublicStaking"),
    };

    if (!formData.sMateAddress) {
      alert("Please enter a sMate address");
      return;
    }

    const amountOfToken = BigInt(formData.amountOfSMate) *
      (BigInt(5083) * BigInt(10) ** BigInt(18));

    // Sign message
    signPublicStaking(
      formData.sMateAddress,
      formData.amountOfSMate,
      formData.priorityFee,
      formData.nonceEVVM,
      priority === "high",
      isStaking,
      formData.nonceSMATE,
      (paySignature, stakingSignature) => {
        setDataToGet({
          PublicStakingInputData: {
            isStaking: isStaking,
            user: walletData.address as `0x${string}`,
            nonce: BigInt(formData.nonceSMATE),
            amountOfSMate: BigInt(formData.amountOfSMate),
            signature: stakingSignature,
            priorityFee_Evvm: BigInt(formData.priorityFee),
            priority_Evvm: priority === "high",
            nonce_Evvm: BigInt(formData.nonceEVVM),
            signature_Evvm: paySignature,
          },
          PayInputData: {
            from: walletData.address as `0x${string}`,
            to_address: formData.sMateAddress as `0x${string}`,
            to_identity: "",
            token: tokenAddress.mate as `0x${string}`,
            amount: BigInt(amountOfToken),
            priorityFee: BigInt(formData.priorityFee),
            nonce: BigInt(formData.nonceEVVM),
            priority: priority === "high",
            executor: formData.sMateAddress as `0x${string}`,
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

    executePublicStaking(dataToGet.PublicStakingInputData, sMateAddress)
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
        link="https://www.evvm.org/docs/SignatureStructures/SMate/StakingUnstakingStructure"
      />
      <br />
      <AddressInputField
        label="sMate Address"
        inputId="sMateAddressInput_publicStaking"
        placeholder="Enter sMate address"
        defaultValue={
          contractAddress[account.chain?.id as keyof typeof contractAddress]
            ?.sMate || ""
        }
      />
      <br />

      {/* Configuration Section */}
      <StakingActionSelector onChange={setIsStaking} />

      {/* Nonce Generators */}
      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_PublicStaking"
        placeholder="Enter nonce"
      />

      <NumberInputWithGenerator
        label="sMate Nonce"
        inputId="nonceSMATEInput_PublicStaking"
        placeholder="Enter nonce"
      />

      {/* Amount Inputs */}
      <NumberInputField
        label="Amount of sMate"
        inputId="amountOfSMateInput_PublicStaking"
        placeholder="Enter amount of sMate"
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
