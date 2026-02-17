"use client";
import React, { useState } from "react";
import { readContract } from "@wagmi/core";
import { config } from "@/config/index";
import { CoreABI } from "@evvm/evvm-js";

import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { HelperInfo } from "../InputsAndModules/HelperInfo";
import { Button } from '@mantine/core';

interface FaucetBalanceCheckerProps {
  coreAddress: string;
}

export const FaucetBalanceChecker: React.FC<FaucetBalanceCheckerProps> = ({
  coreAddress,
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
        abi: CoreABI,
        address: coreAddress as `0x${string}`,
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

      <div>
        <HelperInfo label="Most common token addresses">
          <div style={{ marginTop: 8 }}>
            <strong>MATE</strong> address:
            <br />
            0x0000000000000000000000000000000000000001
          </div>
          <div>
            <strong>ETH</strong> address:
            <br />
            0x0000000000000000000000000000000000000000
          </div>
        </HelperInfo>
      </div>

      <Button onClick={checkBalance} disabled={loading} loading={loading}>
        {loading ? "Checking..." : "Check Balance"}
      </Button>

      {balance !== null && (
        <div style={{ marginTop: "0.5rem" }}>
          <strong>Balance:</strong> {balance}
        </div>
      )}
    </div>
  );
};
