"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { useEVVMSignatureBuilder } from "@/utils/EVVMSignatureBuilder/useEVVMSignatureBuilder";

import mersenneTwister from "@/utils/mersenneTwister";
import { TitleAndLink } from "../TitleAndLink";

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

const copyButtonStyle = {
  color: "black",
  backgroundColor: "white",
  border: "none",
  cursor: "pointer",
  paddingLeft: "0.5rem",
};

export const DispersePaySignatureConstructor = () => {
  const [isUsingExecutorDisperse, setIsUsingExecutorDisperse] =
    React.useState(false);
  const [priorityDisperse, setPriorityDisperse] = React.useState("low");
  const [isUsingUsernameOnDisperse, setIsUsingUsernameOnDisperse] =
    React.useState<Array<boolean>>([true, true, true, true, true]);
  const [numberOfUsersToDisperse, setNumberOfUsersToDisperse] =
    React.useState(1);

  const [dispersePayMetadata, setDispersePayMetadata] =
    React.useState<DispersePayData | null>(null);

  const [showDataDisperse, setShowDataDisperse] = React.useState(false);

  const { signDispersePay } = useEVVMSignatureBuilder();

  const makeDispersePayment = async () => {
    // Get the connected wallet account
    const account = getAccount(config);

    // Get token address from input field
    const TokenAddress = (
      document.getElementById("tokenAddressDispersePay") as HTMLInputElement
    ).value;

    // Collect user data from form inputs
    const To: string[] = [];
    const IsUsingUsernames: boolean[] = [];
    const AmountToUser: string[] = [];

    // Loop through each user and collect their data
    for (let i = 0; i < numberOfUsersToDisperse; i++) {
      const isUsingUsername = isUsingUsernameOnDisperse[i];
      const toInputId = isUsingUsername
        ? `toUsernameSplitUserNumber${i}`
        : `toAddressSplitUserNumber${i}`;
      const amountInputId = `amountTokenToGiveUser${i}`;

      const to = (document.getElementById(toInputId) as HTMLInputElement).value;
      const amountToUser = (
        document.getElementById(amountInputId) as HTMLInputElement
      ).value;

      To.push(to);
      IsUsingUsernames.push(isUsingUsername);
      AmountToUser.push(amountToUser);
    }

    // Build the payment data array for each recipient
    const toData: DispersePayMetadata[] = [];
    for (let i = 0; i < numberOfUsersToDisperse; i++) {
      if (IsUsingUsernames[i]) {
        // For username: [amount, zero_address, username]
        toData.push({
          amount: AmountToUser[i],
          to_address: "0x0000000000000000000000000000000000000000",
          to_identity: To[i],
        });
      } else {
        // For address: [amount, address, empty_string]
        toData.push({
          amount: AmountToUser[i],
          to_address: To[i],
          to_identity: "",
        });
      }
    }

    // Get executor address or use zero address if not using executor
    const Executor = isUsingExecutorDisperse
      ? (document.getElementById("executorInputSplit") as HTMLInputElement)
          .value
      : "0x0000000000000000000000000000000000000000";

    // Get total amount and priority fee from inputs
    const Amount = (
      document.getElementById("amountTokenInputSplit") as HTMLInputElement
    ).value;

    const PriorityFee = (
      document.getElementById("priorityFeeInputSplit") as HTMLInputElement
    ).value;

  

    // Get nonce for the transaction
    const Nonce = (
      document.getElementById("nonceInputDispersePay") as HTMLInputElement
    ).value;

    // Sign the message with wallet
    signDispersePay(
      toData,
      TokenAddress,
      Amount,
      PriorityFee,
      Nonce,
      priorityDisperse === "high",
      Executor,
      (dispersePaySignature) => {
        // Set the complete payment metadata with signature
        setDispersePayMetadata({
          from: account.address as `0x${string}`,
          toData: toData,
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
      <div style={{ marginBottom: "1rem" }}>
        <p>Nonce:</p>
        <button
          style={{
            color: "white",
            backgroundColor: "#50aad4",
            border: "none",
            cursor: "pointer",
            padding: "0.5rem",
            height: "2rem",
            textAlign: "center",
          }}
          onClick={() => {
            const seed = Math.floor(Math.random() + Date.now());
            const mt = mersenneTwister(seed);
            const nonce = mt.int32();
            (
              document.getElementById(
                "nonceInputDispersePay"
              ) as HTMLInputElement
            ).value = nonce.toString();
          }}
        >
          Generate random nonce
        </button>
        <input
          type="number"
          placeholder="Enter nonce"
          id="nonceInputDispersePay"
          style={{
            color: "black",
            backgroundColor: "white",
            height: "2rem",
            width: "25rem",
          }}
        />
      </div>

      {/* Token address */}
      <div style={{ marginBottom: "1rem" }}>
        <p>Token address</p>
        <input
          type="text"
          placeholder="Enter token address"
          id="tokenAddressDispersePay"
          style={{
            color: "black",
            backgroundColor: "white",
            height: "2rem",
            width: "25rem",
          }}
          defaultValue="0x0000000000000000000000000000000000000000"
        />
      </div>

      {/* Amount */}
      <div style={{ marginBottom: "1rem" }}>
        <p>Amount</p>
        <input
          type="number"
          placeholder="Enter amount"
          id="amountTokenInputSplit"
          style={{
            color: "black",
            backgroundColor: "white",
            height: "2rem",
            width: "25rem",
          }}
        />
      </div>

      {/* Priority fee */}
      <div style={{ marginBottom: "1rem" }}>
        <p>Priority fee</p>
        <input
          type="number"
          placeholder="Enter priority fee"
          id="priorityFeeInputSplit"
          style={{
            color: "black",
            backgroundColor: "white",
            height: "2rem",
            width: "25rem",
          }}
        />
      </div>

      {/* Executor selection */}
      <div style={{ marginBottom: "1rem" }}>
        <p>Are you using an executor?</p>
        <select
          style={{
            color: "black",
            backgroundColor: "white",
            height: "2rem",
            width: "5rem",
          }}
          onChange={(e) =>
            setIsUsingExecutorDisperse(e.target.value === "true")
          }
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
        {isUsingExecutorDisperse && (
          <input
            type="text"
            placeholder="Enter executor"
            id="executorInputSplit"
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "25rem",
            }}
          />
        )}
      </div>

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
      <div style={{ marginTop: "1rem" }}>
        <p>Priority</p>
        <select
          style={{
            color: "black",
            backgroundColor: "white",
            height: "2rem",
            width: "12rem",
          }}
          onChange={(e) => setPriorityDisperse(e.target.value)}
        >
          <option value="low">Low (synchronous nonce)</option>
          <option value="high">High (asynchronous nonce)</option>
        </select>
      </div>

      {/* Make signature button */}
      <button
        onClick={makeDispersePayment}
        style={{ padding: "0.5rem", marginTop: "1rem" }}
      >
        Make signature
      </button>

      {/* Display results */}
      {dispersePayMetadata && (
        <div style={{ marginTop: "1rem" }}>
          {showDataDisperse && (
            <div
              style={{
                color: "black",
                backgroundColor: "#f0f0f0",
                padding: "1rem",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                textAlign: "left",
              }}
            >
              <p>
                From: {dispersePayMetadata.from}
                <button
                  style={copyButtonStyle}
                  onClick={() =>
                    navigator.clipboard.writeText(dispersePayMetadata.from)
                  }
                >
                  Copy
                </button>
              </p>
              {dispersePayMetadata.toData.map((data, idx) => (
                <div key={idx}>
                  <p>DispersePayMetadata #{idx}</p>
                  <p>
                    amount: {data.amount}
                    <button
                      style={copyButtonStyle}
                      onClick={() => navigator.clipboard.writeText(data.amount)}
                    >
                      Copy
                    </button>
                  </p>
                  <p>
                    to_address: {data.to_address}
                    <button
                      style={copyButtonStyle}
                      onClick={() =>
                        navigator.clipboard.writeText(data.to_address)
                      }
                    >
                      Copy
                    </button>
                  </p>
                  <p>
                    to_identity: {data.to_identity}
                    <button
                      style={copyButtonStyle}
                      onClick={() =>
                        navigator.clipboard.writeText(data.to_identity)
                      }
                    >
                      Copy
                    </button>
                  </p>
                </div>
              ))}
              <p>
                Token: {dispersePayMetadata.token}
                <button
                  style={copyButtonStyle}
                  onClick={() =>
                    navigator.clipboard.writeText(dispersePayMetadata.token)
                  }
                >
                  Copy
                </button>
              </p>
              <p>
                Amount: {dispersePayMetadata.amount}
                <button
                  style={copyButtonStyle}
                  onClick={() =>
                    navigator.clipboard.writeText(dispersePayMetadata.amount)
                  }
                >
                  Copy
                </button>
              </p>
              <p>
                Priority fee: {dispersePayMetadata.priorityFee}
                <button
                  style={copyButtonStyle}
                  onClick={() =>
                    navigator.clipboard.writeText(
                      dispersePayMetadata.priorityFee
                    )
                  }
                >
                  Copy
                </button>
              </p>
              <p>
                Priority: {dispersePayMetadata.priority ? "true" : "false"}
                <button
                  style={copyButtonStyle}
                  onClick={() =>
                    navigator.clipboard.writeText(
                      dispersePayMetadata.priority ? "true" : "false"
                    )
                  }
                >
                  Copy
                </button>
              </p>
              <p>
                Nonce: {dispersePayMetadata.nonce}
                <button
                  style={copyButtonStyle}
                  onClick={() =>
                    navigator.clipboard.writeText(dispersePayMetadata.nonce)
                  }
                >
                  Copy
                </button>
              </p>
              <p>
                Executor: {dispersePayMetadata.executor}
                <button
                  style={copyButtonStyle}
                  onClick={() =>
                    navigator.clipboard.writeText(dispersePayMetadata.executor)
                  }
                >
                  Copy
                </button>
              </p>
              <p>
                Signature: {dispersePayMetadata.signature}
                <button
                  style={copyButtonStyle}
                  onClick={() =>
                    navigator.clipboard.writeText(dispersePayMetadata.signature)
                  }
                >
                  Copy
                </button>
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginTop: "1rem",
            }}
          >
            <button onClick={() => setShowDataDisperse(!showDataDisperse)}>
              {showDataDisperse ? "Hide data" : "Show data"}
            </button>
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  JSON.stringify(dispersePayMetadata)
                )
              }
            >
              Copy for JSON
            </button>
            <button
              onClick={() => {
                const dataToCopy = dispersePayMetadata.toData
                  .map(
                    (
                      data,
                      idx
                    ) => `dispersePayMetadata[${idx}] = EvvmMock.DispersePayMetadata({
                    amount: ${data.amount},
                    to_address: ${data.to_address},
                    to_identity: ${data.to_identity}
                });`
                  )
                  .join("\n");
                navigator.clipboard.writeText(dataToCopy);
              }}
            >
              Copy dispersePaymetadata for Solidity
            </button>
            <button
              onClick={() => {
                const dataToCopy = `dispersePay(
                ${dispersePayMetadata.from},
                dispersePayMetadata,
                ${dispersePayMetadata.token},
                ${dispersePayMetadata.amount},
                ${dispersePayMetadata.priorityFee},
                ${dispersePayMetadata.priority},
                ${dispersePayMetadata.nonce},
                ${dispersePayMetadata.executor},
                ${dispersePayMetadata.signature}
              )`;
                navigator.clipboard.writeText(dataToCopy);
              }}
            >
              Copy dispersePay for Solidity
            </button>
            <button
              style={{ backgroundColor: "red", color: "white" }}
              onClick={() => setDispersePayMetadata(null)}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
