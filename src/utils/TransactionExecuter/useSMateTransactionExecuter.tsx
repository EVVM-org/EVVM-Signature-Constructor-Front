import { writeContract } from "@wagmi/core";
import {
  DispersePayInputData,
  PayInputData,
} from "../TypeStructures/evvmTypeInputStructure";
import { config } from "@/config";
import Evvm from "@/constants/abi/Evvm.json";

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

export { executeDispersePay };
