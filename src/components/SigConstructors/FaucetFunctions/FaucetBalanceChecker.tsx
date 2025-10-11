"use client";
import React, { useState } from "react";
import { readContract } from "@wagmi/core";
import { config } from "@/config/index";
import Evvm from "@/constants/abi/Evvm.json";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { HelperInfo } from "../InputsAndModules/HelperInfo";

interface FaucetBalanceCheckerProps {
  evvmAddress: string;
}

export const FaucetBalanceChecker: React.FC<FaucetBalanceCheckerProps> = ({
  evvmAddress,
}) => {
  const [balance, setBalance] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getValue = (id: string) =>
    (document.getElementById(id) as HTMLInputElement)?.value || "";

  const checkBalance = async () => {
    setLoading(true);
    setBalance(null);
    const user = getValue("faucetBalance_user");
    const token = getValue("faucetBalance_token");
    try {
      const result = await readContract(config, {
        abi: Evvm.abi,
        address: evvmAddress as `0x${string}`,
        functionName: "getBalance",
        args: [user, token],
      });
      setBalance(result ? result.toString() : "0");
    } catch (err) {
      setBalance("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-4">
      <h2>Balance</h2>
      <p>Check the balance of a user for a specific token.</p>
      <br />
      <AddressInputField
        label="User address"
        inputId="faucetBalance_user"
        placeholder="Enter user address"
      />
      <AddressInputField
        label="Token address"
        inputId="faucetBalance_token"
        placeholder="Enter token address"
      />

        <HelperInfo label="Most common token addresses">
          <div>
            <strong>ETH</strong> address:<br />
            0x0000000000000000000000000000000000000000
          </div>
          <div style={{ marginTop: 8 }}>
            <strong>MATE</strong> address:<br />
            0x0000000000000000000000000000000000000001
          </div>
        </HelperInfo>

      <button
        onClick={checkBalance}
        disabled={loading}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: 6,
          border: "1px solid #ccc",
          background: loading ? "#eee" : "#fff",
          margin: "0.5rem",
        }}
      >
        {loading ? "Checking..." : "Check Balance"}
      </button>
      {balance !== null && (
        <div style={{ marginTop: "0.5rem" }}>
          <strong>Balance:</strong> {balance}
        </div>
      )}
    </div>
  );
};
