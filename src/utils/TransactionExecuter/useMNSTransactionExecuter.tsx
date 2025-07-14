import { writeContract } from "@wagmi/core";
import { config } from "@/config";
import MateNameService from "@/constants/abi/MateNameService.json";
import { PreRegistrationUsernameInputData } from "../TypeStructures/mnsTypeInputStructure";

const executePreRegistrationUsername = async (
  InputData: PreRegistrationUsernameInputData,
  mnsAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  writeContract(config, {
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

export { executePreRegistrationUsername };
