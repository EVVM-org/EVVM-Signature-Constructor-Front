import { simulateContract } from "@wagmi/core";
import { config } from "@/config";
import MateNameService from "@/constants/abi/MateNameService.json";
import {
  MakeOfferInputData,
  PreRegistrationUsernameInputData,
  RegistrationUsernameInputData,
} from "../TypeInputStructures/mnsTypeInputStructure";

const verifyPreRegistrationUsername = async (
  InputData: PreRegistrationUsernameInputData,
  mnsAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  simulateContract(config, {
    abi: MateNameService.abi,
    address: mnsAddress,
    functionName: "preRegistrationUsername",
    args: [
      InputData.user,
      InputData.nonce,
      InputData.hashUsername,
      InputData.priorityFeeForFisher,
      InputData.signature,
      InputData.nonce_Evvm,
      InputData.priority_Evvm,
      InputData.signature_Evvm,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const verifyRegistrationUsername = async (
  InputData: RegistrationUsernameInputData,
  mnsAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  simulateContract(config, {
    abi: MateNameService.abi,
    address: mnsAddress,
    functionName: "registrationUsername",
    args: [
      InputData.user,
      InputData.nonce,
      InputData.username,
      InputData.clowNumber,
      InputData.signature,
      InputData.priorityFeeForFisher,
      InputData.nonce_Evvm,
      InputData.priority_Evvm,
      InputData.signature_Evvm,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const simulateMakeOffer = async (
  InputData: MakeOfferInputData,
  mnsAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  simulateContract(config, {
    abi: MateNameService.abi,
    address: mnsAddress,
    functionName: "makeOffer",
    args: [
      InputData.user,
      InputData.nonce,
      InputData.username,
      InputData.amount,
      InputData.expireDate,
      InputData.priorityFeeForFisher,
      InputData.signature,
      InputData.nonce_Evvm,
      InputData.priority_Evvm,
      InputData.signature_Evvm,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export {
  verifyPreRegistrationUsername,
  verifyRegistrationUsername,
  simulateMakeOffer,
};
