"use client";
import React from "react";
import { Staking, type IGoldenStakingData, type ISerializableSignedAction } from "@evvm/evvm-js";
import { execute } from "@evvm/evvm-js";
import { getEvvmSigner, getCurrentChainId } from "@/utils/evvm-signer";
import {
  NumberInputWithGenerator,
  PrioritySelector,
  DataDisplayWithClear,
  HelperInfo,
  NumberInputField,
  StakingActionSelector,
} from "@/components/SigConstructors/InputsAndModules";

import { StakingComponentProps } from "@/types";

export const GoldenStakingComponent = ({
  stakingAddress,
  coreAddress
}: StakingComponentProps) => {
  const [isStaking, setIsStaking] = React.useState(true);
  const [priority, setPriority] = React.useState<"low" | "high">("low");
  const [dataToGet, setDataToGet] = React.useState<ISerializableSignedAction<IGoldenStakingData> | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement)?.value;

    if (!stakingAddress) {
      console.error("Staking address is required");
      return;
    }

    const amountOfStaking = getValue("amountOfStakingInput_GoldenStaking");
    const nonce = getValue("nonceInput_GoldenStaking");

    if (!amountOfStaking || !nonce) {
      console.error("All fields are required");
      return;
    }

    setLoading(true);
    try {
      const signer = await getEvvmSigner();
      const stakingService = new Staking({
        signer,
        address: coreAddress as `0x${string}`,
        chainId: getCurrentChainId(),
      });

      const signedAction = await stakingService.goldenStaking({
        isStaking,
        amountOfStaking: BigInt(amountOfStaking),
      });

      setDataToGet(signedAction.toJSON());
    } catch (error) {
      console.error("Error creating signature:", error);
    } finally {
      setLoading(false);
    }
  };

  const executeStaking = async () => {
    if (!dataToGet || !stakingAddress) {
      console.error("Missing data or address");
      return;
    }

    try {
      const signer = await getEvvmSigner();
      await execute(signer, dataToGet);
      console.log("Golden staking executed successfully");
      setDataToGet(null);
    } catch (error) {
      console.error("Error executing golden staking:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <h1>Golden staking</h1>
      <br />

      <StakingActionSelector onChange={setIsStaking} />

      <NumberInputField
        label={
          isStaking
            ? "Amount of MATE to stake"
            : "Amount of MATE to unstake (sMATE)"
        }
        inputId="amountOfStakingInput_GoldenStaking"
        placeholder="Enter amount"
      />

      <PrioritySelector onPriorityChange={setPriority} />

      <NumberInputWithGenerator
        label="Nonce"
        inputId="nonceInput_GoldenStaking"
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
        {loading ? "Creating..." : "Create signature"}
      </button>

      <DataDisplayWithClear
        dataToGet={dataToGet}
        onClear={() => setDataToGet(null)}
        onExecute={executeStaking}
      />
    </div>
  );
};
