/**
 * useSignatureBuilder
 *
 * React hook for building and signing EVVM payment and disperse payment messages.
 * Provides functions for each EVVM action, using wagmi's useSignMessage for EIP-191 signatures.
 * Includes logic for single and multiple recipient payments.
 *
 * @returns Object with signature builder functions for EVVM actions.
 */
  /**
   * Signs a generic EIP-191 message.
   * @param message Message to sign
   * @param onSuccess Callback for successful signature
   * @param onError Callback for error
   */
  /**
   * Signs an EVVM payment message.
   * @param to Recipient address or username
   * @param tokenAddress Token contract address
   * @param amount Amount to pay
   * @param priorityFee Priority fee for transaction
   * @param nonce Nonce for transaction
   * @param priorityFlag Priority flag (async/sync)
   * @param executor Executor address
   * @param onSuccess Callback for successful signature
   * @param onError Callback for error
   */
  /**
   * Signs an EVVM disperse payment message for multiple recipients.
   * @param toData Array of DispersePayMetadata
   * @param tokenAddress Token contract address
   * @param amount Total amount to pay
   * @param priorityFee Priority fee for transaction
   * @param nonce Nonce for transaction
   * @param priorityFlag Priority flag (async/sync)
   * @param executor Executor address
   * @param onSuccess Callback for successful signature
   * @param onError Callback for error
   */
import { useSignMessage } from "wagmi";
import {
  buildMessageSignedForDispersePay,
  buildMessageSignedForPay,
} from "./constructMessage";
import { hashDispersePaymentUsersToPay } from "./hashTools";
import { DispersePayMetadata } from "../TypeInputStructures/evvmTypeInputStructure";


export const useSignatureBuilder = () => {
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

  return {
    signMessage,
    signERC191Message,
    signPay,
    signDispersePay,
    ...rest,
  };
};
