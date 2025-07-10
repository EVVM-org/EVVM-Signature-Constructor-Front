"use client";
import React from "react";
import { getAccount, writeContract } from "@wagmi/core";
import { config } from "@/config/index";
import { useEVVMSignatureBuilder } from "@/utils/EVVMSignatureBuilder/useEVVMSignatureBuilder";
import { TitleAndLink } from "@/components/SigConstructors/InputsAndModules/TitleAndLink";
import { DetailedData } from "@/components/SigConstructors/InputsAndModules/DetailedData";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { ExecutorSelector } from "../InputsAndModules/ExecutorSelector";
import { address } from "../../../../constants/address";
import Evvm from "../../../../constants/abi/Evvm.json";
import { AsStakerSelector } from "../InputsAndModules/AsStakerSelector";

type PayData = {
  from: `0x${string}`;
  to_address: `0x${string}`;
  to_identity: string;
  token: string;
  amount: string;
  priorityFee: string;
  nonce: string;
  priority: string;
  executor: string;
  signature: string;
};

export const PaySignaturesConstructorComponent = () => {
  const { signPay } = useEVVMSignatureBuilder();
  const account = getAccount(config);

  const [selectedToken, setSelectedToken] = React.useState(
    "0x0000000000000000000000000000000000000000"
  );
  const [isUsingUsernames, setIsUsingUsernames] = React.useState(true);
  const [isUsingExecutor, setIsUsingExecutor] = React.useState(false);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<PayData | null>(null);
  const [asStaker, setAsStaker] = React.useState(false);

  const makeSig = async () => {
    const getInputValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const nonce = getInputValue("nonceInput_Pay");
    const tokenAddress = getInputValue("tokenAddress_Pay");
    const to = getInputValue(isUsingUsernames ? "toUsername" : "toAddress");
    const executor = isUsingExecutor
      ? getInputValue("executorInput_Pay")
      : "0x0000000000000000000000000000000000000000";
    const amount = getInputValue("amountTokenInput_Pay");
    const priorityFee = getInputValue("priorityFeeInput_Pay");

    signPay(
      to,
      tokenAddress,
      amount,
      priorityFee,
      nonce,
      priority === "high",
      executor,
      (signature) => {
        setDataToGet({
          from: account.address as `0x${string}`,
          to_address: (to.startsWith("0x")
            ? to
            : "0x0000000000000000000000000000000000000000") as `0x${string}`,
          to_identity: to.startsWith("0x") ? "" : to,
          token: tokenAddress,
          amount,
          priorityFee,
          nonce,
          priority: priority === "high" ? "true" : "false",
          executor,
          signature,
        });
      },
      (error) => console.error("Error signing payment:", error)
    );
  };

  const executePayment = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }
    const account = getAccount(config);
    const chainId = account.chain?.id;
    if (!chainId) {
      console.error("No chain ID available");
      return;
    }

    if (dataToGet.priority) {
      writeContract(config, {
        abi: Evvm.abi,
        address: address[chainId.toString() as keyof typeof address]
          .evvm as `0x${string}`,
        functionName: asStaker
          ? "payMateStaking_async"
          : "payNoMateStaking_async",
        args: [
          dataToGet.from,
          dataToGet.to_address,
          dataToGet.to_identity,
          dataToGet.token,
          dataToGet.amount,
          dataToGet.priorityFee,
          dataToGet.nonce,
          dataToGet.executor,
          dataToGet.signature,
        ],
      })
        .then(() => {
          console.log("Payment successful");
        })
        .catch((error) => {
          console.error("Error executing payment:", error);
        });
    } else {
      writeContract(config, {
        abi: Evvm.abi,
        address: address[chainId.toString() as keyof typeof address]
          .evvm as `0x${string}`,
        functionName: asStaker
          ? "payMateStaking_sync"
          : "payNoMateStaking_sync",
        args: [
          dataToGet.from,
          dataToGet.to_address,
          dataToGet.to_identity,
          dataToGet.token,
          dataToGet.amount,
          dataToGet.priorityFee,
          dataToGet.executor,
          dataToGet.signature,
        ],
      })
        .then(() => {
          console.log("Payment successful");
        })
        .catch((error) => {
          console.error("Error executing payment:", error);
        });
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Single payment"
        link="https://www.evvm.org/docs/SignatureStructures/EVVM/SinglePaymentSignatureStructure"
      />
      <br />

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

      {/* As Staker configuration */}
      <AsStakerSelector onAsStakerChange={setAsStaker} />

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
      {dataToGet && (
        <div style={{ marginTop: "2rem" }}>
          <DetailedData dataToGet={dataToGet} />

          {/* Action buttons */}
          <div style={{ marginTop: "1rem" }}>
            <button
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "0.5rem",
                margin: "0.5rem",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => setDataToGet(null)}
            >
              Clear
            </button>
            <button
              style={{
                backgroundColor: "#4c5cafff",
                color: "white",
                padding: "0.5rem",
                margin: "0.5rem",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
              }}
              onClick={executePayment}
            >
              Execute
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
