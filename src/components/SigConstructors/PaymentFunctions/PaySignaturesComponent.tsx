"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { useSignatureBuilder } from "@/utils/SignatureBuilder/useEVVMSignatureBuilder";
import { TitleAndLink } from "@/components/SigConstructors/InputsAndModules/TitleAndLink";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { ExecutorSelector } from "../InputsAndModules/ExecutorSelector";
import { DataDisplayWithClear } from "../InputsAndModules/DataDisplayWithClear";
import { PayInputData } from "@/utils/TypeInputStructures";
import { executePay } from "@/utils/TransactionExecuter/useEVVMTransactionExecuter";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";

interface PaySignaturesComponentProps {
  evvmID: string;
  evvmAddress: string;
}

export const PaySignaturesComponent = ({ evvmID, evvmAddress }: PaySignaturesComponentProps) => {
  const { signPay } = useSignatureBuilder();
  let account = getAccount(config);

  const [isUsingUsernames, setIsUsingUsernames] = React.useState(true);
  const [isUsingExecutor, setIsUsingExecutor] = React.useState(false);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<PayInputData | null>(null);


  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const formData = {
      evvmID: evvmID,
      nonce: getValue("nonceInput_Pay"),
      tokenAddress: getValue("tokenAddress_Pay"),
      to: getValue(isUsingUsernames ? "toUsername" : "toAddress"),
      executor: isUsingExecutor
        ? getValue("executorInput_Pay")
        : "0x0000000000000000000000000000000000000000",
      amount: getValue("amountTokenInput_Pay"),
      priorityFee: getValue("priorityFeeInput_Pay"),
    };

    signPay(
      BigInt(formData.evvmID),
      formData.to,
      formData.tokenAddress as `0x${string}`,
      BigInt(formData.amount),
      BigInt(formData.priorityFee),
      BigInt(formData.nonce),
      priority === "high",
      formData.executor as `0x${string}`,
      (signature: string) => {
        setDataToGet({
          from: walletData.address as `0x${string}`,
          to_address: (formData.to.startsWith("0x")
            ? formData.to
            : "0x0000000000000000000000000000000000000000") as `0x${string}`,
          to_identity: formData.to.startsWith("0x") ? "" : formData.to,
          token: formData.tokenAddress as `0x${string}`,
          amount: BigInt(formData.amount),
          priorityFee: BigInt(formData.priorityFee),
          nonce: BigInt(formData.nonce),
          priority: priority === "high",
          executor: formData.executor,
          signature,
        });
      },
      (error: Error) => console.error("Error signing payment:", error)
    );
  };

  const executePayment = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }

    if (!evvmAddress) {
      console.error("EVVM address is not provided");
      return;
    }

    executePay(dataToGet, evvmAddress as `0x${string}`)
      .then(() => {
        console.log("Payment executed successfully");
      })
      .catch((error) => {
        console.error("Error executing payment:", error);
      });
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Single payment"
        link="https://www.evvm.info/docs/SignatureStructures/EVVM/SinglePaymentSignatureStructure"
      />
      <br />

      {/* EVVM ID and Address are now passed as props */}

      {/* Recipient configuration section */}
      <div style={{ marginBottom: "1rem" }}>
        <p>
          To:{" "}
          <select
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "6rem",
            }}
            onChange={(e) => setIsUsingUsernames(e.target.value === "true")}
          >
            <option value="true">Username</option>
            <option value="false">Address</option>
          </select>
          <input
            type="text"
            placeholder={isUsingUsernames ? "Enter username" : "Enter address"}
            id={isUsingUsernames ? "toUsername" : "toAddress"}
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "25rem",
              marginLeft: "0.5rem",
            }}
          />
        </p>
      </div>

      {/* Nonce section with automatic generator */}

      <NumberInputWithGenerator
        label="Nonce"
        inputId="nonceInput_Pay"
        placeholder="Enter nonce"
      />

      <AddressInputField
        label="Token address"
        inputId="tokenAddress_Pay"
        placeholder="Enter token address"
        defaultValue="0x0000000000000000000000000000000000000000"
      />

      {/* Basic input fields */}
      {[
        { label: "Amount", id: "amountTokenInput_Pay", type: "number" },
        { label: "Priority fee", id: "priorityFeeInput_Pay", type: "number" },
      ].map(({ label, id, type }) => (
        <div key={id} style={{ marginBottom: "1rem" }}>
          <p>{label}</p>
          <input
            type={type}
            placeholder={`Enter ${label.toLowerCase()}`}
            id={id}
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "25rem",
            }}
          />
        </div>
      ))}

      {/* Executor configuration */}

      <ExecutorSelector
        inputId="executorInput_Pay"
        placeholder="Enter executor"
        onExecutorToggle={setIsUsingExecutor}
        isUsingExecutor={isUsingExecutor}
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
        onExecute={executePayment}
      />
    </div>
  );
};
