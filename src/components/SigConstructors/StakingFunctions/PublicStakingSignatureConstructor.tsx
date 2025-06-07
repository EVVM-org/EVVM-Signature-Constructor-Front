"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import mersenneTwister from "@/utils/mersenneTwister";
import { useSMateSignatureBuilder } from "@/utils/EVVMSignatureBuilder/useSMateSignatureBuilder";
import { TitleAndLink } from "@/components/TitleAndLink";
import { DetailedData } from "@/components/DetailedData";

type PublicStakingData = {
  isStaking: string;
  amount: string;
  nonce: string;
  signature: string;
  priorityFee_Evvm: string;
  nonce_Evvm: string;
  priority_Evvm: string;
  signature_Evvm: string;
};

export const PublicStakingSignatureConstructor = () => {
  const account = getAccount(config);
  const { signPublicStaking } = useSMateSignatureBuilder();
  const [isStaking, setIsStaking] = React.useState(true);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<PublicStakingData | null>(
    null
  );
  const [showData, setShowData] = React.useState(false);

  const makeSigPublicStaking = async () => {
    // Get form values
    const nonceEVVM = (
      document.getElementById(
        "nonceEVVMInput_PublicStaking"
      ) as HTMLInputElement
    ).value;
    const nonceSMATE = (
      document.getElementById(
        "nonceSMATEInput_PublicStaking"
      ) as HTMLInputElement
    ).value;
    const sMateAddressElement = document.getElementById(
      "sMateAddressInput_PublicStaking"
    ) as HTMLInputElement;
    const sMateAddress = sMateAddressElement?.value || "";

    if (!sMateAddress) {
      alert("Please enter a sMate address");
      return;
    }
    console.log("sMateAddress", sMateAddress);
    const amount = Number(
      (
        document.getElementById(
          "amountOfSMateInput_PublicStaking"
        ) as HTMLInputElement
      ).value
    );

    const priorityFee = (
      document.getElementById(
        "priorityFeeInput_PublicStaking"
      ) as HTMLInputElement
    ).value;

    // Sign message
    signPublicStaking(
      sMateAddress,
      amount,
      priorityFee,
      nonceEVVM,
      priority === "high",
      isStaking,
      nonceSMATE,
      (paySignature, stakingSignature) => {
        setDataToGet({
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
      <TitleAndLink
        title="Public Staking"
        link="https://www.evvm.org/docs/SignatureStructures/SMate/StakingUnstakingStructure"
      />
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
            id="sMateAddressInput_PublicStaking"
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
                  "nonceEVVMInput_PublicStaking"
                ) as HTMLInputElement
              ).value = nonce.toString();
            }}
          >
            Generate
          </button>
          <input
            type="number"
            id="nonceEVVMInput_PublicStaking"
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
                  "nonceSMATEInput_PublicStaking"
                ) as HTMLInputElement
              ).value = nonce.toString();
            }}
          >
            Generate
          </button>
          <input
            type="number"
            id="nonceSMATEInput_PublicStaking"
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
          id="amountOfSMateInput_PublicStaking"
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
            id="priorityFeeInput_PublicStaking"
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
        onClick={makeSigPublicStaking}
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
