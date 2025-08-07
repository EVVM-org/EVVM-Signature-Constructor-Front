import { simulateContract } from "@wagmi/core";
import { config } from "@/config";
import SMate from "@/constants/abi/SMate.json";
import {
  GoldenStakingInputData,
  PresaleStakingInputData,
  PublicServiceStakingInputData,
  PublicStakingInputData,
} from "../TypeInputStructures/stakingTypeInputStructure";

const verifyGoldenStaking = async (
  InputData: GoldenStakingInputData,
  sMateAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  simulateContract(config, {
    abi: SMate.abi,
    address: sMateAddress,
    functionName: "goldenStaking",
    args: [InputData.isStaking, InputData.amountOfSMate, InputData.signature],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const verifyPresaleStaking = async (
  InputData: PresaleStakingInputData,
  sMateAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  simulateContract(config, {
    abi: SMate.abi,
    address: sMateAddress,
    functionName: "goldenStaking",
    args: [
      InputData.isStaking,
      InputData.user,
      InputData.nonce,
      InputData.signature,
      InputData.priorityFee_Evvm,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const verifyPublicStaking = async (
  InputData: PublicStakingInputData,
  sMateAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  simulateContract(config, {
    abi: SMate.abi,
    address: sMateAddress,
    functionName: "publicStaking",
    args: [
      InputData.isStaking,
      InputData.user,
      InputData.nonce,
      InputData.amountOfSMate,
      InputData.signature,
      InputData.priorityFee_Evvm,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const verifyPublicServiceStaking = async (
  InputData: PublicServiceStakingInputData,
  sMateAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  simulateContract(config, {
    abi: SMate.abi,
    address: sMateAddress,
    functionName: "publicStaking",
    args: [
      InputData.isStaking,
      InputData.user,
      InputData.service,
      InputData.nonce,
      InputData.amountOfSMate,
      InputData.signature,
      InputData.priorityFee_Evvm,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
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
  verifyGoldenStaking,
  verifyPresaleStaking,
  verifyPublicStaking,
  verifyPublicServiceStaking,
};
