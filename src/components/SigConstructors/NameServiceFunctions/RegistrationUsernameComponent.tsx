"use client";
import React from "react";
import { config } from "@/config/index";
import { readContract } from "@wagmi/core";
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
import { NameServiceABI, CoreABI } from "@evvm/evvm-js";
import {
  IPayData,
  IRegistrationUsernameData,
  NameService,
  Core,
  type ISerializableSignedAction,
} from "@evvm/evvm-js";

type InfoData = {
  IPayData: ISerializableSignedAction<IPayData>;
  IRegistrationUsernameData: ISerializableSignedAction<IRegistrationUsernameData>;
};

interface RegistrationUsernameComponentProps {
  nameServiceAddress: string;
}

export const RegistrationUsernameComponent = ({
  nameServiceAddress,
}: RegistrationUsernameComponentProps) => {
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);
  const [rewardAmount, setRewardAmount] = React.useState<bigint | null>(null);

  const getValue = (id: string) => {
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (!el) {
      throw new Error(
        `Input element with id '${id}' not found. Ensure the input is rendered and the id is correct.`
      );
    }
    return el.value;
  };

  const makeSig = async () => {
    const formData = {
      addressNameService: nameServiceAddress,
      nonceNameService: getValue("nonceNameServiceInput_registrationUsername"),
      username: getValue("usernameInput_registrationUsername"),
      lockNumber: getValue("lockNumberInput_registrationUsername"),
      priorityFeePay: getValue("priorityFeeInput_registrationUsername"),
      nonceEVVM: getValue("nonceEVVMInput_registrationUsername"),
      isAsyncExec: priority === "high",
    };

    // Validate that required fields are not empty
    if (!formData.username) {
      throw new Error("Username is required");
    }
    if (!formData.nonceNameService) {
      throw new Error("NameService nonce is required");
    }
    if (!formData.lockNumber) {
      throw new Error("Clow number is required");
    }
    if (!formData.nonceEVVM) {
      throw new Error("EVVM nonce is required");
    }
    if (!formData.priorityFeePay) {
      throw new Error("Priority fee is required");
    }

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

      await readRewardAmount();

      // Sign EVVM payment first
      const payAction = await coreService.pay({
        toAddress: formData.addressNameService as `0x${string}`,
        tokenAddress: "0x0000000000000000000000000000000000000001" as `0x${string}`,
        amount: rewardAmount ? rewardAmount * BigInt(100) : BigInt(0),
        priorityFee: BigInt(formData.priorityFeePay),
        nonce: BigInt(formData.nonceEVVM),
        isAsyncExec: formData.isAsyncExec,
        senderExecutor: formData.addressNameService as `0x${string}`,
      });

      // Sign registration username action
      const registrationAction = await nameServiceService.registrationUsername({
        username: formData.username,
        lockNumber: BigInt(formData.lockNumber),
        nonce: BigInt(formData.nonceNameService),
        evvmSignedAction: payAction,
      });

      setDataToGet({
        IPayData: payAction.toJSON(),
        IRegistrationUsernameData: registrationAction.toJSON(),
      });
    } catch (error) {
      console.error("Error creating signatures:", error);
    }
  };

  const readRewardAmount = async () => {
    // Use the prop directly instead of a missing input
    if (!nameServiceAddress) {
      setRewardAmount(null);
    } else {
      await readContract(config, {
        abi: NameServiceABI,
        address: nameServiceAddress as `0x${string}`,
        functionName: "getEvvmAddress",
        args: [],
      })
        .then((coreAddress) => {
          if (!coreAddress) {
            setRewardAmount(null);
          }

          readContract(config, {
            abi: CoreABI,
            address: coreAddress as `0x${string}`,
            functionName: "getRewardAmount",
            args: [],
          })
            .then((reward) => {
              console.log("Mate reward amount:", reward);
              setRewardAmount(reward ? BigInt(reward.toString()) : null);
            })
            .catch((error) => {
              console.error("Error reading mate reward amount:", error);
              setRewardAmount(null);
            });
        })
        .catch((error) => {
          console.error("Error reading NameService address:", error);
          setRewardAmount(null);
        });
    }
  };

  const executeAction = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }

    try {
      const signer = await getEvvmSigner();
      await execute(signer, dataToGet.IRegistrationUsernameData);
      console.log("Registration username executed successfully");
      setDataToGet(null);
    } catch (error) {
      console.error("Error executing registration username:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Registration of username"
        link="https://www.evvm.info/docs/SignatureStructures/NameService/registrationUsernameStructure"
      />

      <br />

      <p>
        This functionality is not considering username offers to calculate
        registration fees. We acknowledge that this functionality is needed to
        avoid reentrancy renewal attacks to avoid paying the demand based
        renewal fee.
      </p>
      <br />

      <NumberInputWithGenerator
        label="NameService Nonce"
        inputId="nonceNameServiceInput_registrationUsername"
        placeholder="Enter nonce"
      />

      <NumberInputField
        label="Clow Number"
        inputId="lockNumberInput_registrationUsername"
        placeholder="Enter clow number"
      />

      <TextInputField
        label="Username"
        inputId="usernameInput_registrationUsername"
        placeholder="Enter username"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_registrationUsername"
        placeholder="Enter priority fee"
      />

      {/* Priority configuration */}
      <PrioritySelector onPriorityChange={setPriority} />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_registrationUsername"
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
