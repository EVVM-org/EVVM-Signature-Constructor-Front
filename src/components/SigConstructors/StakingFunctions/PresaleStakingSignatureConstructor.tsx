"use client";
import React from "react";
import { useSMateSignatureBuilder } from "@/utils/EVVMSignatureBuilder/useSMateSignatureBuilder";
import { TitleAndLink } from "@/components/SigConstructors/TitleAndLink";
import { DetailedData } from "@/components/DetailedData";
import { NumberInputWithGenerator } from "@/components/SigConstructors/NumberInputWithGenerator";

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
  const { signPresaleStaking } = useSMateSignatureBuilder();

  const [isStaking, setIsStaking] = React.useState(true);
  const [priority, setPriority] = React.useState("low");

  const [dataToGet, setDataToGet] = React.useState<PresaleStakingData | null>(
    null
  );

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const sMateAddress = getValue("sMateAddressInput_presaleStaking");
    const amount = Number(getValue("amountOfSMateInput_presaleStaking"));
    const priorityFee = getValue("priorityFeeInput_presaleStaking");
    const nonceEVVM = getValue("nonceEVVMInput_presaleStaking");
    const nonceSMATE = getValue("nonceSMATEInput_presaleStaking");

    signPresaleStaking(
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
          priorityFee_Evvm: priorityFee,
          nonce_Evvm: nonceEVVM,
          priority_Evvm: priority,
          signature_Evvm: paySignature,
        });
      },
      (error) => console.error("Error signing presale staking:", error)
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Presale Staking"
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

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_presaleStaking"
        placeholder="Enter nonce"
      />

      <NumberInputWithGenerator
        label="sMate Nonce"
        inputId="nonceSMATEInput_presaleStaking"
        placeholder="Enter nonce"
      />

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
        onClick={makeSig}
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
