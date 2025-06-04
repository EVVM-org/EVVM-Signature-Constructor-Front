import { useSignMessage } from "wagmi";
import {
  buildMessageSignedForDispersePay,
  buildMessageSignedForPay,
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



  // Helper function: Hash disperse payment data for multiple recipients
  function hashDispersePaymentUsersToPay(toData: DispersePayMetadata[]) {
    const formattedData = toData.map((item) => [
      BigInt(item.amount),
      item.to_address,
      item.to_identity,
    ]);
    return sha256(encodeAbiParameters(abiDispersePayParameters, [formattedData]));
  }



  return {
    signMessage,
    signERC191Message,
    signPay,
    signDispersePay,
    ...rest,
  };
};
