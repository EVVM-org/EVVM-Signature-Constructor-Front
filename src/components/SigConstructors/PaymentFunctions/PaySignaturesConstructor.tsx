"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import mersenneTwister from "@/utils/mersenneTwister";
import { useEVVMSignatureBuilder } from "@/utils/EVVMSignatureBuilder/useEVVMSignatureBuilder";
import { TitleAndLink } from "@/components/TitleAndLink";
import { DetailedData } from "@/components/DetailedData";

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

  const makePayment = async () => {
    // Get the nonce value from the input field
    const nonce = (
      document.getElementById("nonceInput_Pay") as HTMLInputElement
    ).value;

    // Get the token address from the input field
    const tokenAddress = (
      document.getElementById("tokenAddress") as HTMLInputElement
    ).value;

    // Get the recipient value - either username or address based on user selection
    const to = isUsingUsernames
      ? (document.getElementById("toUsername") as HTMLInputElement).value
      : (document.getElementById("toAddress") as HTMLInputElement).value;

    // Get the executor address if using executor, otherwise use zero address
    const executor = isUsingExecutor
      ? (document.getElementById("executorInput_Pay") as HTMLInputElement).value
      : "0x0000000000000000000000000000000000000000";

    // Get the amount of tokens to transfer
    const ammountConverted = (
      document.getElementById("amountTokenInput_Pay") as HTMLInputElement
    ).value;

    // Get the priority fee value
    const priorityFeeConverted = (
      document.getElementById("priorityFeeInput_Pay") as HTMLInputElement
    ).value;

    // Sign the message
    signPay(
      to,
      tokenAddress,
      ammountConverted,
      priorityFeeConverted,
      nonce!.toString(),
      priority === "high",
      executor,
      (signature) => {
        console.log("----------Message signed----------");
        console.log(signature);

        // Create the PayData object with all the payment information and signature
        setDataToGet({
          from: account.address as `0x${string}`,
          to_address: (to.startsWith("0x")
            ? to
            : "0x0000000000000000000000000000000000000000") as `0x${string}`,
          to_identity: to.startsWith("0x") ? "" : to,
          token: tokenAddress,
          amount: ammountConverted,
          priorityFee: priorityFeeConverted.toString(),
          nonce: nonce.toString(),
          priority: priority === "high" ? "true" : "false",
          executor: executor,
          signature,
        });
      },
      (error) => {
        console.error("Error signing payment:", error);
      }
    );
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
      <div style={{ marginBottom: "1rem" }}>
        <p>
          Nonce:{" "}
          <button
            style={{
              color: "white",
              backgroundColor: "#50aad4",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              height: "2rem",
              textAlign: "center",
              marginRight: "0.5rem",
            }}
            onClick={() => {
              const seed = Math.floor(Math.random() + Date.now());
              const mt = mersenneTwister(seed);
              const nonce = mt.int32();
              (
                document.getElementById("nonceInput_Pay") as HTMLInputElement
              ).value = nonce.toString();
            }}
          >
            Generate random nonce
          </button>
          <input
            type="number"
            placeholder="Enter nonce"
            id="nonceInput_Pay"
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "25rem",
            }}
          />
        </p>
      </div>

      {/* Basic input fields */}
      {[
        {
          label: "Token address",
          id: "tokenAddress",
          type: "text",
          value: selectedToken,
          onChange: setSelectedToken,
        },
        { label: "Amount", id: "amountTokenInput_Pay", type: "number" },
        { label: "Priority fee", id: "priorityFeeInput_Pay", type: "number" },
      ].map(({ label, id, type, value, onChange }) => (
        <div key={id} style={{ marginBottom: "1rem" }}>
          <p>{label}</p>
          <input
            type={type}
            placeholder={`Enter ${label.toLowerCase()}`}
            id={id}
            value={value}
            onChange={onChange ? (e) => onChange(e.target.value) : undefined}
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
      <div style={{ marginBottom: "1rem" }}>
        <p>
          Are you using an executor?{" "}
          <select
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "5rem",
              marginRight: "0.5rem",
            }}
            onChange={(e) => setIsUsingExecutor(e.target.value === "true")}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
          {isUsingExecutor && (
            <input
              type="text"
              placeholder="Enter executor address"
              id="executorInput_Pay"
              style={{
                color: "black",
                backgroundColor: "white",
                height: "2rem",
                width: "25rem",
              }}
            />
          )}
        </p>
      </div>

      {/* Priority configuration */}
      <div style={{ marginBottom: "1rem" }}>
        <p>Priority</p>
        <select
          style={{
            color: "black",
            backgroundColor: "white",
            height: "2rem",
            width: "12rem",
          }}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low (synchronous nonce)</option>
          <option value="high">High (asynchronous nonce)</option>
        </select>
      </div>

      {/* Create signature button */}
      <button
        onClick={makePayment}
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
          </div>
        </div>
      )}
    </div>
  );
};
