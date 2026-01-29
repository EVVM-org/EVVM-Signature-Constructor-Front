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
  IPreRegistrationUsernameData,
  NameService,
  EVVM,
  type ISerializableSignedAction,
} from "@evvm/evvm-js";

type InfoData = {
  IPayData: ISerializableSignedAction<IPayData>;
  IPreRegistrationUsernameData: ISerializableSignedAction<IPreRegistrationUsernameData>;
};

interface PreRegistrationUsernameComponentProps {
  nameServiceAddress: string;
}

export const PreRegistrationUsernameComponent = ({
  nameServiceAddress,
}: PreRegistrationUsernameComponentProps) => {
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);

  const makeSig = async () => {
    const getValue = (id: string) => {
      const el = document.getElementById(id) as HTMLInputElement | null;
      if (!el) {
        throw new Error(
          `Input element with id '${id}' not found. Ensure the input is rendered and the id is correct.`
        );
      }
      return el.value;
    };

    const formData = {
      addressNameService: nameServiceAddress,
      username: getValue("usernameInput_preRegistration"),
      nonce: getValue("nonceNameServiceInput_preRegistration"),
      clowNumber: getValue("clowNumberInput_preRegistration"),
      nonce_EVVM: getValue("nonceEVVMInput_preRegistration"),
      priorityFee_EVVM: getValue("priorityFeeInput_preRegistration"),
      priorityFlag_EVVM: priority === "high",
    };

    // Validate that required fields are not empty
    if (!formData.username) {
      throw new Error("Username is required");
    }
    if (!formData.nonce) {
      throw new Error("NameService nonce is required");
    }
    if (!formData.clowNumber) {
      throw new Error("Clow number is required");
    }
    if (!formData.nonce_EVVM) {
      throw new Error("EVVM nonce is required");
    }
    if (!formData.priorityFee_EVVM) {
      throw new Error("Priority fee is required");
    }

    try {
      const signer = await getEvvmSigner();
      
      // Create EVVM service for payment
      const evvmService = new EVVM({
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
        to: formData.addressNameService,
        tokenAddress: "0x0000000000000000000000000000000000000001" as `0x${string}`,
        amount: BigInt(0),
        priorityFee: BigInt(formData.priorityFee_EVVM),
        nonce: BigInt(formData.nonce_EVVM),
        priorityFlag: formData.priorityFlag_EVVM,
        executor: formData.addressNameService as `0x${string}`,
      });

      // Hash the username for pre-registration
      const hashUsername = "0x" + Buffer.from(formData.username + formData.clowNumber).toString('hex');

      // Sign pre-registration action
      const preRegistrationAction = await nameServiceService.preRegistrationUsername({
        user: signer.address,
        hashPreRegisteredUsername: hashUsername,
        nonce: BigInt(formData.nonce),
        evvmSignedAction: payAction,
      });

      setDataToGet({
        IPayData: payAction.toJSON(),
        IPreRegistrationUsernameData: preRegistrationAction.toJSON(),
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
      await execute(signer, dataToGet.IPreRegistrationUsernameData);
      console.log("Pre-registration username executed successfully");
      setDataToGet(null);
    } catch (error) {
      console.error("Error executing pre-registration username:", error);
    }
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Pre-registration of username"
        link="https://www.evvm.info/docs/SignatureStructures/NameService/preRegistrationUsernameStructure"
      />
      <br />
      <p>
        If this name was registered before is possible that you need to flush
        the custom metadata
      </p>
      <br />
      {/* Address Input */}

      {/* Nonce section with automatic generator */}

      <NumberInputWithGenerator
        label="Clow Number"
        inputId="clowNumberInput_preRegistration"
        placeholder="Enter clow number"
      />

      {/* Basic input fields */}

      <TextInputField
        label="Username"
        inputId="usernameInput_preRegistration"
        placeholder="Enter username"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_preRegistration"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="NameService Nonce"
        inputId="nonceNameServiceInput_preRegistration"
        placeholder="Enter nonce"
      />

      {/* Priority configuration */}
      <PrioritySelector onPriorityChange={setPriority} />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_preRegistration"
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
