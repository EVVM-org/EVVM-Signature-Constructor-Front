import { useSignMessage } from "wagmi";
import {
  buildMessageSignedForPay,
  buildMessageSignedForPresaleStaking,
  buildMessageSignedForPublicServiceStake,
  buildMessageSignedForPublicStaking,
} from "./constructMessage";
import { keccak256, encodePacked, encodeAbiParameters, sha256 } from "viem";

export const useStakingSignatureBuilder = () => {
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

  // staking golden staking signature (5083 EVVM per stake)
  const signGoldenStaking = (
    evvmID: bigint,
    stakingAddress: `0x${string}`,
    totalPrice: bigint,
    nonceEVVM: bigint,
    priorityFlag: boolean,
    onSuccess?: (signature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const message = buildMessageSignedForPay(
      evvmID,
      stakingAddress,
      "0x0000000000000000000000000000000000000001", // Native token address
      totalPrice,
      BigInt(0),
      nonceEVVM,
      priorityFlag,
      stakingAddress
    );

    signMessage(
      { message },
      {
        onSuccess: (data) => onSuccess?.(data),
        onError: (error) => onError?.(error),
      }
    );
  };

  // staking presale staking signature (dual signature: payment + staking)
  const signPresaleStaking = (
    evvmID: bigint,
    stakingAddress: `0x${string}`,
    isStaking: boolean,
    nonce: bigint,
    priorityFee_EVVM: bigint,
    totalPrice: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean,
    onSuccess?: (paySignature: string, stakingSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    // First signature: payment
    const payMessage = buildMessageSignedForPay(
      evvmID,
      stakingAddress,
      "0x0000000000000000000000000000000000000001",
      isStaking
        ? totalPrice
        : BigInt(0),
      priorityFee_EVVM,
      nonce_EVVM,
      priorityFlag_EVVM,
      stakingAddress
    );

    signMessage(
      { message: payMessage },
      {
        onSuccess: (paySignature) => {
          // Second signature: staking
          const stakingMessage = buildMessageSignedForPresaleStaking(
            evvmID,
            isStaking,
            BigInt(1),
            nonce
          );

          signMessage(
            { message: stakingMessage },
            {
              onSuccess: (stakingSignature) =>
                onSuccess?.(paySignature, stakingSignature),
              onError: (error) => onError?.(error),
            }
          );
        },
        onError: (error) => onError?.(error),
      }
    );
  };

  // staking public staking signature (dual signature: payment + staking)
  const signPublicStaking = (
    evvmID: bigint,
    stakingAddress: `0x${string}`,
    isStaking: boolean,
    stakingAmount: bigint,
    nonceStaking: bigint,
    totalPrice: bigint,
    priorityFee: bigint,
    nonceEVVM: bigint,
    priorityFlag: boolean,
    onSuccess?: (paySignature: string, stakingSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    // First signature: payment
    const payMessage = buildMessageSignedForPay(
      evvmID,
      stakingAddress,
      "0x0000000000000000000000000000000000000001",
      isStaking
        ? totalPrice
        : BigInt(0),
      priorityFee,
      nonceEVVM,
      priorityFlag,
      stakingAddress
    );

    signMessage(
      { message: payMessage },
      {
        onSuccess: (paySignature) => {
          // Second signature: staking
          const stakingMessage = buildMessageSignedForPublicStaking(
            evvmID,
            isStaking,
            stakingAmount,
            nonceStaking
          );

          signMessage(
            { message: stakingMessage },
            {
              onSuccess: (stakingSignature) =>
                onSuccess?.(paySignature, stakingSignature),
              onError: (error) => onError?.(error),
            }
          );
        },
        onError: (error) => onError?.(error),
      }
    );
  };

  // staking public service staking signature (dual signature: payment + staking for specific service)
  const signPublicServiceStaking = (
    evvmID: bigint,
    stakingAddress: `0x${string}`,
    serviceAddress: string,
    isStaking: boolean,
    stakingAmount: bigint,
    nonce: bigint,
    priorityFee_EVVM: bigint,
    nonce_EVVM: bigint,
    priorityFlag_EVVM: boolean,
    onSuccess?: (paySignature: string, stakingSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    // First signature: payment
    const payMessage = buildMessageSignedForPay(
      evvmID,
      stakingAddress,
      "0x0000000000000000000000000000000000000001" as `0x${string}`,
      isStaking
        ? stakingAmount * BigInt(5083 * 10 ** 18)
        : BigInt(0),
      priorityFee_EVVM,
      nonce_EVVM,
      priorityFlag_EVVM,
      stakingAddress
    );

    signMessage(
      { message: payMessage },
      {
        onSuccess: (paySignature) => {
          // Second signature: service staking
          const stakingMessage = buildMessageSignedForPublicServiceStake(
            evvmID,
            serviceAddress,
            isStaking,
            stakingAmount,
            nonce
          );

          signMessage(
            { message: stakingMessage },
            {
              onSuccess: (stakingSignature) =>
                onSuccess?.(paySignature, stakingSignature),
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
    signGoldenStaking,
    signPresaleStaking,
    signPublicStaking,
    signPublicServiceStaking,
    ...rest,
  };
};
