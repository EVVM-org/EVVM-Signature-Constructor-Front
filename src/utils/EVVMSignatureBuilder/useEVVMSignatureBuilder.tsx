import { useSignMessage } from "wagmi";
import {
  buildMessageSignedForDispersePay,
  buildMessageSignedForPay,
  buildMessageSignedForPresaleStaking,
  buildMessageSignedForPublicServiceStaking,
  buildMessageSignedForPublicStaking,
  buildMessageSignedForPreRegistrationUsername,
} from "./constructMessage";
import { keccak256, encodePacked, encodeAbiParameters, sha256 } from "viem";

// Type definition for disperse payment metadata
type DispersePayMetadata = {
  amount: string;
  to_address: string;
  to_identity: string;
};

// ABI parameters for encoding disperse payment data
const abiDispersePayParameters = [
  {
    type: "tuple[]",
    components: [{ type: "uint256" }, { type: "address" }, { type: "string" }],
  },
];

export const useEVVMSignatureBuilder = () => {
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

  // EVVM payment signature
  const signPay = (
    to: string,
    tokenAddress: string,
    amount: string,
    priorityFee: string,
    nonce: string,
    priorityFlag: boolean,
    executor: string,
    onSuccess?: (signature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const message = buildMessageSignedForPay(
      to,
      tokenAddress,
      amount,
      priorityFee,
      nonce,
      priorityFlag,
      executor
    );

    signMessage(
      { message },
      {
        onSuccess: (data) => onSuccess?.(data),
        onError: (error) => onError?.(error),
      }
    );
  };

  // EVVM disperse payment signature (multiple recipients)
  const signDispersePay = (
    toData: DispersePayMetadata[],
    tokenAddress: string,
    amount: string,
    priorityFee: string,
    nonce: string,
    priorityFlag: boolean,
    executor: string,
    onSuccess?: (signature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const hashedEncodedData = hashDispersePaymentUsersToPay(toData);
    const message = buildMessageSignedForDispersePay(
      "0x" + hashedEncodedData.toUpperCase().slice(2),
      tokenAddress,
      amount,
      priorityFee,
      nonce,
      priorityFlag,
      executor
    );

    signMessage(
      { message },
      {
        onSuccess: (data) => onSuccess?.(data),
        onError: (error) => onError?.(error),
      }
    );
  };

  // sMate golden staking signature (5083 EVVM per stake)
  const signGoldenStaking = (
    sMateAddress: string,
    stakingAmount: number,
    nonceEVVM: string,
    priorityFlag: boolean,
    onSuccess?: (signature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const message = buildMessageSignedForPay(
      sMateAddress,
      "0x0000000000000000000000000000000000000001", // Native token address
      (stakingAmount * (5083 * 10 ** 18)).toLocaleString("fullwide", {
        useGrouping: false,
      }),
      "0",
      nonceEVVM,
      priorityFlag,
      sMateAddress
    );

    signMessage(
      { message },
      {
        onSuccess: (data) => onSuccess?.(data),
        onError: (error) => onError?.(error),
      }
    );
  };

  // sMate presale staking signature (dual signature: payment + staking)
  const signPresaleStaking = (
    sMateAddress: string,
    stakingAmount: number,
    priorityFee: string,
    nonceEVVM: string,
    priorityFlag: boolean,
    isStaking: boolean,
    nonceSMATE: string,
    onSuccess?: (paySignature: string, stakingSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    // First signature: payment
    const payMessage = buildMessageSignedForPay(
      sMateAddress,
      "0x0000000000000000000000000000000000000001",
      isStaking
        ? (stakingAmount * (5083 * 10 ** 18)).toLocaleString("fullwide", {
            useGrouping: false,
          })
        : "0",
      priorityFee,
      nonceEVVM,
      priorityFlag,
      sMateAddress
    );

    signMessage(
      { message: payMessage },
      {
        onSuccess: (paySignature) => {
          // Second signature: staking
          const stakingMessage = buildMessageSignedForPresaleStaking(
            isStaking,
            stakingAmount.toString(),
            nonceSMATE
          );

          signMessage(
            { message: stakingMessage },
            {
              onSuccess: (stakingSignature) => onSuccess?.(paySignature, stakingSignature),
              onError: (error) => onError?.(error),
            }
          );
        },
        onError: (error) => onError?.(error),
      }
    );
  };

  // sMate public staking signature (dual signature: payment + staking)
  const signPublicStaking = (
    sMateAddress: string,
    stakingAmount: number,
    priorityFee: string,
    nonceEVVM: string,
    priorityFlag: boolean,
    isStaking: boolean,
    nonceSMATE: string,
    onSuccess?: (paySignature: string, stakingSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    // First signature: payment
    const payMessage = buildMessageSignedForPay(
      sMateAddress,
      "0x0000000000000000000000000000000000000001",
      isStaking
        ? (stakingAmount * (5083 * 10 ** 18)).toLocaleString("fullwide", {
            useGrouping: false,
          })
        : "0",
      priorityFee,
      nonceEVVM,
      priorityFlag,
      sMateAddress
    );

    signMessage(
      { message: payMessage },
      {
        onSuccess: (paySignature) => {
          // Second signature: staking
          const stakingMessage = buildMessageSignedForPublicStaking(
            isStaking,
            stakingAmount.toString(),
            nonceSMATE
          );

          signMessage(
            { message: stakingMessage },
            {
              onSuccess: (stakingSignature) => onSuccess?.(paySignature, stakingSignature),
              onError: (error) => onError?.(error),
            }
          );
        },
        onError: (error) => onError?.(error),
      }
    );
  };

  // sMate public service staking signature (dual signature: payment + staking for specific service)
  const signPublicServiceStaking = (
    sMateAddress: string,
    serviceAddress: string,
    stakingAmount: number,
    priorityFee: string,
    nonceEVVM: string,
    priorityFlag: boolean,
    isStaking: boolean,
    nonceSMATE: string,
    onSuccess?: (paySignature: string, stakingSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    // First signature: payment
    const payMessage = buildMessageSignedForPay(
      sMateAddress,
      "0x0000000000000000000000000000000000000001",
      isStaking
        ? (stakingAmount * (5083 * 10 ** 18)).toLocaleString("fullwide", {
            useGrouping: false,
          })
        : "0",
      priorityFee,
      nonceEVVM,
      priorityFlag,
      sMateAddress
    );

    signMessage(
      { message: payMessage },
      {
        onSuccess: (paySignature) => {
          // Second signature: service staking
          const stakingMessage = buildMessageSignedForPublicServiceStaking(
            serviceAddress,
            isStaking,
            stakingAmount.toString(),
            nonceSMATE
          );

          signMessage(
            { message: stakingMessage },
            {
              onSuccess: (stakingSignature) => onSuccess?.(paySignature, stakingSignature),
              onError: (error) => onError?.(error),
            }
          );
        },
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
    onSuccess?: (paySignature: string, preRegistrationSignature: string) => void,
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
              onSuccess: (paySignature) => onSuccess?.(paySignature, preRegistrationSignature),
              onError: (error) => onError?.(error),
            }
          );
        },
        onError: (error) => onError?.(error),
      }
    );
  };

  // Helper function: Hash disperse payment data for multiple recipients
  function hashDispersePaymentUsersToPay(toData: DispersePayMetadata[]) {
    const formattedData = toData.map((item) => [
      BigInt(item.amount),
      item.to_address,
      item.to_identity,
    ]);
    return sha256(encodeAbiParameters(abiDispersePayParameters, [formattedData]));
  }

  // Helper function: Hash username with clown number for MNS pre-registration
  function hashPreregisteredUsername(username: string, clowNumber: bigint) {
    return keccak256(encodePacked(["string", "uint256"], [username, clowNumber]));
  }

  return {
    signMessage,
    signERC191Message,
    signPay,
    signDispersePay,
    signGoldenStaking,
    signPresaleStaking,
    signPublicStaking,
    signPublicServiceStaking,
    signPreRegistrationUsername,
    ...rest,
  };
};
