"use client";
import React from "react";
import { config } from "@/config/index";
import { getAccount, writeContract, simulateContract, switchChain } from "@wagmi/core";
import { sepolia } from "@wagmi/core/chains";
import {
  TitleAndLink,
  AddressInputField,
  NumberInputField,
} from "@/components/SigConstructors/InputsAndModules";

import RegistryCoreABI from "@/abi/RegistryEvvm.json";
import { Button } from "@mantine/core";

const REGISTRY_ADDRESS = "0x389dC8fb09211bbDA841D59f4a51160dA2377832" as const;

export const RegisterEvvmComponent = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [resultEvvmId, setResultEvvmId] = React.useState<string | null>(null);
  const [txHash, setTxHash] = React.useState<string | null>(null);

  const makeRegister = async () => {
    const chainIdInput = document.getElementById(
      "chainIdInputRegister"
    ) as HTMLInputElement;
    const coreAddressInput = document.getElementById(
      "coreAddressInputRegister"
    ) as HTMLInputElement;

    console.log('Chain ID Input:', chainIdInput);
    console.log('Chain ID Value:', chainIdInput?.value);
    console.log('EVVM Address Input:', coreAddressInput);
    console.log('EVVM Address Value:', coreAddressInput?.value);

    if (!chainIdInput?.value || !coreAddressInput?.value) {
      alert("Please fill in all required fields");
      return;
    }

    const chainId = BigInt(chainIdInput.value);
    const coreAddress = coreAddressInput.value as `0x${string}`;

    setIsLoading(true);
    setResultEvvmId(null);
    setTxHash(null);

    try {
      // Switch to Sepolia first
      try {
        await switchChain(config, { chainId: sepolia.id });
      } catch (switchError) {
        console.error("Failed to switch chain:", switchError);
        alert("Please switch to Sepolia network in your wallet");
        setIsLoading(false);
        return;
      }

      // First, simulate the contract call to get the evvmID that would be returned
      const { result } = await simulateContract(config, {
        address: REGISTRY_ADDRESS,
        abi: RegistryCoreABI.abi,
        functionName: "registerEvvm",
        args: [chainId, coreAddress],
        chainId: sepolia.id,
      });

      const evvmId = result as bigint;
      
      // Display the evvmID that will be assigned
      setResultEvvmId(evvmId.toString());
      
      // Now execute the actual transaction
      const hash = await writeContract(config, {
        address: REGISTRY_ADDRESS,
        abi: RegistryCoreABI.abi,
        functionName: "registerEvvm",
        args: [chainId, coreAddress],
        chainId: sepolia.id,
      });

      setTxHash(hash);
      alert(`Transaction submitted! EVVM ID: ${evvmId.toString()}\nHash: ${hash}`);
    } catch (error: any) {
      console.error("Error registering EVVM:", error);
      alert(`Error: ${error.message || "Failed to register EVVM"}`);
      setResultEvvmId(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <h1>Register EVVM</h1>
      <br />

      {/* Chain ID */}
      <NumberInputField
        label="Chain ID"
        inputId="chainIdInputRegister"
        placeholder="Enter chain ID (e.g., 11155111 for Sepolia)"
      />

      {/* EVVM Address */}
      <AddressInputField
        label="EVVM Contract Address"
        inputId="coreAddressInputRegister"
        placeholder="Enter EVVM contract address"
      />

      {/* Register button */}
      <Button
        onClick={makeRegister}
        disabled={isLoading}
        loading={isLoading}
        style={{ 
          padding: "0.75rem 1.5rem", 
          marginTop: "1.5rem",
          backgroundColor: isLoading ? "#ccc" : "#000",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: isLoading ? "not-allowed" : "pointer",
          fontWeight: 600,
        }}
      >
        {isLoading ? "Registering..." : "Register EVVM"}
      </Button>

      {/* Display EVVM ID if available */}
      {resultEvvmId && (
        <div style={{ 
          marginTop: "1.5rem", 
          padding: "1rem", 
          backgroundColor: "#f0fdf4",
          borderRadius: "8px",
          width: "100%",
          border: "2px solid #86efac",
        }}>
          <p style={{ color: "#000", marginBottom: "0.5rem", fontSize: "1.1rem" }}>
            <strong>EVVM ID Assigned:</strong>
          </p>
          <p style={{ 
            color: "#15803d", 
            fontFamily: "monospace",
            fontSize: "1.5rem",
            fontWeight: 700,
            margin: 0,
          }}>
            {resultEvvmId}
          </p>
        </div>
      )}
    </div>
  );
};
