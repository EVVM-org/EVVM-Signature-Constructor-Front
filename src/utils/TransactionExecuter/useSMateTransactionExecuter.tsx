import { writeContract } from "@wagmi/core";
import { config } from "@/config";
import SMate from "@/constants/abi/SMate.json";
import { GoldenStakingInputData } from "../TypeStructures/sMateTypeInputStructure";

const executeGoldenStaking = async (
  InputData: GoldenStakingInputData,
  sMateAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  writeContract(config, {
    abi: SMate.abi,
    address: sMateAddress,
    functionName: "goldenStaking",
    args: [
      InputData.isStaking,
      InputData.amountOfSMate,
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

export { executeGoldenStaking };
