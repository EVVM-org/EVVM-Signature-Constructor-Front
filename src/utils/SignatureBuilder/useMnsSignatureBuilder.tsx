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

export const useMnsSignatureBuilder = () => {
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

  // MNS username pre-registration signature (dual signature if priority fee > 0)
  const signPreRegistrationUsername = (
    addressMNS: string,
    nonceMNS: bigint,
    username: string,
    clowNumber: bigint,
    priorityFeeForFisher: bigint,
    nonceEVVM: bigint,
    priorityFlag: boolean,
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
      nonceMNS
    );

    signMessage(
      { message: preRegistrationMessage },
      {
        onSuccess: (preRegistrationSignature) => {
          // If no priority fee, skip payment signature
          if (priorityFeeForFisher === BigInt(0)) {
            onSuccess?.("", preRegistrationSignature);
            return;
          }

          // Payment signature for priority fee
          const payMessage = buildMessageSignedForPay(
            addressMNS,
            "0x0000000000000000000000000000000000000001",
            priorityFeeForFisher.toString(),
            "0",
            nonceEVVM.toString(),
            priorityFlag,
            addressMNS
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
    addressMNS: string,
    nonceMNS: bigint,
    username: string,
    clowNumber: bigint,
    mateReward: bigint,
    priorityFeeForFisher: bigint,
    nonceEVVM: bigint,
    priorityFlag: boolean,
    onSuccess?: (paySignature: string, registrationSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const registrationMessage = buildMessageSignedForRegistrationUsername(
      username,
      clowNumber,
      nonceMNS
    );

    signMessage(
      { message: registrationMessage },
      {
        onSuccess: (registrationSignature) => {
          // Payment signature for priority fee
          const payMessage = buildMessageSignedForPay(
            addressMNS,
            "0x0000000000000000000000000000000000000001",
            (mateReward * BigInt(100)).toString(),
            priorityFeeForFisher.toString(),
            nonceEVVM.toString(),
            priorityFlag,
            addressMNS
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
    addressMNS: string,
    nonceMNS: bigint,
    username: string,
    amount: bigint,
    expirationDate: bigint,
    priorityFeeForFisher: bigint,
    nonceEVVM: bigint,
    priorityFlag: boolean,
    onSuccess?: (paySignature: string, makeOfferSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const makeOfferMessage = buildMessageSignedForMakeOffer(
      username,
      expirationDate,
      amount,
      nonceMNS
    );

    signMessage(
      { message: makeOfferMessage },
      {
        onSuccess: (makeOfferSignature) => {
          // Payment signature for priority fee
          const payMessage = buildMessageSignedForPay(
            addressMNS,
            "0x0000000000000000000000000000000000000001",
            amount.toString(),
            priorityFeeForFisher.toString(),
            nonceEVVM.toString(),
            priorityFlag,
            addressMNS
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
    addressMNS: string,
    nonceMNS: bigint,
    username: string,
    offerId: bigint,
    priorityFeeForFisher: bigint,
    nonceEVVM: bigint,
    priorityFlag: boolean,
    onSuccess?: (paySignature: string, makeOfferSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const withdrawOfferMessage = buildMessageSignedForWithdrawOffer(
      username,
      offerId,
      nonceMNS
    );

    signMessage(
      { message: withdrawOfferMessage },
      {
        onSuccess: (makeOfferSignature) => {
          // Payment signature for priority fee
          if (priorityFeeForFisher === BigInt(0)) {
            onSuccess?.("", makeOfferSignature);
            return;
          }

          const payMessage = buildMessageSignedForPay(
            addressMNS,
            "0x0000000000000000000000000000000000000001",
            priorityFeeForFisher.toString(),
            "0",
            nonceEVVM.toString(),
            priorityFlag,
            addressMNS
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
    addressMNS: string,
    nonceMNS: bigint,
    username: string,
    offerId: bigint,
    priorityFeeForFisher: bigint,
    nonceEVVM: bigint,
    priorityFlag: boolean,
    onSuccess?: (paySignature: string, makeOfferSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const acceptOfferMessage = buildMessageSignedForAcceptOffer(
      username,
      offerId,
      nonceMNS
    );

    signMessage(
      { message: acceptOfferMessage },
      {
        onSuccess: (makeOfferSignature) => {
          // Payment signature for priority fee
          if (priorityFeeForFisher === BigInt(0)) {
            onSuccess?.("", makeOfferSignature);
            return;
          }

          const payMessage = buildMessageSignedForPay(
            addressMNS,
            "0x0000000000000000000000000000000000000001",
            priorityFeeForFisher.toString(),
            "0",
            nonceEVVM.toString(),
            priorityFlag,
            addressMNS
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
    addressMNS: string,
    nonceMNS: bigint,
    username: string,
    amountToRenew: bigint,
    priorityFeeForFisher: bigint,
    nonceEVVM: bigint,
    priorityFlag: boolean,
    onSuccess?: (paySignature: string, makeOfferSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const renewUsernameMessage = buildMessageSignedForRenewUsername(
      username,
      nonceMNS
    );

    signMessage(
      { message: renewUsernameMessage },
      {
        onSuccess: (makeOfferSignature) => {
          const payMessage = buildMessageSignedForPay(
            addressMNS,
            "0x0000000000000000000000000000000000000001",
            amountToRenew.toString(),
            priorityFeeForFisher.toString(),
            nonceEVVM.toString(),
            priorityFlag,
            addressMNS
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
    addressMNS: string,
    nonceMNS: bigint,
    identity: string,
    value: string,
    amountToAddCustomMetadata: bigint,
    priorityFeeForFisher: bigint,
    nonceEVVM: bigint,
    priorityFlag: boolean,
    onSuccess?: (paySignature: string, customMetadataSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const customMetadataMessage = buildMessageSignedForAddCustomMetadata(
      identity,
      value,
      nonceMNS
    );

    signMessage(
      { message: customMetadataMessage },
      {
        onSuccess: (makeOfferSignature) => {
          const payMessage = buildMessageSignedForPay(
            addressMNS,
            "0x0000000000000000000000000000000000000001",
            (amountToAddCustomMetadata).toString(),
            priorityFeeForFisher.toString(),
            nonceEVVM.toString(),
            priorityFlag,
            addressMNS
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
    addressMNS: string,
    nonceMNS: bigint,
    identity: string,
    key: bigint,
    amountOfMateReward: bigint,
    priorityFeeForFisher: bigint,
    nonceEVVM: bigint,
    priorityFlag: boolean,
    onSuccess?: (paySignature: string, removeMetadataSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const removeCustomMetadataMessage =
      buildMessageSignedForRemoveCustomMetadata(identity, key, nonceMNS);
    signMessage(
      { message: removeCustomMetadataMessage },
      {
        onSuccess: (makeOfferSignature) => {
          const payMessage = buildMessageSignedForPay(
            addressMNS,
            "0x0000000000000000000000000000000000000001",
            (BigInt(10) * amountOfMateReward).toString(),
            priorityFeeForFisher.toString(),
            nonceEVVM.toString(),
            priorityFlag,
            addressMNS
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
    addressMNS: string,
    nonceMNS: bigint,
    identity: string,
    priceToFlushCustomMetadata: bigint,
    priorityFeeForFisher: bigint,
    nonceEVVM: bigint,
    priorityFlag: boolean,
    onSuccess?: (paySignature: string, flushSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const flushCustomMetadataMessage = buildMessageSignedForFlushCustomMetadata(
      identity,
      nonceMNS
    );
    signMessage(
      { message: flushCustomMetadataMessage },
      {
        onSuccess: (flushSignature) => {
          const payMessage = buildMessageSignedForPay(
            addressMNS,
            "0x0000000000000000000000000000000000000001",
            priceToFlushCustomMetadata.toString(),
            priorityFeeForFisher.toString(),
            nonceEVVM.toString(),
            priorityFlag,
            addressMNS
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
    addressMNS: string,
    nonceMNS: bigint,
    username: string,
    priceToFlushUsername: bigint,
    priorityFeeForFisher: bigint,
    nonceEVVM: bigint,
    priorityFlag: boolean,
    onSuccess?: (paySignature: string, flushSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const flushCustomMetadataMessage = buildMessageSignedForFlushUsername(
      username,
      nonceMNS
    );
    signMessage(
      { message: flushCustomMetadataMessage },
      {
        onSuccess: (flushSignature) => {
          const payMessage = buildMessageSignedForPay(
            addressMNS,
            "0x0000000000000000000000000000000000000001",
            priceToFlushUsername.toString(),
            priorityFeeForFisher.toString(),
            nonceEVVM.toString(),
            priorityFlag,
            addressMNS
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
