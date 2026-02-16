"use client";
import React from "react";
import { Core, Staking, type IPublicStakingData, type IPayData, type ISerializableSignedAction } from "@evvm/evvm-js";
import { execute } from "@evvm/evvm-js";
import { getEvvmSigner, getCurrentChainId } from "@/utils/evvm-signer";
import {
  TitleAndLink,
  NumberInputWithGenerator,
  PrioritySelector,
  DataDisplayWithClear,
  HelperInfo,
  NumberInputField,
  StakingActionSelector,
} from "@/components/SigConstructors/InputsAndModules";

type InputData = {
  IPublicStakingData: ISerializableSignedAction<IPublicStakingData>;
  IPayData: ISerializableSignedAction<IPayData>;
};

interface PublicStakingComponentProps {
  stakingAddress: string;
}

export const PublicStakingComponent = ({
  stakingAddress,
}: PublicStakingComponentProps) => {
  const [isStaking, setIsStaking] = React.useState(true);
  const [priority, setPriority] = React.useState<"low" | "high">("low");
  const [dataToGet, setDataToGet] = React.useState<InputData | null>(null);
  const [loading, setLoading] = React.useState(false);

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement)?.value;

    if (!stakingAddress) {
      console.error("Staking address is required");
      return;
    }

    const nonceEVVM = getValue("nonceEVVMInput_PublicStaking");
    const nonceStaking = getValue("nonceStakingInput_PublicStaking");
    const amountOfStaking = getValue("amountOfStakingInput_PublicStaking");
    const priorityFee = getValue("priorityFeeInput_PublicStaking");

    if (!nonceEVVM || !nonceStaking || !amountOfStaking || !priorityFee) {
      console.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const signer = await getEvvmSigner();
      const evvm = new Core({
        signer,
        address: stakingAddress as `0x${string}`,
        chainId: getCurrentChainId(),
      });
      const stakingService = new Staking({
        signer,
        address: stakingAddress as `0x${string}`,
        chainId: getCurrentChainId(),
      });

      const amountOfToken =
        BigInt(amountOfStaking) * (BigInt(5083) * BigInt(10) ** BigInt(18));

      const payAction = await evvm.pay({
        toAddress: stakingAddress as `0x${string}`,
        tokenAddress: "0x0000000000000000000000000000000000000001" as `0x${string}`,
        amount: amountOfToken,
        priorityFee: BigInt(priorityFee),
        nonce: BigInt(nonceEVVM),
        isAsyncExec: priority === "high",
        senderExecutor: stakingAddress as `0x${string}`,
      });

      const stakingAction = await stakingService.publicStaking({
        isStaking,
        amountOfStaking: BigInt(amountOfStaking),
        nonce: BigInt(nonceStaking),
        evvmSignedAction: payAction,
      });

      setDataToGet({
        IPublicStakingData: stakingAction.toJSON(),
        IPayData: payAction.toJSON(),
      });
    } catch (error) {
      console.error("Error creating signature:", error);
    } finally {
      setLoading(false);
    }
  };

  const executePublic = async () => {
    if (!dataToGet || !stakingAddress) {
      console.error("Missing data or address");
      return;
    }

    try {
      const signer = await getEvvmSigner();
      await execute(signer, dataToGet.IPublicStakingData);
      console.log("Public staking executed successfully");
      setDataToGet(null);
    } catch (error) {
      console.error("Error executing public staking:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Public Staking"
        link="https://www.evvm.info/docs/SignatureStructures/SMate/StakingUnstakingStructure"
      />
      <br />

      <StakingActionSelector onChange={setIsStaking} />

      <NumberInputWithGenerator
        label="Staking Nonce"
        inputId="nonceStakingInput_PublicStaking"
        placeholder="Enter nonce"
      />

      <NumberInputField
        label={
          isStaking
            ? "Amount of MATE to stake"
            : "Amount of MATE to unstake (sMATE)"
        }
        inputId="amountOfStakingInput_PublicStaking"
        placeholder="Enter amount"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_PublicStaking"
        placeholder="Enter priority fee"
      />

      <PrioritySelector onPriorityChange={setPriority} />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_PublicStaking"
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

      <button
        onClick={makeSig}
        disabled={loading}
        style={{
          padding: "0.5rem",
          marginTop: "1rem",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Creating..." : "Create Signature"}
      </button>

      <DataDisplayWithClear
        dataToGet={dataToGet}
        onClear={() => setDataToGet(null)}
        onExecute={executePublic}
      />
    </div>
  );
};
