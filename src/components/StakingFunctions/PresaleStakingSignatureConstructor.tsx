"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import mersenneTwister from "@/utils/mersenneTwister";
import { useSMateSignatureBuilder } from "@/utils/EVVMSignatureBuilder/useSMateSignatureBuilder";

type PayData = {
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

type PresaleStakingData = {
  isStaking: string;
  amount: string;
  nonce: string;
  signature: string;
  priorityFee_Evvm: string;
  nonce_Evvm: string;
  priority_Evvm: string;
  signature_Evvm: string;
};

export const PresaleStakingSignatureConstructor = () => {
  const account = getAccount(config);
  const { signPresaleStaking } = useSMateSignatureBuilder();

  const [isStaking, setIsStaking] = React.useState(true);
  const [priority, setPriority] = React.useState("low");

  const [payDataInfo, setPayDataInfo] = React.useState<PayData | null>(null);
  const [presaleStakingDataInfo, setPresaleStakingDataInfo] =
    React.useState<PresaleStakingData | null>(null);
  const [showData, setShowData] = React.useState(false);

  const makeSigPresaleStaking = async () => {
    // Get form values
    const nonceEVVM = (
      document.getElementById(
        "nonceEVVMInput_presaleStaking"
      ) as HTMLInputElement
    ).value;
    const nonceSMATE = (
      document.getElementById(
        "nonceSMATEInput_presaleStaking"
      ) as HTMLInputElement
    ).value;
    const sMateAddressElement = document.getElementById(
      "sMateAddressInput_presaleStaking"
    ) as HTMLInputElement;
    const sMateAddress = sMateAddressElement?.value || "";

    const amount = Number(
      (
        document.getElementById(
          "amountOfSMateInput_presaleStaking"
        ) as HTMLInputElement
      ).value
    );
    const priorityFee = (
      document.getElementById(
        "priorityFeeInput_presaleStaking"
      ) as HTMLInputElement
    ).value;

    // Sign message
    signPresaleStaking(
      sMateAddress,
      amount,
      priorityFee,
      nonceEVVM,
      priority === "high",
      isStaking,
      nonceSMATE,
      (paySignature, stakingSignature) => {
        // Set pay data
        setPayDataInfo({
          from: account.address as `0x${string}`,
          to_address: sMateAddress as `0x${string}`,
          token: "0x0000000000000000000000000000000000000001",
          amount: isStaking
            ? (amount * (5083 * 10 ** 18)).toLocaleString("fullwide", {
                useGrouping: false,
              })
            : "0",
          priorityFee: priorityFee,
          nonce: nonceEVVM,
          priority: (priority === "high").toString(),
          executor: sMateAddress,
          signature: paySignature,
        });

        // Set staking data
        setPresaleStakingDataInfo({
          isStaking: isStaking.toString(),
          amount: amount.toString(),
          nonce: nonceSMATE,
          signature: stakingSignature,
          priorityFee_Evvm: priorityFee.toString(),
          nonce_Evvm: nonceEVVM,
          priority_Evvm: priority.toString(),
          signature_Evvm: paySignature,
        });
      },
      (error) => {
        console.error("Error signing presale staking:", error);
      }
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      {/* Header Section */}
      <h1>Presale Staking</h1>
      <h3 style={{ textAlign: "center", color: "#3A9EE3" }}>
        <a href="https://www.evvm.org/docs/SignatureStructures/SMate/StakingUnstakingStructure">
          Learn more about presale staking signatures structure here
        </a>
      </h3>
      <br />
      {/* Configuration Section */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
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
        </label>
      </div>

      {/* Address Input */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          sMate address:{" "}
          <input
            type="text"
            placeholder="Enter sMate address"
            id="sMateAddressInput_presaleStaking"
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "25rem",
            }}
          />
        </label>
      </div>

      {/* Nonce Generators */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          EVVM Nonce:{" "}
          <button
            style={{
              backgroundColor: "#50aad4",
              color: "white",
              border: "none",
              padding: "0.5rem",
              marginRight: "0.5rem",
            }}
            onClick={() => {
              const nonce = mersenneTwister(
                Math.floor(Math.random() + Date.now())
              ).int32();
              (
                document.getElementById(
                  "nonceEVVMInput_presaleStaking"
                ) as HTMLInputElement
              ).value = nonce.toString();
            }}
          >
            Generate
          </button>
          <input
            type="number"
            id="nonceEVVMInput_presaleStaking"
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "20rem",
            }}
          />
        </label>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          sMate Nonce:{" "}
          <button
            style={{
              backgroundColor: "#50aad4",
              color: "white",
              border: "none",
              padding: "0.5rem",
              marginRight: "0.5rem",
            }}
            onClick={() => {
              const nonce = mersenneTwister(
                Math.floor(Math.random() + Date.now())
              ).int32();
              (
                document.getElementById(
                  "nonceSMATEInput_presaleStaking"
                ) as HTMLInputElement
              ).value = nonce.toString();
            }}
          >
            Generate
          </button>
          <input
            type="number"
            id="nonceSMATEInput_presaleStaking"
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "20rem",
            }}
          />
        </label>
      </div>

      {/* Amount Inputs */}
      <div style={{ marginBottom: "1rem" }}>
        <p>Amount of sMate to{isStaking ? " stake" : " unstake"}: </p>
        <input
          type="number"
          id="amountOfSMateInput_presaleStaking"
          style={{
            color: "black",
            backgroundColor: "white",
            height: "2rem",
            width: "25rem",
          }}
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label>
          Priority fee:{" "}
          <input
            type="number"
            id="priorityFeeInput_presaleStaking"
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "25rem",
            }}
          />
        </label>
      </div>

      {/* Priority Selection */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Priority:{" "}
          <select
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "10rem",
            }}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low (synchronous)</option>
            <option value="high">High (asynchronous)</option>
          </select>
        </label>
      </div>

      {/* Action Button */}
      <button
        onClick={makeSigPresaleStaking}
        style={{
          padding: "0.5rem 1rem",
          marginTop: "1rem",
          backgroundColor: "#50aad4",
          color: "white",
          border: "none",
        }}
      >
        Create Signature
      </button>

      {/* Results Section */}
      {payDataInfo && presaleStakingDataInfo && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Signature Ready</h2>

          <button
            onClick={() => setShowData(!showData)}
            style={{ margin: "0.5rem", padding: "0.5rem", borderRadius: "5px" }}
          >
            {showData ? "Hide Details" : "Show Details"}
          </button>

          {/* Data Display */}
          {showData && (
            <div
              style={{
                backgroundColor: "#f0f0f0",
                padding: "1rem",
                marginTop: "1rem",
                color: "black",
              }}
            >
              <h3>Pay Data:</h3>
              {Object.entries(payDataInfo).map(([key, value]) => (
                <div key={key} style={{ marginBottom: "0.5rem" }}>
                  <strong>{key}:</strong> {value}
                  <button
                    onClick={() => navigator.clipboard.writeText(value)}
                    style={{
                      backgroundColor: "#637988",
                      color: "white",
                      border: "none",
                      padding: "0.2rem",
                      marginLeft: "0.5rem",
                    }}
                  >
                    Copy
                  </button>
                </div>
              ))}

              <h3>Staking Data:</h3>
              {Object.entries(presaleStakingDataInfo).map(([key, value]) => (
                <div key={key} style={{ marginBottom: "0.5rem" }}>
                  <strong>{key}:</strong> {value}
                  <button
                    onClick={() => navigator.clipboard.writeText(value)}
                    style={{
                      backgroundColor: "#637988",
                      color: "white",
                      border: "none",
                      padding: "0.2rem",
                      marginLeft: "0.5rem",
                    }}
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={() =>
                navigator.clipboard.writeText(
                  JSON.stringify(presaleStakingDataInfo, null, 2)
                )
              }
              style={{
                padding: "0.5rem",
                margin: "0.5rem",
                borderRadius: "5px",
              }}
            >
              Copy JSON
            </button>

            <button
              onClick={() => setPayDataInfo(null)}
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "0.5rem",
                margin: "0.5rem",
                borderRadius: "5px",
                border: "none",
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
