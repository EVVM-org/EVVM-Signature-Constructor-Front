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
    evvmID: bigint,
    to: string,
    tokenAddress: `0x${string}`,
    amount: bigint,
    priorityFee: bigint,
    nonce: bigint,
    priorityFlag: boolean,
    executor: `0x${string}`,
    onSuccess?: (signature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const message = buildMessageSignedForPay(
      evvmID,
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
    evvmID: bigint,
    toData: DispersePayMetadata[],
    tokenAddress: `0x${string}`,
    amount: bigint,
    priorityFee: bigint,
    nonce: bigint,
    priorityFlag: boolean,
    executor: `0x${string}`,
    onSuccess?: (signature: string) => void,
    onError?: (error: Error) => void
  ) => {
    const hashedEncodedData = hashDispersePaymentUsersToPay(toData);
    const message = buildMessageSignedForDispersePay(
      evvmID,
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
