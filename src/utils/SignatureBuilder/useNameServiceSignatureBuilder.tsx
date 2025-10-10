import { useSignMessage } from "wagmi";
import {
  buildMessageSignedForAcceptOffer,
  buildMessageSignedForAddCustomMetadata,
  buildMessageSignedForFlushCustomMetadata,
  buildMessageSignedForFlushUsername,
  buildMessageSignedForMakeOffer,
  buildMessageSignedForPay,
  buildMessageSignedForPreRegistrationUsername,
  buildMessageSignedForRegistrationUsername,
  buildMessageSignedForRemoveCustomMetadata,
  buildMessageSignedForRenewUsername,
  buildMessageSignedForWithdrawOffer,
} from "./constructMessage";
import { hashPreRegisteredUsername } from "./hashTools";

export const useNameServiceSignatureBuilder = () => {
  const { signMessage, ...rest } = useSignMessage();

  // Generic ERC191 message signing
  const signERC191Message = (
    message: string,
    onSuccess?: (signature: string) => void,
    onError?: (error: Error) => void
  ) => {
    signMessage(
      { message },
      {
        onSuccess: (data) => onSuccess?.(data),
        onError: (error) => onError?.(error),
      }
    );
  };

  // NameService username pre-registration signature (dual signature if priority fee > 0)
  const signPreRegistrationUsername = (
    evvmID: bigint,
    addressNameService: `0x${string}`,
    username: string,
    clowNumber: bigint,
    nonce: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM_EVVM: boolean,
    onSuccess?: (
      paySignature: string,
      preRegistrationSignature: string
    ) => void,
    onError?: (error: Error) => void
  ) => {
    // Hash username with clown number for pre-registration
    const hashUsername = hashPreRegisteredUsername(username, clowNumber);
    const preRegistrationMessage = buildMessageSignedForPreRegistrationUsername(
      evvmID,
      hashUsername,
      nonce
    );

    signMessage(
      { message: preRegistrationMessage },
      {
        onSuccess: (preRegistrationSignature) => {
          // If no priority fee, skip payment signature
          if (priorityFee_EVVM === BigInt(0)) {
            onSuccess?.("", preRegistrationSignature);
            return;
          }

          // Payment signature for priority fee
          const payMessage = buildMessageSignedForPay(
            evvmID,
            addressNameService,
            "0x0000000000000000000000000000000000000001",
            BigInt(0),
            priorityFee_EVVM,
            nonce_EVVM,
            priorityFlag_EVVM_EVVM,
            addressNameService
          );

          signMessage(
            { message: payMessage },
            {
              onSuccess: (paySignature) =>
                onSuccess?.(paySignature, preRegistrationSignature),
              onError: (error) => onError?.(error),
            }
          );
        },
        onError: (error) => onError?.(error),
      }
    );
  };

  const signRegistrationUsername = (
    evvmID: bigint,
    addressNameService: `0x${string}`,
    username: string,
    clowNumber: bigint,
    nonce: bigint,
    mateReward: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean,
    onSuccess?: (paySignature: string, registrationSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const registrationMessage = buildMessageSignedForRegistrationUsername(
      evvmID,
      username,
      clowNumber,
      nonce
    );

    signMessage(
      { message: registrationMessage },
      {
        onSuccess: (registrationSignature) => {
          // Payment signature for priority fee
          const payMessage = buildMessageSignedForPay(
            evvmID,
            addressNameService,
            "0x0000000000000000000000000000000000000001",
            mateReward * BigInt(100),
            priorityFee_EVVM,
            nonce_EVVM,
            priorityFlag_EVVM,
            addressNameService
          );

          signMessage(
            { message: payMessage },
            {
              onSuccess: (paySignature) =>
                onSuccess?.(paySignature, registrationSignature),
              onError: (error) => onError?.(error),
            }
          );
        },
        onError: (error) => onError?.(error),
      }
    );
  };

  const signMakeOffer = (
    evvmID: bigint,
    addressNameService: `0x${string}`,
    username: string,
    expirationDate: bigint,
    amount: bigint,
    nonce: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean,
    onSuccess?: (paySignature: string, makeOfferSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const makeOfferMessage = buildMessageSignedForMakeOffer(
      evvmID,
      username,
      expirationDate,
      amount,
      nonce
    );

    signMessage(
      { message: makeOfferMessage },
      {
        onSuccess: (makeOfferSignature) => {
          // Payment signature for priority fee
          const payMessage = buildMessageSignedForPay(
            evvmID,
            addressNameService,
            "0x0000000000000000000000000000000000000001",
            amount,
            priorityFee_EVVM,
            nonce_EVVM,
            priorityFlag_EVVM,
            addressNameService
          );

          signMessage(
            { message: payMessage },
            {
              onSuccess: (paySignature) =>
                onSuccess?.(paySignature, makeOfferSignature),
              onError: (error) => onError?.(error),
            }
          );
        },
        onError: (error) => onError?.(error),
      }
    );
  };

  const signWithdrawOffer = (
    evvmID: bigint,
    addressNameService: `0x${string}`,
    username: string,
    offerId: bigint,
    nonce: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean,
    onSuccess?: (paySignature: string, makeOfferSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const withdrawOfferMessage = buildMessageSignedForWithdrawOffer(
      evvmID,
      username,
      offerId,
      nonce
    );

    signMessage(
      { message: withdrawOfferMessage },
      {
        onSuccess: (makeOfferSignature) => {
          // Payment signature for priority fee
          if (priorityFee_EVVM === BigInt(0)) {
            onSuccess?.("", makeOfferSignature);
            return;
          }

          const payMessage = buildMessageSignedForPay(
            evvmID,
            addressNameService,
            "0x0000000000000000000000000000000000000001",
            BigInt(0),
            priorityFee_EVVM,
            nonce_EVVM,
            priorityFlag_EVVM,
            addressNameService
          );

          signMessage(
            { message: payMessage },
            {
              onSuccess: (paySignature) =>
                onSuccess?.(paySignature, makeOfferSignature),
              onError: (error) => onError?.(error),
            }
          );
        },
        onError: (error) => onError?.(error),
      }
    );
  };

  const signAcceptOffer = (
    evvmID: bigint,
    addressNameService: `0x${string}`,
    username: string,
    offerId: bigint,
    nonce: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean,
    onSuccess?: (paySignature: string, makeOfferSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const acceptOfferMessage = buildMessageSignedForAcceptOffer(
      evvmID,
      username,
      offerId,
      nonce
    );

    signMessage(
      { message: acceptOfferMessage },
      {
        onSuccess: (makeOfferSignature) => {
          // Payment signature for priority fee
          if (priorityFee_EVVM === BigInt(0)) {
            onSuccess?.("", makeOfferSignature);
            return;
          }

          const payMessage = buildMessageSignedForPay(
            evvmID,
            addressNameService,
            "0x0000000000000000000000000000000000000001",
            BigInt(0),
            priorityFee_EVVM,
            nonce_EVVM,
            priorityFlag_EVVM,
            addressNameService
          );

          signMessage(
            { message: payMessage },
            {
              onSuccess: (paySignature) =>
                onSuccess?.(paySignature, makeOfferSignature),
              onError: (error) => onError?.(error),
            }
          );
        },
        onError: (error) => onError?.(error),
      }
    );
  };

  const signRenewUsername = (
    evvmID: bigint,
    addressNameService: `0x${string}`,
    username: string,
    nonce: bigint,
    amountToRenew: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean,
    onSuccess?: (paySignature: string, makeOfferSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const renewUsernameMessage = buildMessageSignedForRenewUsername(
      evvmID,
      username,
      nonce
    );

    signMessage(
      { message: renewUsernameMessage },
      {
        onSuccess: (makeOfferSignature) => {
          const payMessage = buildMessageSignedForPay(
            evvmID,
            addressNameService,
            "0x0000000000000000000000000000000000000001",
            amountToRenew,
            priorityFee_EVVM,
            nonce_EVVM,
            priorityFlag_EVVM,
            addressNameService
          );

          signMessage(
            { message: payMessage },
            {
              onSuccess: (paySignature) =>
                onSuccess?.(paySignature, makeOfferSignature),
              onError: (error) => onError?.(error),
            }
          );
        },
        onError: (error) => onError?.(error),
      }
    );
  };

  const signAddCustomMetadata = (
    evvmID: bigint,
    addressNameService: `0x${string}`,
    nonce: bigint,
    identity: string,
    value: string,
    amountToAddCustomMetadata: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean,
    onSuccess?: (paySignature: string, customMetadataSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const customMetadataMessage = buildMessageSignedForAddCustomMetadata(
      evvmID,
      identity,
      value,
      nonce
    );

    signMessage(
      { message: customMetadataMessage },
      {
        onSuccess: (makeOfferSignature) => {
          const payMessage = buildMessageSignedForPay(
            evvmID,
            addressNameService,
            "0x0000000000000000000000000000000000000001",
            amountToAddCustomMetadata,
            priorityFee_EVVM,
            nonce_EVVM,
            priorityFlag_EVVM,
            addressNameService
          );

          signMessage(
            { message: payMessage },
            {
              onSuccess: (paySignature) =>
                onSuccess?.(paySignature, makeOfferSignature),
              onError: (error) => onError?.(error),
            }
          );
        },
        onError: (error) => onError?.(error),
      }
    );
  };

  const signRemoveCustomMetadata = (
    evvmID: bigint,
    addressNameService: `0x${string}`,
    identity: string,
    key: bigint,
    nonce: bigint,
    amountToRemoveCustomMetadata: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean,
    onSuccess?: (paySignature: string, removeMetadataSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const removeCustomMetadataMessage =
      buildMessageSignedForRemoveCustomMetadata(evvmID, identity, key, nonce);
    signMessage(
      { message: removeCustomMetadataMessage },
      {
        onSuccess: (makeOfferSignature) => {
          const payMessage = buildMessageSignedForPay(
            evvmID,
            addressNameService,
            "0x0000000000000000000000000000000000000001",
            amountToRemoveCustomMetadata,
            priorityFee_EVVM,
            nonce_EVVM,
            priorityFlag_EVVM,
            addressNameService
          );

          signMessage(
            { message: payMessage },
            {
              onSuccess: (paySignature) =>
                onSuccess?.(paySignature, makeOfferSignature),
              onError: (error) => onError?.(error),
            }
          );
        },
        onError: (error) => onError?.(error),
      }
    );
  };

  const signFlushCustomMetadata = (
    evvmID: bigint,
    addressNameService: `0x${string}`,
    identity: string,
    nonce: bigint,
    priceToFlushCustomMetadata: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean,
    onSuccess?: (paySignature: string, flushSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const flushCustomMetadataMessage = buildMessageSignedForFlushCustomMetadata(
      evvmID,
      identity,
      nonce
    );
    signMessage(
      { message: flushCustomMetadataMessage },
      {
        onSuccess: (flushSignature) => {
          const payMessage = buildMessageSignedForPay(
            evvmID,
            addressNameService,
            "0x0000000000000000000000000000000000000001",
            priceToFlushCustomMetadata,
            priorityFee_EVVM,
            nonce_EVVM,
            priorityFlag_EVVM,
            addressNameService
          );

          signMessage(
            { message: payMessage },
            {
              onSuccess: (paySignature) =>
                onSuccess?.(paySignature, flushSignature),
              onError: (error) => onError?.(error),
            }
          );
        },
        onError: (error) => onError?.(error),
      }
    );
  };

  const signFlushUsername = (
    evvmID: bigint,
    addressNameService: `0x${string}`,
    username: string,
    nonce: bigint,
    priceToFlushUsername: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean,
    onSuccess?: (paySignature: string, flushSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const flushCustomMetadataMessage = buildMessageSignedForFlushUsername(
      evvmID,
      username,
      nonce
    );
    signMessage(
      { message: flushCustomMetadataMessage },
      {
        onSuccess: (flushSignature) => {
          const payMessage = buildMessageSignedForPay(
            evvmID,
            addressNameService,
            "0x0000000000000000000000000000000000000001",
            priceToFlushUsername,
            priorityFee_EVVM,
            nonce_EVVM,
            priorityFlag_EVVM,
            addressNameService
          );

          signMessage(
            { message: payMessage },
            {
              onSuccess: (paySignature) =>
                onSuccess?.(paySignature, flushSignature),
              onError: (error) => onError?.(error),
            }
          );
        },
        onError: (error) => onError?.(error),
      }
    );
  };

  return {
    signMessage,
    signERC191Message,
    signPreRegistrationUsername,
    signRegistrationUsername,
    signMakeOffer,
    signWithdrawOffer,
    signAcceptOffer,
    signRenewUsername,
    signAddCustomMetadata,
    signRemoveCustomMetadata,
    signFlushCustomMetadata,
    signFlushUsername,
    ...rest,
  };
};
