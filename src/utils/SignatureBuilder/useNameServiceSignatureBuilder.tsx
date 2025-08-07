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
    addressNameService: string,

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
            addressNameService,
            "0x0000000000000000000000000000000000000001",
            "0",
            priorityFee_EVVM.toString(),
            nonce_EVVM.toString(),
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
    addressNameService: string,
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
            addressNameService,
            "0x0000000000000000000000000000000000000001",
            (mateReward * BigInt(100)).toString(),
            priorityFee_EVVM.toString(),
            nonce_EVVM.toString(),
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
    addressNameService: string,

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
            addressNameService,
            "0x0000000000000000000000000000000000000001",
            amount.toString(),
            priorityFee_EVVM.toString(),
            nonce_EVVM.toString(),
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
    addressNameService: string,

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
            addressNameService,
            "0x0000000000000000000000000000000000000001",
            "0",
            priorityFee_EVVM.toString(),
            nonce_EVVM.toString(),
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
    addressNameService: string,

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
            addressNameService,
            "0x0000000000000000000000000000000000000001",
            "0",
            priorityFee_EVVM.toString(),
            nonce_EVVM.toString(),
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
    addressNameService: string,
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
      username,
      nonce
    );

    signMessage(
      { message: renewUsernameMessage },
      {
        onSuccess: (makeOfferSignature) => {
          const payMessage = buildMessageSignedForPay(
            addressNameService,
            "0x0000000000000000000000000000000000000001",
            amountToRenew.toString(),
            priorityFee_EVVM.toString(),
            nonce_EVVM.toString(),
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
    addressNameService: string,
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
      identity,
      value,
      nonce
    );

    signMessage(
      { message: customMetadataMessage },
      {
        onSuccess: (makeOfferSignature) => {
          const payMessage = buildMessageSignedForPay(
            addressNameService,
            "0x0000000000000000000000000000000000000001",
            amountToAddCustomMetadata.toString(),
            priorityFee_EVVM.toString(),
            nonce_EVVM.toString(),
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
    addressNameService: string,

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
      buildMessageSignedForRemoveCustomMetadata(identity, key, nonce);
    signMessage(
      { message: removeCustomMetadataMessage },
      {
        onSuccess: (makeOfferSignature) => {
          const payMessage = buildMessageSignedForPay(
            addressNameService,
            "0x0000000000000000000000000000000000000001",
            amountToRemoveCustomMetadata.toString(),
            priorityFee_EVVM.toString(),
            nonce_EVVM.toString(),
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
    addressNameService: string,

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
      identity,
      nonce
    );
    signMessage(
      { message: flushCustomMetadataMessage },
      {
        onSuccess: (flushSignature) => {
          const payMessage = buildMessageSignedForPay(
            addressNameService,
            "0x0000000000000000000000000000000000000001",
            priceToFlushCustomMetadata.toString(),
            priorityFee_EVVM.toString(),
            nonce_EVVM.toString(),
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
    addressNameService: string,

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
      username,
      nonce
    );
    signMessage(
      { message: flushCustomMetadataMessage },
      {
        onSuccess: (flushSignature) => {
          const payMessage = buildMessageSignedForPay(
            addressNameService,
            "0x0000000000000000000000000000000000000001",
            priceToFlushUsername.toString(),
            priorityFee_EVVM.toString(),
            nonce_EVVM.toString(),
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
