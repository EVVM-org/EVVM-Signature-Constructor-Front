"use client";
import React from "react";
import { config } from "@/config/index";
import { getWalletClient } from "@wagmi/core";
import {
  TitleAndLink,
  NumberInputWithGenerator,
  PrioritySelector,
  DataDisplayWithClear,
  HelperInfo,
  NumberInputField,
  AddressInputField,
} from "@/components/SigConstructors/InputsAndModules";
import { executePublicServiceStaking } from "@/utils/TransactionExecuter/useStakingTransactionExecuter";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import {
  PayInputData,
  PublicServiceStakingInputData,
  StakingSignatureBuilder,
} from "@evvm/viem-signature-library";

type InputData = {
  PublicServiceStakingInputData: PublicServiceStakingInputData;
  PayInputData: PayInputData;
};

interface PublicServiceStakingComponentProps {
  evvmID: string;
  stakingAddress: string;
}

export const PublicServiceStakingComponent = ({
  evvmID,
  stakingAddress,
}: PublicServiceStakingComponentProps) => {
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

    try {
      const walletClient = await getWalletClient(config);
      const signatureBuilder = new (StakingSignatureBuilder as any)(
        walletClient,
        walletData
      );

      const { paySignature, actionSignature } =
        await signatureBuilder.signPublicServiceStaking(
          BigInt(formData.evvmID),
          formData.stakingAddress as `0x${string}`,
          formData.serviceAddress,
          true,
          BigInt(formData.amountOfStaking),
          BigInt(formData.nonceStaking),
          BigInt(formData.priorityFee),
          BigInt(formData.nonceEVVM),
          priority === "high"
        );
      setDataToGet({
        PublicServiceStakingInputData: {
          isStaking: true,
          user: walletData.address as `0x${string}`,
          service: formData.serviceAddress as `0x${string}`,
          nonce: BigInt(formData.nonceStaking),
          amountOfStaking: BigInt(formData.amountOfStaking),
          signature: actionSignature,
          priorityFee_EVVM: BigInt(formData.priorityFee),
          priorityFlag_EVVM: priority === "high",
          nonce_EVVM: BigInt(formData.nonceEVVM),
          signature_EVVM: paySignature,
        },
        PayInputData: {
          from: walletData.address as `0x${string}`,
          to_address: formData.stakingAddress as `0x${string}`,
          to_identity: "",
          token: "0x0000000000000000000000000000000000000001" as `0x${string}`,
          amount: BigInt(amountOfToken),
          priorityFee: BigInt(formData.priorityFee),
          nonce: BigInt(formData.nonceEVVM),
          priority: priority === "high",
          executor: formData.stakingAddress as `0x${string}`,
          signature: paySignature,
        },
      });
    } catch (error) {
      console.error("Error creating signature:", error);
    }
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
        link="https://www.evvm.info/docs/SignatureStructures/SMate/StakingUnstakingStructure"
      />
      <br />

      <p>
        This implementation is temporary until a direct integration with
        services is completed.
      </p>
      <br />
      {/* stakingAddress is now passed as a prop */}

      {/* Configuration Section */}

      <AddressInputField
        label="Service Address"
        inputId="serviceAddressInput_PublicServiceStaking"
        placeholder="Enter service address"
      />

      {/* Nonce Generators */}

      <NumberInputWithGenerator
        label="staking Nonce"
        inputId="nonceStakingInput_PublicServiceStaking"
        placeholder="Enter nonce"
      />

      {/* Amount Inputs */}
      <NumberInputField
        label={"Amount of MATE to stake"}
        inputId="amountOfStakingInput_PublicServiceStaking"
        placeholder="Enter amount"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_PublicServiceStaking"
        placeholder="Enter priority fee"
      />

      {/* Priority Selection */}
      <PrioritySelector onPriorityChange={setPriority} />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_PublicServiceStaking"
        placeholder="Enter nonce"
        showRandomBtn={priority !== "low"}
      />

      <div>
        {priority === "low" && (
          <HelperInfo label="How to find my sync nonce?">
            <div>
              You can retrieve your next sync nonce from the EVVM contract using
              the <code>getNextCurrentSyncNonce</code> function.
            </div>
          </HelperInfo>
        )}
      </div>

      {/* Action Button */}
      <button onClick={makeSig}>Create Signature</button>

      {/* Results Section */}
      <DataDisplayWithClear
        dataToGet={dataToGet}
        onClear={() => setDataToGet(null)}
        onExecute={execute}
      />
    </div>
  );
};
