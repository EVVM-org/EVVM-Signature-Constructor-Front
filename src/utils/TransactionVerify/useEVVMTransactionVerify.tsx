// Functions to simulate/verify EVVM payment and disperse payment transactions.
import { simulateContract } from "@wagmi/core";
import {
  DispersePayInputData,
  PayInputData,
} from "../TypeInputStructures/evvmTypeInputStructure";
import { config } from "@/config";
import Evvm from "@/constants/abi/Evvm.json";

const verifyPay = async (
  InputData: PayInputData,
  evvmAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  // Use the unified pay function with correct argument order and types
  return simulateContract(config, {
    abi: Evvm.abi,
    address: evvmAddress,
    functionName: "pay",
    args: [
      InputData.from,
      InputData.to_address,
      InputData.to_identity,
      InputData.token,
      InputData.amount,
      InputData.priorityFee,
      InputData.nonce,
      !!InputData.priority, // priorityFlag as boolean
      InputData.executor,
      InputData.signature,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const verifyDispersePay = async (
  InputData: DispersePayInputData,
  evvmAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  simulateContract(config, {
    abi: Evvm.abi,
    address: evvmAddress,
    functionName: "dispersePay",
    args: [
      InputData.from,
      InputData.toData,
      InputData.token,
      InputData.amount,
      InputData.priorityFee,
      InputData.nonce,
      InputData.priority,
      InputData.executor,
      InputData.signature,
    ],
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

const verifyPayMultiple = async (
  InputData: PayInputData[],
  evvmAddress: `0x${string}`
) => {
  if (!InputData || InputData.length === 0) {
    return Promise.reject("No data to execute multiple payments");
  }
  simulateContract(config, {
    abi: Evvm.abi,
    address: evvmAddress,
    functionName: "payMultiple",
    args: InputData.map((data) => [
      data.from,
      data.to_address,
      data.to_identity,
      data.token,
      data.amount,
      data.priorityFee,
      data.nonce,
      data.executor,
      data.signature,
    ]),
  })
    .then(() => {
      return Promise.resolve();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
};

export { verifyPay, verifyDispersePay, verifyPayMultiple };
