"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { useSignatureBuilder } from "@/utils/SignatureBuilder/useEVVMSignatureBuilder";
import { TitleAndLink } from "@/components/SigConstructors/InputsAndModules/TitleAndLink";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { DataDisplayWithClear } from "@/components/SigConstructors/InputsAndModules/DataDisplayWithClear";
import { ExecutorSelector } from "../InputsAndModules/ExecutorSelector";
import {
  DispersePayInputData,
  DispersePayMetadata,
} from "@/utils/TypeStructures/evvmTypeInputStructure";
import { executeDispersePay } from "@/utils/TransactionExecuter/useEVVMTransactionExecuter";
import { contractAddress } from "@/constants/address";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";

export const DispersePaySignatureConstructor = () => {
  let account = getAccount(config);
  const [isUsingExecutorDisperse, setIsUsingExecutorDisperse] =
    React.useState(false);
  const [priorityDisperse, setPriorityDisperse] = React.useState("low");
  const [isUsingUsernameOnDisperse, setIsUsingUsernameOnDisperse] =
    React.useState<Array<boolean>>([true, true, true, true, true]);
  const [numberOfUsersToDisperse, setNumberOfUsersToDisperse] =
    React.useState(1);

  const [dataToGet, setDataToGet] = React.useState<DispersePayInputData | null>(
    null
  );

  const { signDispersePay } = useSignatureBuilder();

  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const formData = {
      tokenAddress: getValue("tokenAddressDispersePay"),
      amount: getValue("amountTokenInputSplit"),
      priorityFee: getValue("priorityFeeInputSplit"),
      nonce: getValue("nonceInputDispersePay"),
      executor: isUsingExecutorDisperse
        ? getValue("executorInputSplit")
        : "0x0000000000000000000000000000000000000000",
    };

    const toData: DispersePayMetadata[] = [];
    for (let i = 0; i < numberOfUsersToDisperse; i++) {
      const isUsingUsername = isUsingUsernameOnDisperse[i];
      const toInputId = isUsingUsername
        ? `toUsernameSplitUserNumber${i}`
        : `toAddressSplitUserNumber${i}`;
      const to = getValue(toInputId);
      const amount = getValue(`amountTokenToGiveUser${i}`);

      toData.push({
        amount: BigInt(amount),
        to_address: isUsingUsername
          ? "0x0000000000000000000000000000000000000000"
          : (to as `0x${string}`),
        to_identity: isUsingUsername ? to : "",
      });
    }

    signDispersePay(
      toData,
      formData.tokenAddress,
      formData.amount,
      formData.priorityFee,
      formData.nonce,
      priorityDisperse === "high",
      formData.executor,
      (dispersePaySignature) => {
        setDataToGet({
          from: walletData.address as `0x${string}`,
          toData,
          token: formData.tokenAddress as `0x${string}`,
          amount: BigInt(formData.amount),
          priorityFee: BigInt(formData.priorityFee),
          priority: priorityDisperse === "high",
          nonce: BigInt(formData.nonce),
          executor: formData.executor,
          signature: dispersePaySignature,
        });
      },
      (error) => {
        console.error("Error signing disperse payment:", error);
      }
    );
  };

  const executeDispersePayment = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }

    const evvmAddress = (
      document.getElementById(
        "evvmAddressInput_DispersePay"
      ) as HTMLInputElement
    ).value as `0x${string}`;

    if (!evvmAddress) {
      console.error("EVVM address is not provided");
      return;
    }

    executeDispersePay(dataToGet, evvmAddress)
      .then(() => {
        console.log("Disperse payment executed successfully");
      })
      .catch((error) => {
        console.error("Error executing disperse payment:", error);
      });
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Disperse payment"
        link="https://www.evvm.org/docs/SignatureStructures/EVVM/DispersePaySignatureStructure"
      />
      <br />

      {/* Address Input */}
      <AddressInputField
        label="EVVM Address"
        inputId="evvmAddressInput_DispersePay"
        placeholder="Enter EVVM address"
        defaultValue={
          contractAddress[account.chain?.id as keyof typeof contractAddress]
            ?.evvm || ""
        }
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
        onExecute={executeDispersePayment}
      />
    </div>
  );
};
