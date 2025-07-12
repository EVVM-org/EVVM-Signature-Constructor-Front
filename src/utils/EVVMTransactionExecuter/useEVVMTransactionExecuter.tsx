import { writeContract } from "@wagmi/core";
import { DispersePayInputData, PayInputData } from "../evvmTypeInputStructure";
import { config } from "@/config";
import { address } from "@/constants/address";
import Evvm from "@/constants/abi/Evvm.json";

const executePay = async (
  InputData: PayInputData,
  evvmAddress: `0x${string}`,
  asStaker: boolean
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  if (InputData.priority) {
    writeContract(config, {
      abi: Evvm.abi,
      address: evvmAddress,
      functionName: asStaker
        ? "payMateStaking_async"
        : "payNoMateStaking_async",
      args: [
        InputData.from,
        InputData.to_address,
        InputData.to_identity,
        InputData.token,
        InputData.amount,
        InputData.priorityFee,
        InputData.nonce,
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
  } else {
    writeContract(config, {
      abi: Evvm.abi,
      address: evvmAddress,
      functionName: asStaker ? "payMateStaking_sync" : "payNoMateStaking_sync",
      args: [
        InputData.from,
        InputData.to_address,
        InputData.to_identity,
        InputData.token,
        InputData.amount,
        InputData.priorityFee,
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
  }
};

const executeDispersePay = async (
  InputData: DispersePayInputData,
  evvmAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  writeContract(config, {
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

const executePayMultiple = async (
  InputData: PayInputData[],
  evvmAddress: `0x${string}`
) => {
  if (!InputData || InputData.length === 0) {
    return Promise.reject("No data to execute multiple payments");
  }
  writeContract(config, {
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

export { executePay, executeDispersePay, executePayMultiple };
