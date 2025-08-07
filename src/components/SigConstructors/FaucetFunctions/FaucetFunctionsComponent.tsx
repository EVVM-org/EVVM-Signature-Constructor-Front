"use client";
import React from "react";
import { getAccount, writeContract } from "@wagmi/core";
import { config } from "@/config/index";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import Evvm from "@/constants/abi/Evvm.json";
import { contractAddress } from "@/constants/address";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";

export const FaucetFunctionsComponent = () => {
  const account = getAccount(config);

  const executeFaucet = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const formData = {
      evvmAddress: getValue("evvmAddressInput_faucet"),
      user: getValue("addressGive_faucet"),
      token: getValue("tokenAddress_faucet"),
      quantity: getValue("amountTokenInput_faucet"),
    };

    writeContract(config, {
      abi: Evvm.abi,
      address: formData.evvmAddress as `0x${string}`,
      functionName: "_addBalance",
      args: [formData.user, formData.token, formData.quantity],
    })
      .then(() => {
        console.log("Tokens successfully sent to", formData.user);
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
        label="EVVM Address"
        inputId="evvmAddressInput_faucet"
        placeholder="Enter EVVM address"
        defaultValue={
          contractAddress[account.chain?.id as keyof typeof contractAddress]
            ?.evvm || ""
        }
      />

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
