import React from "react";
import { getAccount } from "@wagmi/core";
import { useSignMessage } from "wagmi";
import { config } from "../../config/index";
import mersenneTwister from "../../utils/mersenneTwister";
import { buildMessageSignedForPay } from "../../utils/constructMessage";

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

const copyButtonStyle = {
  color: "black",
  backgroundColor: "white",
  border: "none",
  cursor: "pointer",
  paddingLeft: "0.5rem",
};

export const PaySignaturesConstructorComponent = () => {
  const account = getAccount(config);

  const [selectedToken, setSelectedToken] = React.useState(
    "0x0000000000000000000000000000000000000000"
  );
  const [isUsingUsernames, setIsUsingUsernames] = React.useState(true);
  const [isUsingExecutor, setIsUsingExecutor] = React.useState(false);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<PayData | null>(null);
  const [showData, setShowData] = React.useState(false);

  const { signMessage } = useSignMessage();

  const makePayment = async () => {
    // Get the nonce value from the input field
    const nonce = (document.getElementById("nonceInput") as HTMLInputElement)
      .value;

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
      ? (document.getElementById("executorInput") as HTMLInputElement).value
      : "0x0000000000000000000000000000000000000000";

    // Get the amount of tokens to transfer
    const ammountConverted = (
      document.getElementById("amountTokenInput") as HTMLInputElement
    ).value;

    // Get the priority fee value
    const priorityFeeConverted = (
      document.getElementById("priorityFeeInput") as HTMLInputElement
    ).value;

    // Sign the message using wagmi's signMessage hook
    signMessage(
      {
        // Build the message to be signed with all the payment parameters
        message: buildMessageSignedForPay(
          to,
          tokenAddress,
          ammountConverted,
          priorityFeeConverted,
          nonce!.toString(),
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
            from: account.address as `0x${string}`, // Current user's wallet address
            to_address: (to.startsWith("0x")
              ? to
              : "0x0000000000000000000000000000000000000000") as `0x${string}`, // Use address if provided, otherwise zero address
            to_identity: to.startsWith("0x") ? "" : to, // Use username if not an address, otherwise empty
            token: tokenAddress,
            amount: ammountConverted,
            priorityFee: priorityFeeConverted.toString(),
            nonce: nonce.toString(),
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
      <h1>Single pay</h1>
      <h3 style={{ textAlign: "center", color: "#3A9EE3" }}>
        <a href="https://www.evvm.org/docs/SignatureStructures/EVVM/SinglePaymentSignatureStructure">
          Learn more about single payment signatures structure here
        </a>
      </h3>
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
              (document.getElementById("nonceInput") as HTMLInputElement).value = nonce.toString();
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
        { label: "Token address", id: "tokenAddress", type: "text", value: selectedToken, onChange: setSelectedToken },
        { label: "Amount", id: "amountTokenInput", type: "number" },
        { label: "Priority fee", id: "priorityFeeInput", type: "number" },
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
              id="executorInput"
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
              onClick={() => navigator.clipboard.writeText(JSON.stringify(dataToGet, null, 2))}
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
                const solidityCode = `PayData({from: ${dataToGet.from}, to_address: ${dataToGet.to_address}, to_identity: "${dataToGet.to_identity}", token: ${dataToGet.token}, amount: ${dataToGet.amount}, priorityFee: ${dataToGet.priorityFee}, nonce: ${dataToGet.nonce}, priority: ${dataToGet.priority}, executor: ${dataToGet.executor}, signature: hex"${dataToGet.signature.slice(2)}"});`;
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
