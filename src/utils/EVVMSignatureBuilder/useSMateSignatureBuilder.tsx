import { useSignMessage } from "wagmi";
import {
  buildMessageSignedForPay,
  buildMessageSignedForPresaleStaking,
  buildMessageSignedForPublicServiceStaking,
  buildMessageSignedForPublicStaking,
} from "./constructMessage";
import { keccak256, encodePacked, encodeAbiParameters, sha256 } from "viem";

export const useSMateSignatureBuilder = () => {
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
