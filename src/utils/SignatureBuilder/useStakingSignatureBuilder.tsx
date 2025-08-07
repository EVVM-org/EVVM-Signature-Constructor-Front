import { useSignMessage } from "wagmi";
import {
  buildMessageSignedForPay,
  buildMessageSignedForPresaleStaking,
  buildMessageSignedForPublicServiceStaking,
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
    stakingAddress: string,
    stakingAmount: number,
    nonceEVVM: string,
    priorityFlag: boolean,
    onSuccess?: (signature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const message = buildMessageSignedForPay(
      stakingAddress,
      "0x0000000000000000000000000000000000000001", // Native token address
      (stakingAmount * (5083 * 10 ** 18)).toLocaleString("fullwide", {
        useGrouping: false,
      }),
      "0",
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
    stakingAddress: string,

    isStaking: boolean,
    nonce: string,
    
    priorityFee_EVVM: string,
    nonce_EVVM: string,
    priorityFlag_EVVM: boolean,
    
    
    onSuccess?: (paySignature: string, stakingSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    // First signature: payment
    const payMessage = buildMessageSignedForPay(
      stakingAddress,
      "0x0000000000000000000000000000000000000001",
      isStaking
        ? (1 * (5083 * 10 ** 18)).toLocaleString("fullwide", {
            useGrouping: false,
          })
        : "0",
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
            isStaking,
            "1",
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
    stakingAddress: string,
    isStaking: boolean,
    stakingAmount: number,
    nonceSMATE: string,
    priorityFee: string,
    nonceEVVM: string,
    priorityFlag: boolean,
    onSuccess?: (paySignature: string, stakingSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    // First signature: payment
    const payMessage = buildMessageSignedForPay(
      stakingAddress,
      "0x0000000000000000000000000000000000000001",
      isStaking
        ? (stakingAmount * (5083 * 10 ** 18)).toLocaleString("fullwide", {
            useGrouping: false,
          })
        : "0",
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
            isStaking,
            stakingAmount.toString(),
            nonceSMATE
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
    stakingAddress: string,
    serviceAddress: string,
    isStaking: boolean,
    stakingAmount: number,
    nonce: string,
    priorityFee_EVVM: string,
    nonce_EVVM: string,
    priorityFlag_EVVM: boolean,
    onSuccess?: (paySignature: string, stakingSignature: string) => void,
    onError?: (error: Error) => void
  ) => {
    // First signature: payment
    const payMessage = buildMessageSignedForPay(
      stakingAddress,
      "0x0000000000000000000000000000000000000001",
      isStaking
        ? (stakingAmount * (5083 * 10 ** 18)).toLocaleString("fullwide", {
            useGrouping: false,
          })
        : "0",
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
          const stakingMessage = buildMessageSignedForPublicServiceStaking(
            serviceAddress,
            isStaking,
            stakingAmount.toString(),
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
