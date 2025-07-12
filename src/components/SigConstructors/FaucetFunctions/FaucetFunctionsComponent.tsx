"use client";
import React from "react";
import { getAccount, writeContract } from "@wagmi/core";
import { config } from "@/config/index";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { address } from "@/constants/address";
import Evvm from "@/constants/abi/Evvm.json";

export const FaucetFunctionsComponent = () => {
  const executeFaucet = async () => {
    const account = getAccount(config);
    const user = (
      document.getElementById("addressGive_faucet") as HTMLInputElement
    ).value;
    const token = (
      document.getElementById("tokenAddress_faucet") as HTMLInputElement
    ).value;
    const quantity = (
      document.getElementById("amountTokenInput_faucet") as HTMLInputElement
    ).value;
    const chainId = account.chain?.id;
    if (!chainId) {
      console.error("No chain ID available");
      return;
    }
    writeContract(config, {
      abi: Evvm.abi,
      address: address[chainId.toString() as keyof typeof address]
        .evvm as `0x${string}`,
      functionName: "addBalance",
      args: [user, token, quantity],
    })
      .then(() => {
        console.log("Tokens successfully sent to", user);
      })
      .catch((error) => {
        console.error("Error sending tokens:", error);
      });
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <h1>Faucet</h1>
      <br />

      <AddressInputField
        label="Address to give tokens to"
        inputId="addressGive_faucet"
        placeholder="Enter token address"
      />

      <AddressInputField
        label="Token address to receive"
        inputId="tokenAddress_faucet"
        placeholder="Enter token address"
        defaultValue="0x0000000000000000000000000000000000000000"
      />

      <NumberInputField
        label="Amount"
        inputId="amountTokenInput_faucet"
        placeholder="Enter amount"
      />

      <button
        onClick={executeFaucet}
        style={{
          padding: "0.5rem",
          marginTop: "1rem",
        }}
      >
        Give Tokens
      </button>
    </div>
  );
};
