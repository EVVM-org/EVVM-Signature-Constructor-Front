"use client";
import React from "react";
import { getAccount } from "@wagmi/core";
import { config } from "@/config/index";
import { useEVVMSignatureBuilder } from "@/utils/EVVMSignatureBuilder/useEVVMSignatureBuilder";

import mersenneTwister from "@/utils/mersenneTwister";
import { TitleAndLink } from "@/components/TitleAndLink";
import { DetailedData } from "@/components/DetailedData";

import styles from "@/components/SigConstructors/SignatureConstructor.module.css";

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

  const { signDispersePay } = useEVVMSignatureBuilder();

  const getValue = (id: string) =>
    (document.getElementById(id) as HTMLInputElement).value;

  const makeSig = async () => {
    const account = getAccount(config);
    const TokenAddress = getValue("tokenAddressDispersePay");
    const Amount = getValue("amountTokenInputSplit");
    const PriorityFee = getValue("priorityFeeInputSplit");
    const Nonce = getValue("nonceInputDispersePay");
    const Executor = isUsingExecutorDisperse
      ? getValue("executorInputSplit")
      : "0x0000000000000000000000000000000000000000";

    const toData: DispersePayMetadata[] = [];
    for (let i = 0; i < numberOfUsersToDisperse; i++) {
      const isUsingUsername = isUsingUsernameOnDisperse[i];
      const toInputId = isUsingUsername
        ? `toUsernameSplitUserNumber${i}`
        : `toAddressSplitUserNumber${i}`;
      const to = getValue(toInputId);
      const amount = getValue(`amountTokenToGiveUser${i}`);

      toData.push({
        amount,
        to_address: isUsingUsername
          ? "0x0000000000000000000000000000000000000000"
          : to,
        to_identity: isUsingUsername ? to : "",
      });
    }

    signDispersePay(
      toData,
      TokenAddress,
      Amount,
      PriorityFee,
      Nonce,
      priorityDisperse === "high",
      Executor,
      (dispersePaySignature) => {
        setDispersePayMetadata({
          from: account.address as `0x${string}`,
          toData,
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
          className={styles.nonceButton}
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
          className={styles.nonceInput}
        />
      </div>

      {/* Token address */}
      <div style={{ marginBottom: "1rem" }}>
        <p>Token address</p>
        <input
          type="text"
          placeholder="Enter token address"
          id="tokenAddressDispersePay"
          className={styles.addressInput}
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
          className={styles.amountInput}
        />
      </div>

      {/* Priority fee */}
      <div style={{ marginBottom: "1rem" }}>
        <p>Priority fee</p>
        <input
          type="number"
          placeholder="Enter priority fee"
          id="priorityFeeInputSplit"
          className={styles.amountInput}
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
        onClick={makeSig}
        style={{ padding: "0.5rem", marginTop: "1rem" }}
      >
        Make signature
      </button>

      {/* Display results */}
      {dispersePayMetadata && (
        <div style={{ marginTop: "2rem" }}>
          <DetailedData dataToGet={dispersePayMetadata} />

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
