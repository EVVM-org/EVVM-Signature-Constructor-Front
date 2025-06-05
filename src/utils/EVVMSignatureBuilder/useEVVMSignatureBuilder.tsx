import { useSignMessage } from "wagmi";
import {
  buildMessageSignedForDispersePay,
  buildMessageSignedForPay,
} from "./constructMessage";
import { hashDispersePaymentUsersToPay } from "./hashTools";

// Type definition for disperse payment metadata
type DispersePayMetadata = {
  amount: string;
  to_address: string;
  to_identity: string;
};

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

  return {
    signMessage,
    signERC191Message,
    signPay,
    signDispersePay,
    ...rest,
  };
};
