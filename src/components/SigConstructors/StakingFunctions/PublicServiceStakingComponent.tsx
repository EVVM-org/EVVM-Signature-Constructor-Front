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
import { executePublicServiceStaking } from "@/utils/TransactionExecuter/useSMateTransactionExecuter";
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
  const { signPublicServiceStaking } = useSMateSignatureBuilder();
  const [isStaking, setIsStaking] = React.useState(true);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InputData | null>(null);

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const formData = {
      sMateAddress: getValue("sMateAddressInput_PublicServiceStaking"),
      serviceAddress: getValue("serviceAddressInput_PublicServiceStaking"),
      amountOfSMate: Number(
        getValue("amountOfSMateInput_PublicServiceStaking")
      ),
      priorityFee: getValue("priorityFeeInput_PublicServiceStaking"),
      nonceEVVM: getValue("nonceEVVMInput_PublicServiceStaking"),
      nonceSMATE: getValue("nonceSMATEInput_PublicServiceStaking"),
    };

    const amountOfToken = (formData.amountOfSMate * 10 ** 18).toLocaleString(
      "fullwide",
      {
        useGrouping: false,
      }
    );

    signPublicServiceStaking(
      formData.sMateAddress,
      formData.serviceAddress,
      formData.amountOfSMate,
      formData.priorityFee,
      formData.nonceEVVM,
      priority === "high",
      isStaking,
      formData.nonceSMATE,
      (paySignature, stakingSignature) => {
        setDataToGet({
          PublicServiceStakingInputData: {
            isStaking: isStaking,
            user: walletData.address as `0x${string}`,
            service: formData.serviceAddress as `0x${string}`,
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
