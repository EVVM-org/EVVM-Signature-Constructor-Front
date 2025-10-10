"use client";
import { useState } from "react";
import { readContracts } from "@wagmi/core";
import { config } from "@/config/index";
import Evvm from "@/constants/abi/Evvm.json";
import { FaucetFunctionsComponent } from "./FaucetFunctions/FaucetFunctionsComponent";
import { PaySignaturesComponent } from "./PaymentFunctions/PaySignaturesComponent";
import { DispersePayComponent } from "./PaymentFunctions/DispersePayComponent";
import { GoldenStakingComponent } from "./StakingFunctions/GoldenStakingComponent";
import { PresaleStakingComponent } from "./StakingFunctions/PresaleStakingComponent";
import { PublicStakingComponent } from "./StakingFunctions/PublicStakingComponent";
import { PublicServiceStakingComponent } from "./StakingFunctions/PublicServiceStakingComponent";
import { PreRegistrationUsernameComponent } from "./NameServiceFunctions/PreRegistrationUsernameComponent";
import { RegistrationUsernameComponent } from "./NameServiceFunctions/RegistrationUsernameComponent";
import { MakeOfferComponent } from "./NameServiceFunctions/MakeOfferComponent";
import { WithdrawOfferComponent } from "./NameServiceFunctions/WithdrawOfferComponent";
import { AcceptOfferComponent } from "./NameServiceFunctions/AcceptOfferComponent";
import { RenewUsernameComponent } from "./NameServiceFunctions/RenewUsernameComponent";
import { AddCustomMetadataComponent } from "./NameServiceFunctions/AddCustomMetadataComponent";
import { RemoveCustomMetadataComponent } from "./NameServiceFunctions/RemoveCustomMetadataComponent";
import { FlushCustomMetadataComponent } from "./NameServiceFunctions/FlushCustomMetadataComponent";
import { FlushUsernameComponent } from "./NameServiceFunctions/FlushUsernameComponent";
import { FaucetBalanceChecker } from "./FaucetFunctions/FaucetBalanceChecker";

const boxStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "1rem",
  padding: "1rem",
  border: "1px solid #ccc",
  borderRadius: "8px",
  width: "100%",
  marginBottom: "1rem",
} as const;

const selectStyle = {
  padding: "1rem",
  border: "1px solid #ccc",
  borderRadius: "8px",
  width: "100%",
  backgroundColor: "#f9f9f9",
  color: "#333",
  marginBottom: "1rem",
} as const;

export const SigMenu = () => {
  const [menu, setMenu] = useState("faucet");
  const [evvmID, setEvvmID] = useState("");
  const [evvmAddress, setEvvmAddress] = useState("");
  const [nameserviceAddress, setNameserviceAddress] = useState("");
  const [stakingAddress, setStakingAddress] = useState("");
  const [loadingIDs, setLoadingIDs] = useState(false);

  // Fetch summary info for EVVM contract: evvmID, stakingAddress, and NameService address
  const fetchEvvmSummary = async () => {
    if (!evvmAddress) {
      alert("Por favor ingresa una dirección EVVM válida");
      return;
    }
    setLoadingIDs(true);
    try {
      const contracts = [
        {
          abi: Evvm.abi as any,
          address: evvmAddress as `0x${string}`,
          functionName: "getEvvmID",
          args: [],
        },
        {
          abi: Evvm.abi as any,
          address: evvmAddress as `0x${string}`,
          functionName: "getStakingContractAddress",
          args: [],
        },
        {
          abi: Evvm.abi as any,
          address: evvmAddress as `0x${string}`,
          functionName: "getNameServiceAddress",
          args: [],
        },
      ];
      const results = await readContracts(config, { contracts });
      const [evvmIDResult, stakingAddrResult, nsAddrResult] = results;
      setEvvmID(
        evvmIDResult?.result !== undefined && evvmIDResult?.result !== null
          ? String(evvmIDResult.result)
          : ""
      );
      setStakingAddress(
        typeof stakingAddrResult?.result === "string"
          ? stakingAddrResult.result
          : ""
      );
      setNameserviceAddress(
        typeof nsAddrResult?.result === "string" ? nsAddrResult.result : ""
      );
    } catch (err) {
      setEvvmID("");
      setStakingAddress("");
      setNameserviceAddress("");
      alert(
        "No se pudo obtener los datos (evvmID, stakingAddress, NameService address)"
      );
    } finally {
      setLoadingIDs(false);
    }
  };

  // Pass evvmID, evvmAddress, and stakingAddress as props to all components
  const FaucetFunctions = [
    <FaucetBalanceChecker key="faucetBalance" evvmAddress={evvmAddress} />,
    <FaucetFunctionsComponent key="faucet" evvmAddress={evvmAddress} />,
  ];

  const payComponents = [
    <PaySignaturesComponent
      key="pay"
      evvmID={evvmID}
      evvmAddress={evvmAddress}
    />,
    <DispersePayComponent
      key="disperse"
      evvmID={evvmID}
      evvmAddress={evvmAddress}
    />,
  ];

  const stakingComponents = [
    <GoldenStakingComponent
      key="golden"
      evvmID={evvmID}
      stakingAddress={stakingAddress}
    />,
    <PresaleStakingComponent
      key="presale"
      evvmID={evvmID}
      stakingAddress={stakingAddress}
    />,
    <PublicStakingComponent
      key="public"
      evvmID={evvmID}
      stakingAddress={stakingAddress}
    />,
    <PublicServiceStakingComponent
      key="publicService"
      evvmID={evvmID}
      stakingAddress={stakingAddress}
    />,
  ];

  const mnsComponents = [
    <PreRegistrationUsernameComponent
      key="preReg"
      evvmID={evvmID}
      nameServiceAddress={nameserviceAddress}
    />,
    <RegistrationUsernameComponent
      key="reg"
      evvmID={evvmID}
      nameServiceAddress={nameserviceAddress}
    />,
    <MakeOfferComponent
      key="makeOffer"
      evvmID={evvmID}
      nameServiceAddress={nameserviceAddress}
    />,
    <WithdrawOfferComponent
      key="withdrawOffer"
      evvmID={evvmID}
      nameServiceAddress={nameserviceAddress}
    />,
    <AcceptOfferComponent
      key="acceptOffer"
      evvmID={evvmID}
      nameServiceAddress={nameserviceAddress}
    />,
    <RenewUsernameComponent
      key="renewUsername"
      evvmID={evvmID}
      nameServiceAddress={nameserviceAddress}
    />,
    <AddCustomMetadataComponent
      key="addCustomMetadata"
      evvmID={evvmID}
      nameServiceAddress={nameserviceAddress}
    />,
    <RemoveCustomMetadataComponent
      key="removeCustomMetadata"
      evvmID={evvmID}
      nameServiceAddress={nameserviceAddress}
    />,
    <FlushCustomMetadataComponent
      key="flushCustomMetadata"
      evvmID={evvmID}
      nameServiceAddress={nameserviceAddress}
    />,
    <FlushUsernameComponent
      key="flushUsername"
      evvmID={evvmID}
      nameServiceAddress={nameserviceAddress}
    />,
  ];

  const components =
    menu === "faucet"
      ? FaucetFunctions
      : menu === "pay"
      ? payComponents
      : menu === "staking"
      ? stakingComponents
      : menu === "mns"
      ? mnsComponents
      : [];

  return (
    <>
      <div
        style={{
          display: "flex",
          //hazlo column
          flexDirection: "column",
        }}
      >
        {evvmID && stakingAddress && nameserviceAddress ? (
          <div
            style={{
              flex: 3,
              display: "flex",
              flexDirection: "column",
              gap: "0.25rem",
              background: "#f5f5f5",
              border: "1px solid #ccc",
              borderRadius: 6,
              padding: "0.5rem 1rem",
              minWidth: 0,
            }}
          >
            <div style={{ fontSize: 14, color: "#555" }}>
              <strong>evvmID:</strong> {String(evvmID)}
            </div>
            <div style={{ fontSize: 14, color: "#555" }}>
              <strong>evvm:</strong> {evvmAddress}
            </div>
            <div style={{ fontSize: 14, color: "#555" }}>
              <strong>staking:</strong> {stakingAddress}
            </div>
            <div style={{ fontSize: 14, color: "#555" }}>
              <strong>nameService:</strong> {nameserviceAddress}
            </div>
          </div>
        ) : (
          <>
            <input
              type="text"
              placeholder="EVVM Address"
              value={evvmAddress}
              onChange={(e) => setEvvmAddress(e.target.value)}
              style={{
                padding: "0.75rem",
                borderRadius: 6,
                background: "white",
                color: "black",
                border: "1px solid #ccc",
                width: "100%",
                minWidth: 390,
                maxWidth: 800,
                fontFamily: "monospace",
                boxSizing: "border-box",
              }}
            />
            <button
              onClick={fetchEvvmSummary}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 6,
                border: "1px solid #ccc",
                background: loadingIDs ? "#eee" : "#fff",
              }}
            >
              Obtener datos
            </button>
          </>
        )}
      </div>
      <select onChange={(e) => setMenu(e.target.value)} style={selectStyle}>
        <option value="faucet">Faucet functions</option>
        <option value="pay">Payment signatures</option>
        <option value="staking">Staking signatures</option>
        <option value="mns">MNS signatures</option>
      </select>

      <div>
        {components.map((Component, index) => (
          <div key={index} style={boxStyle}>
            {Component}
          </div>
        ))}
      </div>
    </>
  );
};
