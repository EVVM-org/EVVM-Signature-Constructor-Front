"use client";
import React from "react";
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
  IWithdrawOfferData,
  NameService,
  Core,
  type ISerializableSignedAction,
} from "@evvm/evvm-js";

type InfoData = {
  IPayData: ISerializableSignedAction<IPayData>;
  IWithdrawOfferData: ISerializableSignedAction<IWithdrawOfferData>;
};

interface WithdrawOfferComponentProps {
  nameServiceAddress: string;
}

export const WithdrawOfferComponent = ({
  nameServiceAddress,
}: WithdrawOfferComponentProps) => {
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value;

    const formData = {
      addressNameService: nameServiceAddress,
      nonceNameService: getValue("nonceNameServiceInput_withdrawOffer"),
      username: getValue("usernameInput_withdrawOffer"),
      offerId: getValue("offerIdInput_withdrawOffer"),
      priorityFeePay: getValue("priorityFeeInput_withdrawOffer"),
      noncePay: getValue("nonceEVVMInput_withdrawOffer"),
      isAsyncExecPay: priority === "high",
    };

    try {
      const signer = await getEvvmSigner();
      
      // Create EVVM service for payment
      const coreService = new Core({
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
      const payAction = await coreService.pay({
        toAddress: formData.addressNameService as `0x${string}`,
        tokenAddress: "0x0000000000000000000000000000000000000001" as `0x${string}`,
        amount: BigInt(0),
        priorityFee: BigInt(formData.priorityFeePay),
        nonce: BigInt(formData.noncePay),
        isAsyncExec: formData.isAsyncExecPay,
        senderExecutor: formData.addressNameService as `0x${string}`,
      });

      // Sign withdraw offer action
      const withdrawOfferAction = await nameServiceService.withdrawOffer({
        username: formData.username,
        offerID: BigInt(formData.offerId),
        nonce: BigInt(formData.nonceNameService),
        evvmSignedAction: payAction,
      });

      setDataToGet({
        IPayData: payAction.toJSON(),
        IWithdrawOfferData: withdrawOfferAction.toJSON(),
      });
    } catch (error) {
      console.error("Error signing withdraw offer:", error);
    }
  };

  const executeAction = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }

    try {
      const signer = await getEvvmSigner();
      await execute(signer, dataToGet.IWithdrawOfferData);
      console.log("Withdraw offer executed successfully");
      setDataToGet(null);
    } catch (error) {
      console.error("Error executing withdraw offer:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Withdraw offer of username"
        link="https://www.evvm.info/docs/SignatureStructures/NameService/withdrawOfferStructure"
      />

      <br />

      <NumberInputWithGenerator
        label="NameService Nonce"
        inputId="nonceNameServiceInput_withdrawOffer"
        placeholder="Enter nonce"
      />

      <TextInputField
        label="Username"
        inputId="usernameInput_withdrawOffer"
        placeholder="Enter username"
      />

      <NumberInputField
        label="Offer ID"
        inputId="offerIdInput_withdrawOffer"
        placeholder="Enter offer ID"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_withdrawOffer"
        placeholder="Enter priority fee"
      />

      {/* Priority configuration */}
      <PrioritySelector onPriorityChange={setPriority} />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_withdrawOffer"
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
