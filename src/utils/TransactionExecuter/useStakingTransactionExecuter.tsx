/**
 * useStakingTransactionExecuter
 *
 * Functions to execute Staking transactions (golden, presale, public, service).
 * Each function calls the contract for a specific staking action using wagmi's writeContract.
 * Returns a Promise that resolves on success or rejects on error.
 * Input types match the contract ABI.
 */
import { writeContract } from "@wagmi/core";
import { config } from "@/config";
import { StakingABI } from "@evvm/viem-signature-library";
import {
  GoldenStakingInputData,
  PresaleStakingInputData,
  PublicServiceStakingInputData,
  PublicStakingInputData,
} from "@evvm/viem-signature-library";

const executeGoldenStaking = async (
  InputData: GoldenStakingInputData,
  stakingAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  writeContract(config, {
    abi: StakingABI,
    address: stakingAddress,
    functionName: "goldenStaking",
    args: [
      InputData.isStaking,
      InputData.amountOfStaking,
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

const executePresaleStaking = async (
  InputData: PresaleStakingInputData,
  stakingAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  writeContract(config, {
    abi: StakingABI,
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
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const executePublicStaking = async (
  InputData: PublicStakingInputData,
  stakingAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  writeContract(config, {
    abi: StakingABI,
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
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const executePublicServiceStaking = async (
  InputData: PublicServiceStakingInputData,
  stakingAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  writeContract(config, {
    abi: StakingABI,
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
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export {
  executeGoldenStaking,
  executePresaleStaking,
  executePublicStaking,
  executePublicServiceStaking,
};
