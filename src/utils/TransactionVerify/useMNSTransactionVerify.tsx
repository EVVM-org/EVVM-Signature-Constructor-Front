import { simulateContract } from "@wagmi/core";
import { config } from "@/config";
import MateNameService from "@/constants/abi/MateNameService.json";
import {
  PreRegistrationUsernameInputData,
  RegistrationUsernameInputData,
  MakeOfferInputData,
  WithdrawOfferInputData,
  AcceptOfferInputData,
  RenewUsernameInputData,
  AddCustomMetadataInputData,
  RemoveCustomMetadataInputData,
  FlushCustomMetadataInputData,
  FlushUsernameInputData,
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

const verifyMakeOffer = async (
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

const verifyWithdrawOffer = async (
  InputData: WithdrawOfferInputData,
  mnsAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  simulateContract(config, {
    abi: MateNameService.abi,
    address: mnsAddress,
    functionName: "withdrawOffer",
    args: [
      InputData.user,
      InputData.nonce,
      InputData.username,
      InputData.offerID,
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

const verifyAcceptOffer = async (
  InputData: AcceptOfferInputData,
  mnsAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  simulateContract(config, {
    abi: MateNameService.abi,
    address: mnsAddress,
    functionName: "acceptOffer",
    args: [
      InputData.user,
      InputData.nonce,
      InputData.username,
      InputData.offerID,
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

const verifyRenewUsername = async (
  InputData: RenewUsernameInputData,
  mnsAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  simulateContract(config, {
    abi: MateNameService.abi,
    address: mnsAddress,
    functionName: "renewUsername",
    args: [
      InputData.user,
      InputData.nonce,
      InputData.username,
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

const verifyAddCustomMetadata = async (
  InputData: AddCustomMetadataInputData,
  mnsAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  simulateContract(config, {
    abi: MateNameService.abi,
    address: mnsAddress,
    functionName: "addCustomMetadata",
    args: [
      InputData.user,
      InputData.nonce,
      InputData.identity,
      InputData.value,
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

const verifyRemoveCustomMetadata = async (
  InputData: RemoveCustomMetadataInputData,
  mnsAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  simulateContract(config, {
    abi: MateNameService.abi,
    address: mnsAddress,
    functionName: "removeCustomMetadata",
    args: [
      InputData.user,
      InputData.nonce,
      InputData.identity,
      InputData.key,
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

const verifyFlushCustomMetadata = async (
  InputData: FlushCustomMetadataInputData,
  mnsAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  simulateContract(config, {
    abi: MateNameService.abi,
    address: mnsAddress,
    functionName: "flushCustomMetadata",
    args: [
      InputData.user,
      InputData.nonce,
      InputData.identity,
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

const verifyFlushUsername = async (
  InputData: FlushUsernameInputData,
  mnsAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  simulateContract(config, {
    abi: MateNameService.abi,
    address: mnsAddress,
    functionName: "flushUsername",
    args: [
      InputData.user,
      InputData.identity,
      InputData.priorityFeeForFisher,
      InputData.nonce,
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
  verifyMakeOffer,
  verifyWithdrawOffer,
  verifyAcceptOffer,
  verifyRenewUsername,
  verifyAddCustomMetadata,
  verifyRemoveCustomMetadata,
  verifyFlushCustomMetadata,
  verifyFlushUsername,
};
