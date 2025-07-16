"use client";
import React from "react";
import { useSMateSignatureBuilder } from "@/utils/SignatureBuilder/useSMateSignatureBuilder";
import { TitleAndLink } from "@/components/SigConstructors/InputsAndModules/TitleAndLink";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { StakingActionSelector } from "../InputsAndModules/StakingActionSelector";
import { DataDisplayWithClear } from "../InputsAndModules/DataDisplayWithClear";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { executePresaleStaking } from "@/utils/TransactionExecuter/useSMateTransactionExecuter";
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

export const PresaleStakingComponent = () => {
  const { signPresaleStaking } = useSMateSignatureBuilder();

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
      sMateAddress: getValue("sMateAddressInput_presaleStaking"),
      amountOfSMate: Number(getValue("amountOfSMateInput_presaleStaking")),
      priorityFee: getValue("priorityFeeInput_presaleStaking"),
      nonceEVVM: getValue("nonceEVVMInput_presaleStaking"),
      nonceSMATE: getValue("nonceSMATEInput_presaleStaking"),
    };

    const amountOfToken = (formData.amountOfSMate * 10 ** 18).toLocaleString(
      "fullwide",
      {
        useGrouping: false,
      }
    );

    signPresaleStaking(
      formData.sMateAddress,
      formData.amountOfSMate,
      formData.priorityFee,
      formData.nonceEVVM,
      priority === "high",
      isStaking,
      formData.nonceSMATE,
      (paySignature, stakingSignature) => {
        setDataToGet({
          PresaleStakingInputData: {
            isStaking: isStaking,
            user: walletData.address as `0x${string}`,
            nonce: BigInt(formData.nonceSMATE),
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

    executePresaleStaking(dataToGet.PresaleStakingInputData, sMateAddress)
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

      {/* Address Input */}
      <AddressInputField
        label="sMate Address"
        inputId="sMateAddressInput_presaleStaking"
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
        inputId="nonceEVVMInput_presaleStaking"
        placeholder="Enter nonce"
      />

      <NumberInputWithGenerator
        label="sMate Nonce"
        inputId="nonceSMATEInput_presaleStaking"
        placeholder="Enter nonce"
      />

      {/* Amount Inputs */}
      <NumberInputField
        label="Amount of sMate"
        inputId="amountOfSMateInput_presaleStaking"
        placeholder="Enter amount of sMate"
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
