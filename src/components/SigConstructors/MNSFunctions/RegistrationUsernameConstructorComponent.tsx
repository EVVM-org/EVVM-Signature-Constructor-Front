"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import mersenneTwister from "@/utils/mersenneTwister";
import { useMnsSignatureBuilder } from "@/utils/EVVMSignatureBuilder/useMnsSignatureBuilder";
import { TitleAndLink } from "@/components/TitleAndLink";
import { DetailedData } from "@/components/DetailedData";

import styles from "@/components/SigConstructors/SignatureConstructor.module.css";

type RegistrationData = {
  user: `0x${string}`;
  nonce: string;
  username: string;
  clowNumber: string;
  signature: string;
  priorityFeeForFisher: string;
  nonce_Evvm: string;
  priority_Evvm: string;
  signature_Evvm: string;
};

export const RegistrationUsernameConstructorComponent = () => {
  const { signRegistrationUsername } = useMnsSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<RegistrationData | null>(
    null
  );

  const makeSig = async () => {
    const getValue = (id: string) => 
      (document.getElementById(id) as HTMLInputElement).value;

    const addressMNS = getValue("mnsAddressInput_registration");
    const nonceMNS = getValue("nonceMNSInput_registration");
    const username = getValue("usernameInput_registration");
    const clowNumber = getValue("clowNumberInput_registration");
    const mateRewardAmount = getValue("mateRewardInput_registration");
    const priorityFeeForFisher = getValue("priorityFeeInput_registration");
    const nonceEVVM = getValue("nonceEVVMInput_registration");
    const priorityFlag = priority === "high";

    signRegistrationUsername(
      addressMNS,
      BigInt(nonceMNS),
      username,
      BigInt(clowNumber),
      BigInt(mateRewardAmount),
      BigInt(priorityFeeForFisher),
      BigInt(nonceEVVM),
      priorityFlag,
      (paySignature, registrationSignature) => {
        setDataToGet({
          user: account.address as `0x${string}`,
          nonce: nonceMNS,
          username,
          clowNumber,
          signature: registrationSignature,
          priorityFeeForFisher,
          nonce_Evvm: nonceEVVM,
          priority_Evvm: priorityFlag ? "true" : "false",
          signature_Evvm: paySignature,
        });
      },
      (error) => console.error("Error signing payment:", error)
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Registration of username"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/registrationUsernameStructure"
      />

      <br />

      <div style={{ marginBottom: "1rem" }}>
        <p>
          MNS address:{" "}
          <input
            type="text"
            placeholder="Enter MNS address"
            id="mnsAddressInput_registration"
            className={styles.addressInput}
          />
        </p>
      </div>

      {/* Nonce section with automatic generator */}
      <div style={{ marginBottom: "1rem" }}>
        <p>
          MNS Nonce:{" "}
          <button
            className={styles.nonceButton}
            onClick={() => {
              const seed = Math.floor(Math.random() + Date.now());
              const mt = mersenneTwister(seed);
              const nonce = mt.int32();
              (
                document.getElementById(
                  "nonceMNSInput_registration"
                ) as HTMLInputElement
              ).value = nonce.toString();
            }}
          >
            Generate random nonce
          </button>
          <input
            type="number"
            placeholder="Enter nonce"
            id="nonceMNSInput_registration"
            className={styles.nonceInput}
          />
        </p>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <p>
          Clow Number:{" "}
          <input
            type="number"
            placeholder="Enter clow number"
            id="clowNumberInput_registration"
            className={styles.nonceInput}
          />
        </p>
      </div>

      {/* Basic input fields */}
      {[
        {
          label: "Username",
          id: "usernameInput_registration",
          type: "text",
        },
        {
          label: "Mate reward amount",
          id: "mateRewardInput_registration",
          type: "number",
        },
        {
          label: "Priority fee",
          id: "priorityFeeInput_registration",
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

      <div style={{ marginBottom: "1rem" }}>
        <p>
          EVVM Nonce:{" "}
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
                  "nonceEVVMInput_registration"
                ) as HTMLInputElement
              ).value = nonce.toString();
            }}
          >
            Generate random nonce
          </button>
          <input
            type="number"
            placeholder="Enter nonce"
            id="nonceEVVMInput_registration"
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "25rem",
            }}
          />
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
        onClick={makeSig}
        style={{
          padding: "0.5rem",
          marginTop: "1rem",
        }}
      >
        Make signature
      </button>

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
