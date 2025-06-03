import { useSignMessage } from "wagmi";
import {
  buildMessageSignedForDispersePay,
  buildMessageSignedForPay,
  buildMessageSignedForPresaleStaking,
  buildMessageSignedForPublicStaking,
} from "../utils/constructMessage";
import { keccak256, encodePacked, encodeAbiParameters, sha256 } from "viem";

type DispersePayMetadata = {
  amount: string;
  to_address: string;
  to_identity: string;
};

const abiDispersePayParameters = [
  {
    type: "tuple[]",
    components: [{ type: "uint256" }, { type: "address" }, { type: "string" }],
  },
];

export const wrapERC191sig = () => {
  const { signMessage, ...rest } = useSignMessage();

  const signERC191Message = (
    message: string,
    onSuccess?: (signature: string) => void,
    onError?: (error: Error) => void
  ) => {
    signMessage(
      { message },
      {
        onSuccess: (data) => {
          onSuccess?.(data);
        },
        onError: (error) => {
          onError?.(error);
        },
      }
    );
  };

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
        onSuccess: (data) => {
          onSuccess?.(data);
        },
        onError: (error) => {
          onError?.(error);
        },
      }
    );
  };

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
        onSuccess: (data) => {
          onSuccess?.(data);
        },
        onError: (error) => {
          onError?.(error);
        },
      }
    );
  };

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
          const stakingMessage = buildMessageSignedForPresaleStaking(
            isStaking,
            stakingAmount.toString(),
            nonceSMATE
          );

          signMessage(
            { message: stakingMessage },
            {
              onSuccess: (stakingSignature) => {
                onSuccess?.(paySignature, stakingSignature);
              },
              onError: (error) => {
                onError?.(error);
              },
            }
          );
        },
        onError: (error) => {
          onError?.(error);
        },
      }
    );
  };

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
          const stakingMessage = buildMessageSignedForPublicStaking(
            isStaking,
            stakingAmount.toString(),
            nonceSMATE
          );

          signMessage(
            { message: stakingMessage },
            {
              onSuccess: (stakingSignature) => {
                onSuccess?.(paySignature, stakingSignature);
              },
              onError: (error) => {
                onError?.(error);
              },
            }
          );
        },
        onError: (error) => {
          onError?.(error);
        },
      }
    );
  };

  function hashDispersePaymentUsersToPay(toData: DispersePayMetadata[]) {
    const formattedData = toData.map((item) => [
      BigInt(item.amount),
      item.to_address,
      item.to_identity,
    ]);
    return sha256(
      encodeAbiParameters(abiDispersePayParameters, [formattedData])
    );
  }

  return {
    signMessage,
    signERC191Message,
    signPay,
    signDispersePay,
    signPresaleStaking,
    signPublicStaking,
    ...rest,
  };
};
