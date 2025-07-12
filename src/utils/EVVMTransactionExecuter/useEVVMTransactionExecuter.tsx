import { writeContract } from "@wagmi/core";
import { DispersePayInputData, PayInputData } from "../evvmTypeInputStructure";
import { config } from "@/config";
import { address } from "@/constants/address";
import Evvm from "@/constants/abi/Evvm.json";

const executePay = async (
  InputData: PayInputData,
  chainId: number,
  asStaker: boolean
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  if (InputData.priority) {
    writeContract(config, {
      abi: Evvm.abi,
      address: address[chainId.toString() as keyof typeof address]
        .evvm as `0x${string}`,
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
      address: address[chainId.toString() as keyof typeof address]
        .evvm as `0x${string}`,
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
  chainId: number
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  writeContract(config, {
    abi: Evvm.abi,
    address: address[chainId.toString() as keyof typeof address]
      .evvm as `0x${string}`,
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

export { executePay, executeDispersePay };
