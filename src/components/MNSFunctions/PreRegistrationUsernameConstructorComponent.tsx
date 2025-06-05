"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import mersenneTwister from "@/utils/mersenneTwister";
import { useMnsSignatureBuilder } from "@/utils/EVVMSignatureBuilder/useMnsSignatureBuilder";
import { TitleAndLink } from "../TitleAndLink";
import { hashPreRegisteredUsername } from "@/utils/EVVMSignatureBuilder/hashTools";

type PreRegistrationData = {
  user: `0x${string}`;
  nonce: string;
  hashUsername: string;
  priorityFeeForFisher: string;
  signature: string;
  nonce_Evvm: string;
  priority_Evvm: string;
  signature_Evvm: string;
};

export const PreRegistrationUsernameConstructorComponent = () => {
  const { signPreRegistrationUsername } =
    useMnsSignatureBuilder();
  const account = getAccount(config);

  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<PreRegistrationData | null>(
    null
  );
  const [showData, setShowData] = React.useState(false);

  const makeSig = async () => {


    const addressMNS = (
      document.getElementById(
        "mnsAddressInput_preRegistration"
      ) as HTMLInputElement
    ).value;
    const nonceMNS = (
      document.getElementById(
        "nonceMNSInput_preRegistration"
      ) as HTMLInputElement
    ).value;
    const username = (
      document.getElementById(
        "usernameInput_preRegistration"
      ) as HTMLInputElement
    ).value;
    const clowNumber = (
      document.getElementById(
        "clowNumberInput_preRegistration"
      ) as HTMLInputElement
    ).value;
    const priorityFeeForFisher = (
      document.getElementById(
        "priorityFeeInput_preRegistration"
      ) as HTMLInputElement
    ).value;
    const nonceEVVM = (
      document.getElementById(
        "nonceEVVMInput_preRegistration"
      ) as HTMLInputElement
    ).value;
    const priorityFlag = priority === "high";

    // Sign the message
    signPreRegistrationUsername(
      addressMNS,
      BigInt(nonceMNS),
      username,
      BigInt(clowNumber),
      BigInt(priorityFeeForFisher),
      BigInt(nonceEVVM),
      priorityFlag,
      (paySignature, preRegistrationSignature) => {
        // Create the PayData object with all the payment information and signature
        setDataToGet({
          user: account.address as `0x${string}`,
          nonce: nonceMNS,
          hashUsername: hashPreRegisteredUsername(username, BigInt(clowNumber)),
          priorityFeeForFisher: priorityFeeForFisher,
          signature: preRegistrationSignature,
          nonce_Evvm: nonceEVVM,
          priority_Evvm: priorityFlag ? "true" : "false",
          signature_Evvm: paySignature,
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
        title="Pre-registration of username"
        link="https://www.evvm.org/docs/SignatureStructures/MNS/preRegistrationUsernameStructure"
      />

      <br />

      <div style={{ marginBottom: "1rem" }}>
        <p>
          MNS address:{" "}
          <input
            type="text"
            placeholder="Enter MNS address"
            id="mnsAddressInput_preRegistration"
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
          MNS Nonce:{" "}
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
                  "nonceMNSInput_preRegistration"
                ) as HTMLInputElement
              ).value = nonce.toString();
            }}
          >
            Generate random nonce
          </button>
          <input
            type="number"
            placeholder="Enter nonce"
            id="nonceMNSInput_preRegistration"
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "25rem",
            }}
          />
        </p>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <p>
          Clow Number:{" "}
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
                  "clowNumberInput_preRegistration"
                ) as HTMLInputElement
              ).value = nonce.toString();
            }}
          >
            Generate random nonce
          </button>
          <input
            type="number"
            placeholder="Enter nonce"
            id="clowNumberInput_preRegistration"
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
          label: "Username",
          id: "usernameInput_preRegistration",
          type: "text",
        },
        {
          label: "Priority fee",
          id: "priorityFeeInput_preRegistration",
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
                  "nonceEVVMInput_preRegistration"
                ) as HTMLInputElement
              ).value = nonce.toString();
            }}
          >
            Generate random nonce
          </button>
          <input
            type="number"
            placeholder="Enter nonce"
            id="nonceEVVMInput_preRegistration"
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
