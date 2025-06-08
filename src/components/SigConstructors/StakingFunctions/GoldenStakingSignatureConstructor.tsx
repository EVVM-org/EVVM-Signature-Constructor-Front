"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { useSMateSignatureBuilder } from "@/utils/EVVMSignatureBuilder/useSMateSignatureBuilder";
import { DetailedData } from "@/components/SigConstructors/InputsAndModules/DetailedData";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { DataDisplayWithClear } from "../InputsAndModules/DataDisplayWithClear";
import { StakingActionSelector } from "../InputsAndModules/StakingActionSelector";

type PayData = {
  isStaking: string; // "true" for staking, "false" for unstaking
  from: `0x${string}`;
  to_address: `0x${string}`;
  token: string;
  amount: string;
  priorityFee: string;
  nonce: string;
  priority: string;
  executor: string;
  signature: string;
};

export const GoldenStakingSignatureConstructor = () => {
  const account = getAccount(config);
  const { signGoldenStaking } = useSMateSignatureBuilder();
  const [isStaking, setIsStaking] = React.useState(true);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<PayData | null>(null);

  const makeSig = async () => {
    // Get form values
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const nonce = getValue("nonceInput_GoldenStaking");
    const sMateAddress = getValue("sMateAddressInput_GoldenStaking");
    const amount =
      Number(getValue("amountOfSMateInput_GoldenStaking")) * (5083 * 10 ** 18);

    // Sign and set data
    signGoldenStaking(
      sMateAddress,
      amount,
      nonce,
      priority === "high",
      (signature) => {
        setDataToGet({
          isStaking: isStaking.toString(),
          from: account.address as `0x${string}`,
          to_address: sMateAddress as `0x${string}`,
          token: "0x0000000000000000000000000000000000000001",
          amount: amount.toLocaleString("fullwide", { useGrouping: false }),
          priorityFee: "0",
          nonce,
          priority,
          executor: sMateAddress as `0x${string}`,
          signature,
        });
      },
      (error) => console.error("Error signing staking:", error)
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <h1>Golden staking</h1>
      <br />

      {/* Configuration Section */}
      <StakingActionSelector onChange={setIsStaking} />

      {/* Recipient configuration section */}
      <AddressInputField
        label="sMate Address"
        inputId="sMateAddressInput_GoldenStaking"
        placeholder="Enter sMate address"
      />

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
      />
    </div>
  );
};
