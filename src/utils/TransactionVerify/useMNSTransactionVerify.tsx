/**
 * useMNSTransactionVerify
 *
 * Functions to simulate/verify NameService transactions (registration, offers, metadata, etc).
 * Each function simulates a contract call for a specific NameService action using wagmi's simulateContract.
 * Returns a Promise that resolves on success or rejects on error.
 * Input types match the contract ABI.
 */
import { simulateContract } from "@wagmi/core";
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
} from "../TypeInputStructures/nameServiceTypeInputStructure";

const verifyPreRegistrationUsername = async (
  InputData: PreRegistrationUsernameInputData,
  mnsAddress: `0x${string}`
) => {
  if (!InputData) {
    return Promise.reject("No data to execute payment");
  }

  simulateContract(config, {
    abi: NameService.abi,
    address: mnsAddress,
    functionName: "preRegistrationUsername",
    args: [
<<<<<<< HEAD
      InputData.user,
      InputData.nonce,
      InputData.hashPreRegisteredUsername,
      InputData.priorityFee_EVVM,
      InputData.signature,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
=======
  InputData.user,
  InputData.nonce,
  InputData.hashPreRegisteredUsername,
  InputData.priorityFee_EVVM,
  InputData.signature,
  InputData.nonce_EVVM,
  InputData.priorityFlag_EVVM,
  InputData.signature_EVVM,
>>>>>>> 6d4a5055bda408f757e1ab4fdeb7f8bd8a7cc96b
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
    abi: NameService.abi,
    address: mnsAddress,
    functionName: "registrationUsername",
    args: [
<<<<<<< HEAD
      InputData.user,
      InputData.nonce,
      InputData.username,
      InputData.clowNumber,
      InputData.signature,
      InputData.priorityFee_EVVM,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
=======
  InputData.user,
  InputData.nonce,
  InputData.username,
  InputData.clowNumber,
  InputData.signature,
  InputData.priorityFee_EVVM,
  InputData.nonce_EVVM,
  InputData.priorityFlag_EVVM,
  InputData.signature_EVVM,
>>>>>>> 6d4a5055bda408f757e1ab4fdeb7f8bd8a7cc96b
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
    abi: NameService.abi,
    address: mnsAddress,
    functionName: "makeOffer",
    args: [
<<<<<<< HEAD
      InputData.user,
      InputData.nonce,
      InputData.username,
      InputData.amount,
      InputData.expireDate,
      InputData.priorityFee_EVVM,
      InputData.signature,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
=======
  InputData.user,
  InputData.nonce,
  InputData.username,
  InputData.amount,
  InputData.expireDate,
  InputData.priorityFee_EVVM,
  InputData.signature,
  InputData.nonce_EVVM,
  InputData.priorityFlag_EVVM,
  InputData.signature_EVVM,
>>>>>>> 6d4a5055bda408f757e1ab4fdeb7f8bd8a7cc96b
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
    abi: NameService.abi,
    address: mnsAddress,
    functionName: "withdrawOffer",
    args: [
<<<<<<< HEAD
      InputData.user,
      InputData.nonce,
      InputData.username,
      InputData.offerID,
      InputData.priorityFee_EVVM,
      InputData.signature,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
=======
  InputData.user,
  InputData.nonce,
  InputData.username,
  InputData.offerID,
  InputData.priorityFee_EVVM,
  InputData.signature,
  InputData.nonce_EVVM,
  InputData.priorityFlag_EVVM,
  InputData.signature_EVVM,
>>>>>>> 6d4a5055bda408f757e1ab4fdeb7f8bd8a7cc96b
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
    abi: NameService.abi,
    address: mnsAddress,
    functionName: "acceptOffer",
    args: [
<<<<<<< HEAD
      InputData.user,
      InputData.nonce,
      InputData.username,
      InputData.offerID,
      InputData.priorityFee_EVVM,
      InputData.signature,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
=======
  InputData.user,
  InputData.nonce,
  InputData.username,
  InputData.offerID,
  InputData.priorityFee_EVVM,
  InputData.signature,
  InputData.nonce_EVVM,
  InputData.priorityFlag_EVVM,
  InputData.signature_EVVM,
>>>>>>> 6d4a5055bda408f757e1ab4fdeb7f8bd8a7cc96b
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
    abi: NameService.abi,
    address: mnsAddress,
    functionName: "renewUsername",
    args: [
<<<<<<< HEAD
      InputData.user,
      InputData.nonce,
      InputData.username,
      InputData.priorityFee_EVVM,
      InputData.signature,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
=======
  InputData.user,
  InputData.nonce,
  InputData.username,
  InputData.priorityFee_EVVM,
  InputData.signature,
  InputData.nonce_EVVM,
  InputData.priorityFlag_EVVM,
  InputData.signature_EVVM,
>>>>>>> 6d4a5055bda408f757e1ab4fdeb7f8bd8a7cc96b
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
    abi: NameService.abi,
    address: mnsAddress,
    functionName: "addCustomMetadata",
    args: [
<<<<<<< HEAD
      InputData.user,
      InputData.nonce,
      InputData.identity,
      InputData.value,
      InputData.priorityFee_EVVM,
      InputData.signature,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
=======
  InputData.user,
  InputData.nonce,
  InputData.identity,
  InputData.value,
  InputData.priorityFee_EVVM,
  InputData.signature,
  InputData.nonce_EVVM,
  InputData.priorityFlag_EVVM,
  InputData.signature_EVVM,
>>>>>>> 6d4a5055bda408f757e1ab4fdeb7f8bd8a7cc96b
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
    abi: NameService.abi,
    address: mnsAddress,
    functionName: "removeCustomMetadata",
    args: [
<<<<<<< HEAD
      InputData.user,
      InputData.nonce,
      InputData.identity,
      InputData.key,
      InputData.priorityFee_EVVM,
      InputData.signature,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
=======
  InputData.user,
  InputData.nonce,
  InputData.identity,
  InputData.key,
  InputData.priorityFee_EVVM,
  InputData.signature,
  InputData.nonce_EVVM,
  InputData.priorityFlag_EVVM,
  InputData.signature_EVVM,
>>>>>>> 6d4a5055bda408f757e1ab4fdeb7f8bd8a7cc96b
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
    abi: NameService.abi,
    address: mnsAddress,
    functionName: "flushCustomMetadata",
    args: [
<<<<<<< HEAD
      InputData.user,
      InputData.nonce,
      InputData.identity,
      InputData.priorityFee_EVVM,
      InputData.signature,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
=======
  InputData.user,
  InputData.nonce,
  InputData.identity,
  InputData.priorityFee_EVVM,
  InputData.signature,
  InputData.nonce_EVVM,
  InputData.priorityFlag_EVVM,
  InputData.signature_EVVM,
>>>>>>> 6d4a5055bda408f757e1ab4fdeb7f8bd8a7cc96b
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
    abi: NameService.abi,
    address: mnsAddress,
    functionName: "flushUsername",
    args: [
<<<<<<< HEAD
      InputData.user,
      InputData.username,
      InputData.priorityFee_EVVM,
      InputData.nonce,
      InputData.signature,
      InputData.nonce_EVVM,
      InputData.priorityFlag_EVVM,
      InputData.signature_EVVM,
=======
  InputData.user,
  InputData.username,
  InputData.priorityFee_EVVM,
  InputData.nonce,
  InputData.signature,
  InputData.nonce_EVVM,
  InputData.priorityFlag_EVVM,
  InputData.signature_EVVM,
>>>>>>> 6d4a5055bda408f757e1ab4fdeb7f8bd8a7cc96b
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
