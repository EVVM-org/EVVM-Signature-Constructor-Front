"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { useSignMessage } from "wagmi";
import { config } from "../../config/index";
import mersenneTwister from "../../utils/mersenneTwister";
import { buildMessageSignedForPay } from "../../utils/constructMessage";

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

  const [isStaking, setIsStaking] = React.useState(true);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<PayData | null>(null);
  const [showData, setShowData] = React.useState(false);

  const { signMessage } = useSignMessage();

  const makeSigGoldenStaker = async () => {
    // Get the nonce value from the input field
    const nonce = (document.getElementById("nonceInput") as HTMLInputElement)
      .value;

    // Get the recipient value - either username or address based on user selection
    const to = (
      document.getElementById("sMateAddressInput") as HTMLInputElement
    ).value;

    // Get the executor address if using executor, otherwise use zero address
    const executor = (
      document.getElementById("sMateAddressInput") as HTMLInputElement
    ).value;

    // Get the amount of tokens to transfer
    const ammountConverted = (
      Number(
        (document.getElementById("amountOfSMateInput") as HTMLInputElement)
          .value
      ) *
      (5083 * 10 ** 18)
    ).toLocaleString("fullwide", { useGrouping: false });

    // Sign the message using wagmi's signMessage hook
    signMessage(
      {
        // Build the message to be signed with all the payment parameters
        message: buildMessageSignedForPay(
          to,
          "0x0000000000000000000000000000000000000001",
          ammountConverted,
          "0",
          nonce!,
          priority === "high", // Convert priority to boolean (high = true, low = false)
          executor
        ),
      },
      {
        // Handle successful signature
        onSuccess: async (data, variables, context) => {
          console.log("----------Message signed----------");
          console.log(data);

          // Create the PayData object with all the payment information and signature
          setDataToGet({
            isStaking: isStaking ? "true" : "false", // Convert boolean to string
            from: account.address as `0x${string}`, // Current user's wallet address
            to_address: to as `0x${string}`,
            token: "0x0000000000000000000000000000000000000001",
            amount: ammountConverted,
            priorityFee: "0",
            nonce: nonce,
            priority: priority === "high" ? "true" : "false", // Convert boolean to string
            executor: executor,
            signature: data, // The generated signature from the wallet
          });
        },
      }
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <h1>Golden staking</h1>
      <br />

      <div style={{ marginBottom: "1rem" }}>
        <p>
          Action:{" "}
          <select
            onChange={(e) => setIsStaking(e.target.value === "true")}
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "5rem",
            }}
          >
            <option value="true">Staking</option>
            <option value="false">Unstaking</option>
          </select>
        </p>
      </div>

      {/* Recipient configuration section */}
      <div style={{ marginBottom: "1rem" }}>
        <p>
          sMate address:{" "}
          <input
            type="text"
            placeholder="Enter sMate address"
            id="sMateAddressInput"
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
                document.getElementById("nonceInput") as HTMLInputElement
              ).value = nonce.toString();
            }}
          >
            Generate random nonce
          </button>
          <input
            type="number"
            placeholder="Enter nonce"
            id="nonceInput"
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
        { label: "Amount of sMATE", id: "amountOfSMateInput", type: "number" },
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
        onClick={makeSigGoldenStaker}
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
          <h2>Ready</h2>

          <button
            style={{
              margin: "0.5rem",
              borderRadius: "5px",
            }}
            onClick={() => setShowData(!showData)}
          >
            {showData ? "Hide data" : "Show data"}
          </button>

          {/* Detailed data */}
          {showData && (
            <div
              style={{
                color: "black",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                backgroundColor: "#f0f0f0",
                textAlign: "left",
                padding: "1rem",
                marginTop: "1rem",
              }}
            >
              {Object.entries(dataToGet).map(([key, value]) => (
                <div key={key} style={{ marginBottom: "0.5rem" }}>
                  {`${key}: ${value} `}
                  <button
                    style={{
                      color: "white",
                      backgroundColor: "#637988",
                      padding: "0.3rem",
                      border: "none",
                      cursor: "pointer",
                      marginLeft: "0.5rem",
                    }}
                    onClick={() => navigator.clipboard.writeText(value)}
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div style={{ marginTop: "1rem" }}>
            <button
              style={{
                padding: "0.5rem",
                margin: "0.5rem",
                borderRadius: "5px",
              }}
              onClick={() =>
                navigator.clipboard.writeText(
                  JSON.stringify(dataToGet, null, 2)
                )
              }
            >
              Copy for JSON
            </button>

            <button
              style={{
                padding: "0.5rem",
                margin: "0.5rem",
                borderRadius: "5px",
              }}
              onClick={() => {
                const solidityCode = `PayData({from: ${
                  dataToGet.from
                }, to_address: ${dataToGet.to_address}, token: ${
                  dataToGet.token
                }, amount: ${dataToGet.amount}, priorityFee: ${
                  dataToGet.priorityFee
                }, nonce: ${dataToGet.nonce}, priority: ${
                  dataToGet.priority
                }, executor: ${
                  dataToGet.executor
                }, signature: hex"${dataToGet.signature.slice(2)}"});`;
                navigator.clipboard.writeText(solidityCode);
              }}
            >
              Copy for Solidity
            </button>

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
