"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { useEVVMSignatureBuilder } from "@/utils/EVVMSignatureBuilder/useEVVMSignatureBuilder";
import { TitleAndLink } from "@/components/SigConstructors/InputsAndModules/TitleAndLink";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { DataDisplayWithClear } from "@/components/SigConstructors/InputsAndModules/DataDisplayWithClear";
import { ExecutorSelector } from "../InputsAndModules/ExecutorSelector";

type DispersePayMetadata = {
  amount: string;
  to_address: string;
  to_identity: string;
};

type DispersePayData = {
  from: `0x${string}`;
  toData: DispersePayMetadata[];
  token: string;
  amount: string;
  priorityFee: string;
  priority: boolean;
  nonce: string;
  executor: string;
  signature: string;
};

export const DispersePaySignatureConstructor = () => {
  const [isUsingExecutorDisperse, setIsUsingExecutorDisperse] =
    React.useState(false);
  const [priorityDisperse, setPriorityDisperse] = React.useState("low");
  const [isUsingUsernameOnDisperse, setIsUsingUsernameOnDisperse] =
    React.useState<Array<boolean>>([true, true, true, true, true]);
  const [numberOfUsersToDisperse, setNumberOfUsersToDisperse] =
    React.useState(1);

  const [dataToGet, setDataToGet] = React.useState<DispersePayData | null>(
    null
  );

  const { signDispersePay } = useEVVMSignatureBuilder();

  const getValue = (id: string) =>
    (document.getElementById(id) as HTMLInputElement).value;

  const makeSig = async () => {
    const account = getAccount(config);
    const TokenAddress = getValue("tokenAddressDispersePay");
    const Amount = getValue("amountTokenInputSplit");
    const PriorityFee = getValue("priorityFeeInputSplit");
    const Nonce = getValue("nonceInputDispersePay");
    const Executor = isUsingExecutorDisperse
      ? getValue("executorInputSplit")
      : "0x0000000000000000000000000000000000000000";

    const toData: DispersePayMetadata[] = [];
    for (let i = 0; i < numberOfUsersToDisperse; i++) {
      const isUsingUsername = isUsingUsernameOnDisperse[i];
      const toInputId = isUsingUsername
        ? `toUsernameSplitUserNumber${i}`
        : `toAddressSplitUserNumber${i}`;
      const to = getValue(toInputId);
      const amount = getValue(`amountTokenToGiveUser${i}`);

      toData.push({
        amount,
        to_address: isUsingUsername
          ? "0x0000000000000000000000000000000000000000"
          : to,
        to_identity: isUsingUsername ? to : "",
      });
    }

    signDispersePay(
      toData,
      TokenAddress,
      Amount,
      PriorityFee,
      Nonce,
      priorityDisperse === "high",
      Executor,
      (dispersePaySignature) => {
        setDataToGet({
          from: account.address as `0x${string}`,
          toData,
          token: TokenAddress,
          amount: Amount,
          priorityFee: PriorityFee,
          priority: priorityDisperse === "high",
          nonce: Nonce,
          executor: Executor,
          signature: dispersePaySignature,
        });
      },
      (error) => {
        console.error("Error signing disperse payment:", error);
      }
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Disperse payment"
        link="https://www.evvm.org/docs/SignatureStructures/EVVM/DispersePaySignatureStructure"
      />
      <br />

      {/* Nonce input */}

      <NumberInputWithGenerator
        label="Nonce"
        inputId="nonceInputDispersePay"
        placeholder="Enter nonce"
      />

      {/* Token address */}
      <AddressInputField
        label="Token address"
        inputId="tokenAddressDispersePay"
        placeholder="Enter token address"
        defaultValue="0x0000000000000000000000000000000000000000"
      />

      {/* Amount */}

      <NumberInputField
        label="Amount"
        inputId="amountTokenInputSplit"
        placeholder="Enter amount"
      />

      {/* Priority fee */}

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInputSplit"
        placeholder="Enter priority fee"
      />

      {/* Executor selection */}
      <ExecutorSelector
        inputId="executorInputSplit"
        placeholder="Enter executor"
        onExecutorToggle={setIsUsingExecutorDisperse}
        isUsingExecutor={isUsingExecutorDisperse}
      />

      {/* Number of users */}
      <div style={{ marginBottom: "1rem" }}>
        <p>Number of accounts to split the payment</p>
        <select
          style={{
            color: "black",
            backgroundColor: "white",
            height: "2rem",
            width: "5rem",
          }}
          onChange={(e) => setNumberOfUsersToDisperse(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      {/* User inputs */}
      {Array.from({ length: numberOfUsersToDisperse }).map((_, index) => (
        <div key={index}>
          <h4 style={{ color: "black", marginTop: "1rem" }}>{`User ${
            index + 1
          }`}</h4>
          <p>To:</p>
          <select
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "5.5rem",
            }}
            onChange={(e) => {
              setIsUsingUsernameOnDisperse((prev) => {
                const newPrev = [...prev];
                newPrev[index] = e.target.value === "true";
                return newPrev;
              });
            }}
          >
            <option value="true">Username</option>
            <option value="false">Address</option>
          </select>
          <input
            type="text"
            placeholder={
              isUsingUsernameOnDisperse[index]
                ? "Enter username"
                : "Enter address"
            }
            id={
              isUsingUsernameOnDisperse[index]
                ? `toUsernameSplitUserNumber${index}`
                : `toAddressSplitUserNumber${index}`
            }
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "25rem",
            }}
          />
          <p>Amount</p>
          <input
            type="number"
            placeholder="Enter amount"
            id={`amountTokenToGiveUser${index}`}
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "25rem",
            }}
          />
        </div>
      ))}

      {/* Priority selection */}
      <PrioritySelector onPriorityChange={setPriorityDisperse} />

      {/* Make signature button */}
      <button
        onClick={makeSig}
        style={{ padding: "0.5rem", marginTop: "1rem" }}
      >
        Make signature
      </button>

      {/* Display results */}
      <DataDisplayWithClear
        dataToGet={dataToGet}
        onClear={() => setDataToGet(null)}
      />
    </div>
  );
};
