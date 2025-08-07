import { writeContract } from "@wagmi/core";
import { config } from "@/config";
import NameService from "@/constants/abi/NameService.json";
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
} from "../TypeInputStructures/";

const executePreRegistrationUsername = async (
  InputData: PreRegistrationUsernameInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameService.abi,
    address: nameServiceAddress,
    functionName: "preRegistrationUsername",
    args: [
      InputData.user,
      InputData.hashPreRegisteredUsername,
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

const executeRegistrationUsername = async (
  InputData: RegistrationUsernameInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameService.abi,
    address: nameServiceAddress,
    functionName: "registrationUsername",
    args: [
      InputData.user,
      InputData.username,
      InputData.clowNumber,
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

const executeMakeOffer = async (
  InputData: MakeOfferInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameService.abi,
    address: nameServiceAddress,
    functionName: "makeOffer",
    args: [
      InputData.user,
      InputData.username,
      InputData.expireDate,
      InputData.amount,
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

const executeWithdrawOffer = async (
  InputData: WithdrawOfferInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameService.abi,
    address: nameServiceAddress,
    functionName: "withdrawOffer",
    args: [
      InputData.user,
      InputData.username,
      InputData.offerID,
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

const executeAcceptOffer = async (
  InputData: AcceptOfferInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameService.abi,
    address: nameServiceAddress,
    functionName: "acceptOffer",
    args: [
      InputData.user,
      InputData.username,
      InputData.offerID,
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

const executeRenewUsername = async (
  InputData: RenewUsernameInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameService.abi,
    address: nameServiceAddress,
    functionName: "renewUsername",
    args: [
      InputData.user,
      InputData.username,
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

const executeAddCustomMetadata = async (
  InputData: AddCustomMetadataInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameService.abi,
    address: nameServiceAddress,
    functionName: "addCustomMetadata",
    args: [
      InputData.user,
      InputData.identity,
      InputData.value,
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

const executeRemoveCustomMetadata = async (
  InputData: RemoveCustomMetadataInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameService.abi,
    address: nameServiceAddress,
    functionName: "removeCustomMetadata",
    args: [
      InputData.user,
      InputData.identity,
      InputData.key,
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

const executeFlushCustomMetadata = async (
  InputData: FlushCustomMetadataInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameService.abi,
    address: nameServiceAddress,
    functionName: "flushCustomMetadata",
    args: [
      InputData.user,
      InputData.identity,
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

const executeFlushUsername = async (
  InputData: FlushUsernameInputData,
  nameServiceAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No input to execute");
  }

  writeContract(config, {
    abi: NameService.abi,
    address: nameServiceAddress,
    functionName: "flushUsername",
    args: [
      InputData.user,
      InputData.username,
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
  executePreRegistrationUsername,
  executeRegistrationUsername,
  executeMakeOffer,
  executeWithdrawOffer,
  executeAcceptOffer,
  executeRenewUsername,
  executeAddCustomMetadata,
  executeRemoveCustomMetadata,
  executeFlushCustomMetadata,
  executeFlushUsername,
};
