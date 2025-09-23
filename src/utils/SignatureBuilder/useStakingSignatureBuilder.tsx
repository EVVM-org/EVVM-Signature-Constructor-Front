/**
 * useStakingSignatureBuilder
 *
 * React hook for building and signing Staking messages (golden, presale, public, service).
 * Provides functions for each staking action, using wagmi's useSignMessage for EIP-191 signatures.
 * Includes logic for single and dual signature staking flows.
 *
 * @returns Object with signature builder functions for staking actions.
 */
  /**
   * Signs a generic EIP-191 message.
   * @param message Message to sign
   * @param onSuccess Callback for successful signature
   * @param onError Callback for error
   */
  /**
   * Signs a golden staking message (single signature, 5083 EVVM per stake).
   * @param stakingAddress Staking contract address
   * @param stakingAmount Amount to stake
   * @param nonceEVVM Nonce for staking
   * @param priorityFlag Priority flag (async/sync)
   * @param onSuccess Callback for successful signature
   * @param onError Callback for error
   */
  /**
   * Signs a presale staking message (dual signature: payment + staking).
   * @param stakingAddress Staking contract address
   * @param isStaking Boolean flag for staking
   * @param nonce Nonce for staking
   * @param priorityFee_EVVM Priority fee for EVVM
   * @param nonce_EVVM Nonce for EVVM payment
   * @param priorityFlag_EVVM Priority flag for EVVM payment
   * @param onSuccess Callback with paySignature and stakingSignature
   * @param onError Callback for error
   */
  /**
   * Signs a public staking message (dual signature: payment + staking).
   * @param stakingAddress Staking contract address
   * @param isStaking Boolean flag for staking
   * @param amount Amount to stake
   * @param nonce Nonce for staking
   * @param priorityFee_EVVM Priority fee for EVVM
   * @param nonce_EVVM Nonce for EVVM payment
   * @param priorityFlag_EVVM Priority flag for EVVM payment
   * @param onSuccess Callback with paySignature and stakingSignature
   * @param onError Callback for error
   */
  /**
   * Signs a public service staking message (dual signature: payment + staking).
   * @param stakingAddress Staking contract address
   * @param service Service address
   * @param isStaking Boolean flag for staking
   * @param amount Amount to stake
   * @param nonce Nonce for staking
   * @param priorityFee_EVVM Priority fee for EVVM
   * @param nonce_EVVM Nonce for EVVM payment
   * @param priorityFlag_EVVM Priority flag for EVVM payment
   * @param onSuccess Callback with paySignature and stakingSignature
   * @param onError Callback for error
   */
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
