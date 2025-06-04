import { useSignMessage } from "wagmi";
import {
  buildMessageSignedForPay,
  buildMessageSignedForPreRegistrationUsername,
} from "./constructMessage";
import { keccak256, encodePacked, encodeAbiParameters, sha256 } from "viem";

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
    user: string,
    nonceMNS: bigint,
    username: string,
    clownNumber: bigint,
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
    const hashUsername = hashPreregisteredUsername(username, clownNumber);
    const preRegistrationMessage = buildMessageSignedForPreRegistrationUsername(
      user,
      nonceMNS.toString(),
      "0x" + hashUsername.toUpperCase().slice(2),
      priorityFeeForFisher.toString(),
      "",
      nonceEVVM.toString(),
      priorityFlag,
      ""
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

  // Helper function: Hash username with clown number for MNS pre-registration
  function hashPreregisteredUsername(username: string, clowNumber: bigint) {
    return keccak256(
      encodePacked(["string", "uint256"], [username, clowNumber])
    );
  }

  return {
    signMessage,
    signERC191Message,
    signPreRegistrationUsername,
    ...rest,
  };
};
