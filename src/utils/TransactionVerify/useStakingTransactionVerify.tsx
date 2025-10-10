/**
 * useSMateTransactionVerify
 *
 * Functions to simulate/verify Staking transactions (golden, presale, public, service).
 * Each function simulates a contract call for a specific staking action using wagmi's simulateContract.
 * Returns a Promise that resolves on success or rejects on error.
 * Input types match the contract ABI.
 */
import { simulateContract } from "@wagmi/core";
import { config } from "@/config";
import SMate from "@/constants/abi/Staking.json";
import {
  GoldenStakingInputData,
  PresaleStakingInputData,
  PublicServiceStakingInputData,
  PublicStakingInputData,
} from "../TypeInputStructures/stakingTypeInputStructure";

const verifyGoldenStaking = async (
  InputData: GoldenStakingInputData,
  stakingAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  simulateContract(config, {
    abi: SMate.abi,
    address: stakingAddress,
    functionName: "goldenStaking",
    args: [InputData.isStaking, InputData.amountOfStaking, InputData.signature_EVVM],
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
  stakingAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  return simulateContract(config, {
    abi: SMate.abi,
    address: stakingAddress,
    functionName: "presaleStaking",
    args: [
      InputData.user,
      InputData.isStaking,
      InputData.nonce,
      InputData.signature,
      InputData.priorityFee_EVVM,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
    ],
  })
    .then(() => Promise.resolve())
    .catch((error) => Promise.reject(error));
};

const verifyPublicStaking = async (
  InputData: PublicStakingInputData,
  stakingAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  return simulateContract(config, {
    abi: SMate.abi,
    address: stakingAddress,
    functionName: "publicStaking",
    args: [
      InputData.user,
      InputData.isStaking,
      InputData.amountOfStaking,
      InputData.nonce,
      InputData.signature,
      InputData.priorityFee_EVVM,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
    ],
  })
    .then(() => Promise.resolve())
    .catch((error) => Promise.reject(error));
};

const verifyPublicServiceStaking = async (
  InputData: PublicServiceStakingInputData,
  stakingAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  return simulateContract(config, {
    abi: SMate.abi,
    address: stakingAddress,
    functionName: "publicServiceStaking",
    args: [
      InputData.user,
      InputData.service,
      InputData.isStaking,
      InputData.amountOfStaking,
      InputData.nonce,
      InputData.signature,
      InputData.priorityFee_EVVM,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
    ],
  })
    .then(() => Promise.resolve())
    .catch((error) => Promise.reject(error));
};

export {
  verifyGoldenStaking,
  verifyPresaleStaking,
  verifyPublicStaking,
  verifyPublicServiceStaking,
};
