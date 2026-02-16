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
} from "@/components/SigConstructors/InputsAndModules";
import { execute } from "@evvm/evvm-js";
import { getEvvmSigner, getCurrentChainId } from "@/utils/evvm-signer";
import {
  IPayData,
  IAcceptOfferData,
  NameService,
  Core,
  type ISerializableSignedAction,
} from "@evvm/evvm-js";

type InfoData = {
  IPayData: ISerializableSignedAction<IPayData>;
  IAcceptOfferData: ISerializableSignedAction<IAcceptOfferData>;
};

interface AcceptOfferComponentProps {
  nameServiceAddress: string;
}

export const AcceptOfferComponent = ({
  nameServiceAddress,
}: AcceptOfferComponentProps) => {
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const formData = {
      addressNameService: nameServiceAddress,
      username: getValue("usernameInput_acceptOffer"),
      offerId: getValue("offerIdInput_acceptOffer"),
      nonce: getValue("nonceInput_acceptOffer"),
      priorityFeePay: getValue("priorityFeeEVVMInput_acceptOffer"),
      isAsyncExecPay: priority === "high",
      noncePay: getValue("nonceEVVMInput_acceptOffer"),
    };

    try {
      const signer = await getEvvmSigner();
      
      // Create EVVM service for payment
      const evvmService = new Core({
        signer,
        address: formData.addressNameService as `0x${string}`,
        chainId: getCurrentChainId(),
      });
      
      // Create NameService service
      const nameServiceService = new NameService({
        signer,
        address: formData.addressNameService as `0x${string}`,
        chainId: getCurrentChainId(),
      });

      // Sign EVVM payment first
      const payAction = await evvmService.pay({
        toAddress: formData.addressNameService as `0x${string}`,
        tokenAddress: "0x0000000000000000000000000000000000000001" as `0x${string}`,
        amount: BigInt(0),
        priorityFee: BigInt(formData.priorityFeePay),
        nonce: BigInt(formData.noncePay),
        isAsyncExec: formData.isAsyncExecPay,
        senderExecutor: formData.addressNameService as `0x${string}`,
      });

      // Sign accept offer action
      const acceptOfferAction = await nameServiceService.acceptOffer({
        username: formData.username,
        offerID: BigInt(formData.offerId),
        nonce: BigInt(formData.nonce),
        evvmSignedAction: payAction,
      });

      setDataToGet({
        IPayData: payAction.toJSON(),
        IAcceptOfferData: acceptOfferAction.toJSON(),
      });
    } catch (error) {
      console.error("Error signing accept offer:", error);
    }
  };

  const executeAction = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }

    try {
      const signer = await getEvvmSigner();
      await execute(signer, dataToGet.IAcceptOfferData);
      console.log("Accept offer executed successfully");
      setDataToGet(null);
    } catch (error) {
      console.error("Error executing accept offer:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Accept offer of username"
        link="https://www.evvm.info/docs/SignatureStructures/NameService/acceptOfferStructure"
      />

      <br />

      <NumberInputWithGenerator
        label="NameService Nonce"
        inputId="nonceInput_acceptOffer"
        placeholder="Enter nonce"
      />

      <TextInputField
        label="Username"
        inputId="usernameInput_acceptOffer"
        placeholder="Enter username"
      />

      <NumberInputField
        label="Offer ID"
        inputId="offerIdInput_acceptOffer"
        placeholder="Enter offer ID"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeEVVMInput_acceptOffer"
        placeholder="Enter priority fee"
      />

      {/* Priority configuration */}
      <PrioritySelector onPriorityChange={setPriority} />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_acceptOffer"
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
      <button
        onClick={makeSig}
        style={{
          padding: "0.5rem",
          marginTop: "1rem",
        }}
      >
        Create signature
      </button>

      <DataDisplayWithClear
        dataToGet={dataToGet}
        onClear={() => setDataToGet(null)}
        onExecute={executeAction}
      />
    </div>
  );
};
