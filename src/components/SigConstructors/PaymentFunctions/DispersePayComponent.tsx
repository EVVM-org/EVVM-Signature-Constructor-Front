"use client";
import React from "react";
import { Core, type IDispersePayData, type ISerializableSignedAction } from "@evvm/evvm-js";
import { execute } from "@evvm/evvm-js";
import { getEvvmSigner, getCurrentChainId } from "@/utils/evvm-signer";
import {
  TitleAndLink,
  NumberInputWithGenerator,
  AddressInputField,
  PrioritySelector,
  ExecutorSelector,
  DataDisplayWithClear,
  HelperInfo,
  NumberInputField,
} from "@/components/SigConstructors/InputsAndModules";
import { Button, Input, Select, Slider } from '@mantine/core';

interface DispersePayComponentProps {
  coreAddress: string;
}

export const DispersePayComponent = ({
  coreAddress,
}: DispersePayComponentProps) => {
  const [isUsingExecutorDisperse, setIsUsingExecutorDisperse] =
    React.useState(false);
  const [priorityDisperse, setPriorityDisperse] = React.useState<"low" | "high">("low");
  const [isUsingUsernameOnDisperse, setIsUsingUsernameOnDisperse] =
    React.useState<Array<boolean>>([false, false, false, false, false]);
  const [numberOfUsersToDisperse, setNumberOfUsersToDisperse] =
    React.useState(1);
  const [dataToGet, setDataToGet] = React.useState<ISerializableSignedAction<IDispersePayData> | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement)?.value;

    if (!coreAddress) {
      console.error("EVVM address is required");
      return;
    }

    const tokenAddress = getValue("tokenAddressDispersePay");
    const amount = getValue("amountTokenInputSplit");
    const priorityFee = getValue("priorityFeeInputSplit");
    const nonce = getValue("nonceInputDispersePay");
    const senderExecutor = isUsingExecutorDisperse
      ? getValue("senderExecutorInputSplit")
      : "0x0000000000000000000000000000000000000000";

    if (!tokenAddress || !amount || !priorityFee || !nonce) {
      console.error("All fields are required");
      return;
    }

    type ToDataItem = { amount: bigint; toAddress: `0x${string}`; toIdentity: undefined } | { amount: bigint; toAddress: undefined; toIdentity: string };
    const toData: ToDataItem[] = [];
    for (let i = 0; i < numberOfUsersToDisperse; i++) {
      const isUsingUsername = isUsingUsernameOnDisperse[i];
      const toInputId = isUsingUsername
        ? `toUsernameSplitUserNumber${i}`
        : `toAddressSplitUserNumber${i}`;
      const to = getValue(toInputId);
      const amountForUser = getValue(`amountTokenToGiveUser${i}`);

      if (!to || !amountForUser) {
        console.error(`Missing data for user ${i + 1}`);
        return;
      }

      if (isUsingUsername) {
        toData.push({
          amount: BigInt(amountForUser),
          toAddress: undefined,
          toIdentity: to,
        });
      } else {
        toData.push({
          amount: BigInt(amountForUser),
          toAddress: to as `0x${string}`,
          toIdentity: undefined,
        });
      }
    }

    setLoading(true);
    try {
      const signer = await getEvvmSigner();
      const evvm = new Core({
        signer,
        address: coreAddress as `0x${string}`,
        chainId: getCurrentChainId(),
      });

      const signedAction = await evvm.dispersePay({
        toData,
        tokenAddress: tokenAddress as `0x${string}`,
        amount: BigInt(amount),
        priorityFee: BigInt(priorityFee),
        nonce: BigInt(nonce),
        isAsyncExec: priorityDisperse === "high",
        senderExecutor: senderExecutor as `0x${string}`,
      });

      setDataToGet(signedAction.toJSON());
    } catch (error) {
      console.error("Error creating signature:", error);
    } finally {
      setLoading(false);
    }
  };

  const executeDispersePayment = async () => {
    if (!dataToGet || !coreAddress) {
      console.error("Missing data or address");
      return;
    }

    try {
      const signer = await getEvvmSigner();
      await execute(signer, dataToGet);
      console.log("Disperse payment executed successfully");
      setDataToGet(null);
    } catch (error) {
      console.error("Error executing disperse payment:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Disperse payment"
        link="https://www.evvm.info/docs/SignatureStructures/EVVM/DispersePaymentSignatureStructure"
      />
      <br />

      <AddressInputField
        label="Token address"
        inputId="tokenAddressDispersePay"
        placeholder="Enter token address"
      />

      <NumberInputField
        label="Total Amount (sum of all payments)"
        inputId="amountTokenInputSplit"
        placeholder="Enter amount"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInputSplit"
        placeholder="Enter priority fee"
      />

      <ExecutorSelector
        inputId="senderExecutorInputSplit"
        placeholder="Enter senderExecutor"
        onExecutorToggle={setIsUsingExecutorDisperse}
        isUsingExecutor={isUsingExecutorDisperse}
      />

      <div style={{ marginBottom: "1rem", width: "20rem" }}>
        <p>Number of accounts to split the payment</p>
        <Slider
          min={1}
          max={5}
          step={1}
          value={numberOfUsersToDisperse}
          onChange={setNumberOfUsersToDisperse}
          marks={[
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
            { value: 4, label: '4' },
            { value: 5, label: '5' },
          ]}
          showLabelOnHover={false}
          
          label={value => `${value}`}
        />
      </div>

      {Array.from({ length: numberOfUsersToDisperse }).map((_, index) => (
        <div key={index}>
          <h4 style={{ color: "black", marginTop: "1rem" }}>{`Payment ${
            index + 1
          }`}</h4>
          <p>To:</p>
          <Select
            style={{
              color: "black",
              backgroundColor: "white",
              width: "8rem",
            }}
            value={isUsingUsernameOnDisperse[index] ? "true" : "false"}
            onChange={(value) => {
              setIsUsingUsernameOnDisperse((prev) => {
                const newPrev = [...prev];
                newPrev[index] = value === "true";
                return newPrev;
              });
            }}
            data={[
              { value: "false", label: "Address" },
              { value: "true", label: "Username" },
            ]}
          />
          <Input
            type="text"
            size="compact-md"
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
              width: "25rem",
            }}
          />
          <p>Amount</p>
          <Input
            type="number"
            size="compact-md"
            placeholder="Enter amount"
            id={`amountTokenToGiveUser${index}`}
            style={{
              width: "25rem",
            }}
          />
        </div>
      ))}

      <PrioritySelector onPriorityChange={setPriorityDisperse} />

      <NumberInputWithGenerator
        label="Nonce"
        inputId="nonceInputDispersePay"
        placeholder="Enter nonce"
        showRandomBtn={priorityDisperse !== "low"}
      />

      <div>
        {priorityDisperse === "low" && (
          <HelperInfo label="How to find my sync nonce?">
            <div>
              You can retrieve your next sync nonce from the Core contract using
              the <code>getNextCurrentSyncNonce</code> function.
            </div>
          </HelperInfo>
        )}
      </div>

      <Button
        onClick={makeSig}
        disabled={loading}
        loading={loading}
        style={{
          padding: "0.5rem",
          marginTop: "1rem",
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "Creating..." : "Create signature"}
      </Button>

      <DataDisplayWithClear
        dataToGet={dataToGet}
        onClear={() => setDataToGet(null)}
        onExecute={executeDispersePayment}
      />
    </div>
  );
};
