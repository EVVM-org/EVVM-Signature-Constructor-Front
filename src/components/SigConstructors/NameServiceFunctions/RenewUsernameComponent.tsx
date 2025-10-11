"use client";
import React from "react";
import { getAccount, readContract } from "@wagmi/core";
import { config } from "@/config/index";
import { useNameServiceSignatureBuilder } from "@/utils/SignatureBuilder/useNameServiceSignatureBuilder";
import { TitleAndLink } from "@/components/SigConstructors/InputsAndModules/TitleAndLink";
import { NumberInputWithGenerator } from "@/components/SigConstructors/InputsAndModules/NumberInputWithGenerator";
import { AddressInputField } from "../InputsAndModules/AddressInputField";
import { PrioritySelector } from "../InputsAndModules/PrioritySelector";
import { NumberInputField } from "../InputsAndModules/NumberInputField";
import { TextInputField } from "../InputsAndModules/TextInputField";
import { DataDisplayWithClear } from "@/components/SigConstructors/InputsAndModules/DataDisplayWithClear";
import NameService from "@/constants/abi/NameService.json";
import {
  PayInputData,
  RenewUsernameInputData,
} from "@/utils/TypeInputStructures";
import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import { tokenAddress } from "@/constants/address";
import { executeRenewUsername } from "@/utils/TransactionExecuter";

type InfoData = {
  PayInputData: PayInputData;
  RenewUsernameInputData: RenewUsernameInputData;
};


interface RenewUsernameComponentProps {
  evvmID: string;
  nameServiceAddress: string;
}

export const RenewUsernameComponent = ({ evvmID, nameServiceAddress }: RenewUsernameComponentProps) => {
  const { signRenewUsername } = useNameServiceSignatureBuilder();
  const account = getAccount(config);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);
  const [amountToRenew, setAmountToRenew] = React.useState<bigint | null>(null);



  const makeSig = async () => {
    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    // Get values from input fields except evvmID and evvmAddress, which come from props
    const getValue = (id: string) => {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (!el) {
        throw new Error(`Input element with id '${id}' not found. Ensure the input is rendered and the id is correct.`);
      }
      return el.value;
    };
    const formData = {
      evvmId: BigInt(evvmID),
      addressNameService: nameServiceAddress,
      username: getValue("usernameInput_renewUsername"),
      nonceNameService: BigInt(getValue("nonceNameServiceInput_renewUsername")),
      amountToRenew: BigInt(getValue("amountToRenew_renewUsername")),
      priorityFee_EVVM: BigInt(getValue("priorityFeeInput_renewUsername")),
      nonceEVVM: BigInt(getValue("nonceEVVMInput_renewUsername")),
      priorityFlag: priority === "high",
    };

    signRenewUsername(
      formData.evvmId,
      formData.addressNameService as `0x${string}`,
      formData.username,
      formData.nonceNameService,
      formData.amountToRenew,
      formData.priorityFee_EVVM,
      formData.nonceEVVM,
      formData.priorityFlag,
      (paySignature: string, renewUsernameSignature: string) => {
        setDataToGet({
          PayInputData: {
            from: walletData.address as `0x${string}`,
            to_address: formData.addressNameService as `0x${string}`,
            to_identity: "",
            token: tokenAddress.mate as `0x${string}`,
            amount: formData.priorityFee_EVVM,
            priorityFee: BigInt(0),
            nonce: formData.nonceEVVM,
            priority: priority === "high",
            executor: formData.addressNameService as `0x${string}`,
            signature: paySignature,
          },
          RenewUsernameInputData: {
            user: walletData.address as `0x${string}`,
            nonce: formData.nonceNameService,
            username: formData.username,
            priorityFee_EVVM: formData.priorityFee_EVVM,
            signature: renewUsernameSignature,
            nonce_EVVM: formData.nonceEVVM,
            priorityFlag_EVVM: formData.priorityFlag,
            signature_EVVM: paySignature,
          },
        });
      },
      (error: Error) => console.error("Error signing payment:", error)
    );
  };

  const readAmountToRenew = async () => {

    const getValue = (id: string) => (document.getElementById(id) as HTMLInputElement).value;

    if (!nameServiceAddress) {
      setAmountToRenew(null);
    } else {
      const username = getValue("usernameInput_renewUsername");
      try {
        const result = await readContract(config, {
          abi: NameService.abi,
          address: nameServiceAddress as `0x${string}`,
          functionName: "seePriceToRenew",
          args: [username],
        });
        console.log("Amount to renew:", result);
        setAmountToRenew(result ? BigInt(result.toString()) : null);
      } catch (error) {
        console.error("Error reading amount to renew:", error);
        setAmountToRenew(null);
      }
    }
  };

  // Handler for username change
  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    readAmountToRenew();
  };

  // Handler for executing the transaction
  const execute = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }
    const nameServiceAddress = dataToGet.PayInputData.to_address;
    executeRenewUsername(dataToGet.RenewUsernameInputData, nameServiceAddress)
      .then(() => {
        console.log("Renew username executed successfully");
      })
      .catch((error) => {
        console.error("Error executing renew username:", error);
      });
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Renewal of username"
        link="https://www.evvm.info/docs/SignatureStructures/MNS/renewUsernameStructure"
      />
      <br />
      
      <NumberInputWithGenerator
        label="NameService Nonce"
        inputId="nonceNameServiceInput_renewUsername"
        placeholder="Enter nonce"
      />
      <TextInputField
        label="Username"
        inputId="usernameInput_renewUsername"
        placeholder="Enter username"
        onChange={handleUsernameChange}
      />
      <NumberInputField
        label="Amount to Renew"
        inputId="amountToRenew_renewUsername"
        placeholder="Enter amount to renew"
        defaultValue={amountToRenew !== null ? amountToRenew.toString() : ""}
      />
      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_renewUsername"
        placeholder="Enter priority fee"
      />
      
      <PrioritySelector onPriorityChange={setPriority} />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_renewUsername"
        placeholder="Enter nonce"
        showRandomBtn={priority !== "low"}
      />

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
        onExecute={execute}
      />
    </div>
  );

}
