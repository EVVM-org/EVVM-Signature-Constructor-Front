"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import mersenneTwister from "@/utils/mersenneTwister";
import { useSMateSignatureBuilder } from "@/utils/EVVMSignatureBuilder/useSMateSignatureBuilder";
import { DetailedData } from "@/components/DetailedData";

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

  const makeSigGoldenStaker = async () => {
    // Get form values
    const nonceEVVM = (
      document.getElementById("nonceInput_GoldenStaking") as HTMLInputElement
    ).value;
    const sMateAddress = (
      document.getElementById(
        "sMateAddressInput_GoldenStaking"
      ) as HTMLInputElement
    ).value;
    const stakingAmount =
      Number(
        (
          document.getElementById(
            "amountOfSMateInput_GoldenStaking"
          ) as HTMLInputElement
        ).value
      ) *
      (5083 * 10 ** 18);

    // Sign message
    signGoldenStaking(
      sMateAddress,
      stakingAmount,
      nonceEVVM,
      priority === "high",
      (stakingSignature) => {
        // Set pay data
        setDataToGet({
          isStaking: isStaking.toString(),
          from: account.address as `0x${string}`,
          to_address: sMateAddress as `0x${string}`,
          token: "0x0000000000000000000000000000000000000001", // sMATE token address
          amount: (stakingAmount * (5083 * 10 ** 18)).toLocaleString(
            "fullwide",
            {
              useGrouping: false,
            }
          ),
          priorityFee: "0", // Assuming no priority fee for staking
          nonce: nonceEVVM,
          priority: priority,
          executor: sMateAddress as `0x${string}`,
          signature: stakingSignature,
        });
      },
      (error) => {
        console.error("Error signing presale staking:", error);
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
            id="sMateAddressInput_GoldenStaking"
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
                document.getElementById(
                  "nonceInput_GoldenStaking"
                ) as HTMLInputElement
              ).value = nonce.toString();
            }}
          >
            Generate random nonce
          </button>
          <input
            type="number"
            placeholder="Enter nonce"
            id="nonceInput_GoldenStaking"
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
          label: "Amount of sMATE",
          id: "amountOfSMateInput_GoldenStaking",
          type: "number",
        },
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
