/**
 * useNameServiceSignatureBuilder
 *
 * React hook for building and signing NameService messages (offers, registration, metadata, etc).
 * Provides functions for each NameService action, using wagmi's useSignMessage for EIP-191 signatures.
 * Includes dual-signature logic for priority fee payments.
 *
 * @returns Object with signature builder functions for NameService actions.
 */
  /**
   * Signs a generic EIP-191 message.
   * @param message Message to sign
   * @param onSuccess Callback for successful signature
   * @param onError Callback for error
   */
  /**
   * Signs a NameService username pre-registration message.
   * If priorityFee_EVVM > 0, also signs a payment message for the priority fee.
   * @param addressNameService NameService contract address
   * @param username Username to pre-register
   * @param clowNumber Unique clown number
   * @param nonce Nonce for pre-registration
   * @param priorityFee_EVVM Priority fee for EVVM
   * @param nonce_EVVM Nonce for EVVM payment
   * @param priorityFlag_EVVM_EVVM Priority flag for EVVM payment
   * @param onSuccess Callback with paySignature and preRegistrationSignature
   * @param onError Callback for error
   */
  /**
   * Signs a NameService username registration message.
   * If priorityFee_EVVM > 0, also signs a payment message for the priority fee.
   * @param addressNameService NameService contract address
   * @param username Username to register
   * @param clowNumber Unique clown number
   * @param nonce Nonce for registration
   * @param priorityFee_EVVM Priority fee for EVVM
   * @param nonce_EVVM Nonce for EVVM payment
   * @param priorityFlag_EVVM_EVVM Priority flag for EVVM payment
   * @param onSuccess Callback with paySignature and registrationSignature
   * @param onError Callback for error
   */
  /**
   * Signs a NameService make offer message.
   * If priorityFee_EVVM > 0, also signs a payment message for the priority fee.
   * @param addressNameService NameService contract address
   * @param username Username to make offer for
   * @param expireDate Offer expiration date
   * @param amount Offer amount
   * @param nonce Nonce for offer
   * @param priorityFee_EVVM Priority fee for EVVM
   * @param nonce_EVVM Nonce for EVVM payment
   * @param priorityFlag_EVVM_EVVM Priority flag for EVVM payment
   * @param onSuccess Callback with paySignature and makeOfferSignature
   * @param onError Callback for error
   */
  /**
   * Signs a NameService withdraw offer message.
   * If priorityFee_EVVM > 0, also signs a payment message for the priority fee.
   * @param addressNameService NameService contract address
   * @param username Username to withdraw offer for
   * @param offerID Offer ID
   * @param nonce Nonce for withdrawal
   * @param priorityFee_EVVM Priority fee for EVVM
   * @param nonce_EVVM Nonce for EVVM payment
   * @param priorityFlag_EVVM_EVVM Priority flag for EVVM payment
   * @param onSuccess Callback with paySignature and withdrawOfferSignature
   * @param onError Callback for error
   */
  /**
   * Signs a NameService accept offer message.
   * If priorityFee_EVVM > 0, also signs a payment message for the priority fee.
   * @param addressNameService NameService contract address
   * @param username Username to accept offer for
   * @param offerID Offer ID
   * @param nonce Nonce for acceptance
   * @param priorityFee_EVVM Priority fee for EVVM
   * @param nonce_EVVM Nonce for EVVM payment
   * @param priorityFlag_EVVM_EVVM Priority flag for EVVM payment
   * @param onSuccess Callback with paySignature and acceptOfferSignature
   * @param onError Callback for error
   */
  /**
   * Signs a NameService renew username message.
   * If priorityFee_EVVM > 0, also signs a payment message for the priority fee.
   * @param addressNameService NameService contract address
   * @param username Username to renew
   * @param nonce Nonce for renewal
   * @param priorityFee_EVVM Priority fee for EVVM
   * @param nonce_EVVM Nonce for EVVM payment
   * @param priorityFlag_EVVM_EVVM Priority flag for EVVM payment
   * @param onSuccess Callback with paySignature and renewUsernameSignature
   * @param onError Callback for error
   */
  /**
   * Signs a NameService add custom metadata message.
   * If priorityFee_EVVM > 0, also signs a payment message for the priority fee.
   * @param addressNameService NameService contract address
   * @param identity Identity string
   * @param value Metadata value
   * @param nonce Nonce for addition
   * @param priorityFee_EVVM Priority fee for EVVM
   * @param nonce_EVVM Nonce for EVVM payment
   * @param priorityFlag_EVVM_EVVM Priority flag for EVVM payment
   * @param onSuccess Callback with paySignature and addCustomMetadataSignature
   * @param onError Callback for error
   */
  /**
   * Signs a NameService remove custom metadata message.
   * If priorityFee_EVVM > 0, also signs a payment message for the priority fee.
   * @param addressNameService NameService contract address
   * @param identity Identity string
   * @param key Metadata key
   * @param nonce Nonce for removal
   * @param priorityFee_EVVM Priority fee for EVVM
   * @param nonce_EVVM Nonce for EVVM payment
   * @param priorityFlag_EVVM_EVVM Priority flag for EVVM payment
   * @param onSuccess Callback with paySignature and removeCustomMetadataSignature
   * @param onError Callback for error
   */
  /**
   * Signs a NameService flush custom metadata message.
   * If priorityFee_EVVM > 0, also signs a payment message for the priority fee.
   * @param addressNameService NameService contract address
   * @param identity Identity string
   * @param nonce Nonce for flush
   * @param priorityFee_EVVM Priority fee for EVVM
   * @param nonce_EVVM Nonce for EVVM payment
   * @param priorityFlag_EVVM_EVVM Priority flag for EVVM payment
   * @param onSuccess Callback with paySignature and flushCustomMetadataSignature
   * @param onError Callback for error
   */
  /**
   * Signs a NameService flush username message.
   * If priorityFee_EVVM > 0, also signs a payment message for the priority fee.
   * @param addressNameService NameService contract address
   * @param username Username to flush
   * @param nonce Nonce for flush
   * @param priorityFee_EVVM Priority fee for EVVM
   * @param nonce_EVVM Nonce for EVVM payment
   * @param priorityFlag_EVVM_EVVM Priority flag for EVVM payment
   * @param onSuccess Callback with paySignature and flushUsernameSignature
   * @param onError Callback for error
   */
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
    formData: {
      evvmId: bigint,
      addressNameService: `0x${string}`,
      username: string,
      clowNumber: bigint,
      nonce: bigint,
      priorityFee_EVVM: bigint,
      nonce_EVVM: bigint,
      priorityFlag_EVVM_EVVM: boolean,
    },
    onSuccess?: (
      paySignature: string,
      preRegistrationSignature: string
    ) => void,
    onError?: (error: Error) => void
  ) => {
    // Hash username with clown number for pre-registration
    const hashUsername = hashPreRegisteredUsername(formData.username, formData.clowNumber);
    const preRegistrationMessage = buildMessageSignedForPreRegistrationUsername(
      formData.evvmId,
      hashUsername,
      formData.nonce
    );

    signMessage(
      { message: preRegistrationMessage },
      {
        onSuccess: (preRegistrationSignature) => {
          // If no priority fee, skip payment signature
          if (formData.priorityFee_EVVM === BigInt(0)) {
            onSuccess?.("", preRegistrationSignature);
            return;
          }

          // Payment signature for priority fee
          const payMessage = buildMessageSignedForPay(
            formData.evvmId,
            formData.addressNameService,
            "0x0000000000000000000000000000000000000001",
            BigInt(0),
            formData.priorityFee_EVVM,
            formData.nonce_EVVM,
            formData.priorityFlag_EVVM_EVVM,
            formData.addressNameService
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
    formData: {
      evvmId: bigint,
      addressNameService: `0x${string}`,
      username: string,
      clowNumber: bigint,
      nonce: bigint,
      mateReward: bigint,
      priorityFee_EVVM: bigint,
      nonce_EVVM: bigint,
      priorityFlag_EVVM: boolean,
    },
    onSuccess?: (paySignature: string, registrationSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const registrationMessage = buildMessageSignedForRegistrationUsername(
      formData.evvmId,
      formData.username,
      formData.clowNumber,
      formData.nonce
    );

    signMessage(
      { message: registrationMessage },
      {
        onSuccess: (registrationSignature) => {
          // Payment signature for priority fee
          const payMessage = buildMessageSignedForPay(
            formData.evvmId,
            formData.addressNameService,
            "0x0000000000000000000000000000000000000001",
            formData.mateReward * BigInt(100),
            formData.priorityFee_EVVM,
            formData.nonce_EVVM,
            formData.priorityFlag_EVVM,
            formData.addressNameService
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
