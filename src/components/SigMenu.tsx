"use client";
import { useState } from "react";
import { PaySignaturesConstructorComponent } from "@/components/PaymentFunctions/PaySignaturesConstructor";
import { DispersePaySignatureConstructor } from "@/components/PaymentFunctions/DispersePaySignatureConstructor";
import { GoldenStakingSignatureConstructor } from "@/components/StakingFunctions/GoldenStakingSignatureConstructor";

const boxSignature = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",

  padding: "1rem",
  border: "1px solid #ccc",
  borderRadius: "8px",
  width: "100%",
} as const;

const menuStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  padding: "1rem",
  border: "1px solid #ccc",
  borderRadius: "8px",
  width: "100%",
  backgroundColor: "#f9f9f9",
  color: "#333",
  margin: "1rem 0",
} as const;

export const SigMenu = () => {
  const [menu, setMenu] = useState("pay");
  return (
    <div>
      <select
        onChange={(e) => setMenu(e.target.value)}
        style={{
          ...menuStyle,
        }}
      >
        <option value="pay">Payment signatures</option>
        <option value="staking">Staking signatures</option>
      </select>

      {menu === "pay" ? (
        <>
          <div
            style={{
              ...boxSignature,
            }}
          >
            <PaySignaturesConstructorComponent />
          </div>
          <br />
          <div
            style={{
              ...boxSignature,
            }}
          >
            <DispersePaySignatureConstructor />
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              ...boxSignature,
            }}
          >
            <GoldenStakingSignatureConstructor />
          </div>
        </>
      )}
    </div>
  );
};
