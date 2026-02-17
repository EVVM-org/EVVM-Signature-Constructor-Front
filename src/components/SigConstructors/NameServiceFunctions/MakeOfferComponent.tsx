"use client";
import React from "react";
import { config } from "@/config/index";
import {
  TitleAndLink,
  NumberInputWithGenerator,
  PrioritySelector,
  DataDisplayWithClear,
  HelperInfo,
  NumberInputField,
  TextInputField,
  DateInputField,
} from "@/components/SigConstructors/InputsAndModules";
import { execute } from "@evvm/evvm-js";
import { getEvvmSigner, getCurrentChainId } from "@/utils/evvm-signer";
import { dateToUnixTimestamp } from "@/utils/dateToUnixTimestamp";
import {
  IPayData,
  IMakeOfferData,
  NameService,
  Core,
  type ISerializableSignedAction,
} from "@evvm/evvm-js";
import { NameServiceComponentProps } from "@/types";
import { Button } from "@mantine/core";

type InfoData = {
  IPayData: ISerializableSignedAction<IPayData>;
  IMakeOfferData: ISerializableSignedAction<IMakeOfferData>;
};

export const MakeOfferComponent = ({
  nameServiceAddress,
  coreAddress,
}: NameServiceComponentProps) => {
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const formData = {
      addressNameService: nameServiceAddress,
      nonceNameService: getValue("nonceNameServiceInput_makeOffer"),
      username: getValue("usernameInput_makeOffer"),
      amount: getValue("amountInput_makeOffer"),
      expirationDate: dateToUnixTimestamp(getValue("expirationDateInput_makeOffer")),
      priorityFeePay: getValue("priorityFeeInput_makeOffer"),
      nonceEVVM: getValue("nonceEVVMInput_makeOffer"),
      isAsyncExec: priority === "high",
    };

    try {
      const signer = await getEvvmSigner();
      
      // Create EVVM service for payment
      const coreService = new Core({
        signer,
        address: coreAddress as `0x${string}`,
        chainId: getCurrentChainId(),
      });
      
      // Create NameService service
      const nameServiceService = new NameService({
        signer,
        address: formData.addressNameService as `0x${string}`,
        chainId: getCurrentChainId(),
      });

      // Sign EVVM payment first
      const payAction = await coreService.pay({
        toAddress: formData.addressNameService as `0x${string}`,
        tokenAddress: "0x0000000000000000000000000000000000000001" as `0x${string}`,
        amount: BigInt(formData.amount),
        priorityFee: BigInt(formData.priorityFeePay),
        nonce: BigInt(formData.nonceEVVM),
        isAsyncExec: formData.isAsyncExec,
        senderExecutor: formData.addressNameService as `0x${string}`,
      });

      // Sign make offer action
      const makeOfferAction = await nameServiceService.makeOffer({
        username: formData.username,
        expirationDate: BigInt(formData.expirationDate),
        amount: BigInt(formData.amount),
        nonce: BigInt(formData.nonceNameService),
        evvmSignedAction: payAction,
      });

      setDataToGet({
        IPayData: payAction.toJSON(),
        IMakeOfferData: makeOfferAction.toJSON(),
      });
    } catch (error) {
      console.error("Error creating signature:", error);
    }
  };

  const executeAction = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }

    try {
      const signer = await getEvvmSigner();
      await execute(signer, dataToGet.IMakeOfferData);
      console.log("Make offer executed successfully");
      setDataToGet(null);
    } catch (error) {
      console.error("Error executing make offer:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Make offer of username"
        link="https://www.evvm.info/docs/SignatureStructures/NameService/makeOfferStructure"
      />

      <br />

      <NumberInputWithGenerator
        label="NameService Nonce"
        inputId="nonceNameServiceInput_makeOffer"
        placeholder="Enter nonce"
      />

      <TextInputField
        label="Username"
        inputId="usernameInput_makeOffer"
        placeholder="Enter username"
      />

      <NumberInputField
        label="Amount to offer (in MATE)"
        inputId="amountInput_makeOffer"
        placeholder="Enter amount to offer"
      />

      <DateInputField
        label="Expiration Date"
        inputId="expirationDateInput_makeOffer"
        defaultValue="2025-12-31"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_makeOffer"
        placeholder="Enter priority fee"
      />

      {/* Priority configuration */}
      <PrioritySelector onPriorityChange={setPriority} />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_makeOffer"
        placeholder="Enter nonce"
        showRandomBtn={priority !== "low"}
      />

      <div>
        {priority === "low" && (
          <HelperInfo label="How to find my sync nonce?">
            <div>
              You can retrieve your next sync nonce from the EVVM contract using
              the <code>getNextCurrentSyncNonce</code> function.
            </div>
          </HelperInfo>
        )}
      </div>

      {/* Create signature button */}
      <Button
        onClick={makeSig}
        style={{
          padding: "0.5rem",
          marginTop: "1rem",
        }}
      >
        Create signature
      </Button>

      <DataDisplayWithClear
        dataToGet={dataToGet}
        onClear={() => setDataToGet(null)}
        onExecute={executeAction}
      />
    </div>
  );
};
