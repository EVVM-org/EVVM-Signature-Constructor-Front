import React from "react";
import { getAccount } from "@wagmi/core";
import { useSignMessage, useAccount } from "wagmi";
import { buildMessageSignedForDispersePay } from "../utils/constructMessage";
import { hashDispersePaymentUsersToPay } from "../utils/hashData";
import { config } from "../config/index";

import mersenneTwister from "../utils/mersenneTwister";

type DispersePayMetadata = {
  amount: string;
  to_address: string;
  to_identity: string;
};

type DispersePayData = {
  from: `0x${string}`;
  toData: DispersePayMetadata[];
  token: string;
  amount: string;
  priorityFee: string;
  priority: boolean;
  nonce: string;
  executor: string;
  signature: string;
};

const copyButtonStyle = {
  color: "black",
  backgroundColor: "white",
  border: "none",
  cursor: "pointer",
  paddingLeft: "0.5rem",
};

export const DispersePaySignatureConstructor = () => {
  const [isUsingExecutorDisperse, setIsUsingExecutorDisperse] =
    React.useState(false);
  const [priorityDisperse, setPriorityDisperse] = React.useState("low");
  const [isUsingUsernameOnDisperse, setIsUsingUsernameOnDisperse] =
    React.useState<Array<boolean>>([true, true, true, true, true]);
  const [numberOfUsersToDisperse, setNumberOfUsersToDisperse] =
    React.useState(1);

  const [dispersePayMetadata, setDispersePayMetadata] =
    React.useState<DispersePayData | null>(null);

  const [showDataDisperse, setShowDataDisperse] = React.useState(false);

  const { signMessage } = useSignMessage();

  const makeDispersePayment = async () => {
    const account = getAccount(config);

    const TokenAddress = (
      document.getElementById("tokenAddressDispersePay") as HTMLInputElement
    ).value;

    const To: string[] = [];
    const IsUsingUsernames: boolean[] = [];
    const AmountToUser: string[] = [];

    for (let i = 0; i < numberOfUsersToDisperse; i++) {
      const isUsingUsername = isUsingUsernameOnDisperse[i];
      const toInputId = isUsingUsername
        ? `toUsernameSplitUserNumber${i}`
        : `toAddressSplitUserNumber${i}`;
      const amountInputId = `amountTokenToGiveUser${i}`;

      const to = (document.getElementById(toInputId) as HTMLInputElement).value;
      const amountToUser = (
        document.getElementById(amountInputId) as HTMLInputElement
      ).value;

      To.push(to);
      IsUsingUsernames.push(isUsingUsername);
      AmountToUser.push(amountToUser);
    }

    let toData = [];
    for (let i = 0; i < numberOfUsersToDisperse; i++) {
      if (IsUsingUsernames[i]) {
        toData.push([
          Number(AmountToUser[i]),
          "0x0000000000000000000000000000000000000000",
          To[i],
        ]);
      } else {
        toData.push([Number(AmountToUser[i]), To[i], ""]);
      }
    }

    const Executor = isUsingExecutorDisperse
      ? (document.getElementById("executorInputSplit") as HTMLInputElement)
          .value
      : "0x0000000000000000000000000000000000000000";

    const Ammount = (
      document.getElementById("amountTokenInputSplit") as HTMLInputElement
    ).value;

    const PriorityFee = (
      document.getElementById("priorityFeeInputSplit") as HTMLInputElement
    ).value;

    console.log("-----------------To data-----------------");
    console.log(toData);

    const hashedEncodedData = hashDispersePaymentUsersToPay(toData);

    console.log("----------Hashed encoded data----------");
    console.log(hashedEncodedData);

    const Nonce = (
      document.getElementById("nonceInputDispersePay") as HTMLInputElement
    ).value;
    signMessage(
      {
        message: buildMessageSignedForDispersePay(
          "0x" + hashedEncodedData.toUpperCase().slice(2),
          TokenAddress,
          Ammount,
          PriorityFee,
          Nonce,
          priorityDisperse === "high" ? true : false,
          Executor
        ),
      },
      {
        onSuccess: (data, variables, context) => {
          console.log("----------Message signed----------");
          console.log(data);
          console.log("----------Making disperse payment----------");

          //setting all toData to string
          const toDataFixed = toData.map((data) => {
            return {
              amount: data[0].toString(),
              to_address: data[1].toString(),
              to_identity: data[2].toString(),
            };
          });

          setDispersePayMetadata({
            from: account.address as `0x${string}`,
            toData: toDataFixed,
            token: TokenAddress,
            amount: Ammount,
            priorityFee: PriorityFee,
            priority: priorityDisperse === "high" ? true : false,
            nonce: Nonce,
            executor: Executor,
            signature: data,
          });
        },
      }
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <h1>Disperse pay</h1>
      <h3 style={{ textAlign: "center", color: "#3A9EE3" }}>
        <a href="https://www.evvm.org/docs/SignatureStructures/EVVM/DispersePaySignatureStructure">
          Learn more about disperse payment signatures structure here
        </a>
      </h3>
      <br />
      <div style={{ marginBottom: "1rem" }}>
        <p>
          {`Nonce: `}
          <button
            style={{
              color: "white",
              backgroundColor: "#50aad4",
              border: "none",
              cursor: "pointer",
              padding: "0.5rem",
              height: "2rem",
              // text all center
              textAlign: "center",
            }}
            onClick={async () => {
              const seed = Math.floor(Math.random() + Date.now());
              const mt = mersenneTwister(seed);
              const nonce = mt.int32();
              console.log(nonce);
              (
                document.getElementById(
                  "nonceInputDispersePay"
                ) as HTMLInputElement
              ).value = nonce.toString();
            }}
          >
            Generate random nonce
          </button>
          <input
            type="number"
            placeholder="Enter nonce"
            id="nonceInputDispersePay"
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "25rem",
            }}
          />
        </p>
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <p>Token address</p>
        <input
          type="text"
          placeholder="Enter token address"
          id="tokenAddressDispersePay"
          style={{
            color: "black",
            backgroundColor: "white",
            height: "2rem",
            width: "25rem",
          }}
          defaultValue="0x0000000000000000000000000000000000000000"
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <p>Amount</p>
        <input
          type="number"
          placeholder="Enter amount"
          id="amountTokenInputSplit"
          style={{
            color: "black",
            backgroundColor: "white",
            height: "2rem",
            width: "25rem",
          }}
        />
      </div>{" "}
      <div style={{ marginBottom: "1rem" }}>
        <p>Priority fee</p>
        <input
          type="number"
          placeholder="Enter priority fee"
          id="priorityFeeInputSplit"
          style={{
            color: "black",
            backgroundColor: "white",
            height: "2rem",
            width: "25rem",
          }}
        />
      </div>{" "}
      <div style={{ marginBottom: "1rem" }}>
        <p>Are you using an executor?</p>
        <select
          id="usingExecutorSplit"
          style={{
            color: "black",
            backgroundColor: "white",
            height: "2rem",
            width: "5rem",
          }}
          onChange={(a) => {
            setIsUsingExecutorDisperse(a.target.value === "true");
          }}
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
        {isUsingExecutorDisperse && (
          <input
            type="text"
            placeholder="Enter executor"
            id="executorInputSplit"
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "25rem",
            }}
          />
        )}
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <p>number of accounts to split the payment</p>
        <select
          id="splitNumber"
          style={{
            color: "black",
            backgroundColor: "white",
            height: "2rem",
            width: "5rem",
          }}
          onChange={(e) => {
            setNumberOfUsersToDisperse(Number(e.target.value));
          }}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      {Array.from({ length: numberOfUsersToDisperse }).map((_, index) => (
        <div key={index}>
          <h4
            style={{
              color: "black",
              marginTop: "1rem",
            }}
          >{`User ${index + 1}`}</h4>
          <p>{`To:`}</p>
          <select
            id={`usingUsernames${index}`}
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "5.5rem",
            }}
            onChange={(a) => {
              setIsUsingUsernameOnDisperse((prev) => {
                const newPrev = [...prev];
                newPrev[index] = a.target.value === "true";
                return newPrev;
              });
            }}
          >
            <option value="true">Username</option>
            <option value="false">Address</option>
          </select>
          {isUsingUsernameOnDisperse[index] && (
            <input
              type="text"
              placeholder="Enter username"
              id={`toUsernameSplitUserNumber${index}`}
              style={{
                color: "black",
                backgroundColor: "white",
                height: "2rem",
                width: "25rem",
              }}
            />
          )}
          {!isUsingUsernameOnDisperse[index] && (
            <input
              type="text"
              placeholder="Enter address"
              id={`toAddressSplitUserNumber${index}`}
              style={{
                color: "black",
                backgroundColor: "white",
                height: "2rem",
                width: "25rem",
              }}
            />
          )}
          <p>Amount</p>
          <input
            type="number"
            placeholder="Enter amount"
            id={`amountTokenToGiveUser${index}`}
            style={{
              color: "black",
              backgroundColor: "white",
              height: "2rem",
              width: "25rem",
            }}
          />
        </div>
      ))}
      <div style={{ marginTop: "1rem" }}>
        <p>Priority</p>
        <select
          id="prioritySplit"
          style={{
            color: "black",
            backgroundColor: "white",
            height: "2rem",
            width: "12rem",
          }}
          onChange={(a) => {
            setPriorityDisperse(a.target.value);
          }}
        >
          <option value="low">Low (synchronous nonce)</option>
          <option value="high">High (asynchronous nonce)</option>
        </select>
      </div>
      <button
        onClick={makeDispersePayment}
        style={{
          padding: "0.5rem",
          marginTop: "1rem",
        }}
      >
        Make signature
      </button>
      <br />
      <div>
        {dispersePayMetadata && (
          <>
            {showDataDisperse && (
              <div
                style={{
                  color: "black",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  backgroundColor: "#f0f0f0",
                  textAlign: "left",
                  padding: "1rem",
                }}
              >
                <p>
                  From: {dispersePayMetadata.from}
                  <button
                    style={{
                      color: "white",
                      backgroundColor: "#637988",
                      padding: "0.3rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(dispersePayMetadata.from);
                    }}
                  >
                    Copy
                  </button>
                </p>
                <p>
                  To:{" "}
                  {dispersePayMetadata.toData.map((data) => {
                    return (
                      <>
                        <p>
                          DispersePayMetadata #{" "}
                          {dispersePayMetadata.toData.indexOf(data)}
                        </p>
                        <p>
                          amount: {data.amount}
                          <button
                            style={{
                              color: "white",
                              backgroundColor: "#637988",
                              padding: "0.3rem",
                              border: "none",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              navigator.clipboard.writeText(data.amount);
                            }}
                          >
                            Copy
                          </button>
                        </p>
                        <p>
                          to_address: {data.to_address}
                          <button
                            style={{
                              color: "white",
                              backgroundColor: "#637988",
                              padding: "0.3rem",
                              border: "none",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              navigator.clipboard.writeText(data.to_address);
                            }}
                          >
                            Copy
                          </button>
                        </p>
                        <p>
                          to_identity: {data.to_identity}
                          <button
                            style={{
                              color: "white",
                              backgroundColor: "#637988",
                              padding: "0.3rem",
                              border: "none",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              navigator.clipboard.writeText(data.to_identity);
                            }}
                          >
                            Copy
                          </button>
                        </p>
                      </>
                    );
                  })}
                </p>
                <br />
                <p>
                  Token: {dispersePayMetadata.token}
                  <button
                    style={{
                      color: "white",
                      backgroundColor: "#637988",
                      padding: "0.3rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(dispersePayMetadata.token);
                    }}
                  >
                    Copy
                  </button>
                </p>
                <p>
                  Amount: {dispersePayMetadata.amount}
                  <button
                    style={{
                      color: "white",
                      backgroundColor: "#637988",
                      padding: "0.3rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(dispersePayMetadata.amount);
                    }}
                  >
                    Copy
                  </button>
                </p>
                <p>
                  Priority fee: {dispersePayMetadata.priorityFee}
                  <button
                    style={{
                      color: "white",
                      backgroundColor: "#637988",
                      padding: "0.3rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        dispersePayMetadata.priorityFee
                      );
                    }}
                  >
                    Copy
                  </button>
                </p>
                <p>
                  Priority: {dispersePayMetadata.priority ? "true" : "false"}
                  <button
                    style={{
                      color: "white",
                      backgroundColor: "#637988",
                      padding: "0.3rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        dispersePayMetadata.priority ? "true" : "false"
                      );
                    }}
                  >
                    Copy
                  </button>
                </p>
                <p>
                  Nonce: {dispersePayMetadata.nonce}
                  <button
                    style={{
                      color: "white",
                      backgroundColor: "#637988",
                      padding: "0.3rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(dispersePayMetadata.nonce);
                    }}
                  >
                    Copy
                  </button>
                </p>
                <p>
                  Executor: {dispersePayMetadata.executor}
                  <button
                    style={{
                      color: "white",
                      backgroundColor: "#637988",
                      padding: "0.3rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        dispersePayMetadata.executor
                      );
                    }}
                  >
                    Copy
                  </button>
                </p>
                <p>
                  Signature: {dispersePayMetadata.signature}
                  <button
                    style={{
                      color: "white",
                      backgroundColor: "#637988",
                      padding: "0.3rem",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        dispersePayMetadata.signature
                      );
                    }}
                  >
                    Copy
                  </button>
                </p>
              </div>
            )}
            <button
              style={{
                padding: "0.5rem",
                margin: "0.5rem",
                borderRadius: "5px",
              }}
              onClick={() => {
                setShowDataDisperse(!showDataDisperse);
              }}
            >
              {showDataDisperse ? "Hide data" : "Show data"}
            </button>

            <button
              style={{
                padding: "0.5rem",
                margin: "0.5rem",
                borderRadius: "5px",
              }}
              onClick={() => {
                const data = dispersePayMetadata;
                if (!data) {
                  return;
                }
                const dataToCopy = JSON.stringify(data);
                navigator.clipboard.writeText(dataToCopy);
              }}
            >
              Copy for JSON
            </button>

            <button
              style={{
                padding: "0.5rem",
                margin: "0.5rem",
                borderRadius: "5px",
              }}
              onClick={() => {
                const data = dispersePayMetadata;
                if (!data) {
                  return;
                }
                const dataToCopy = data.toData
                  .map((data) => {
                    return `dispersePayMetadata[${dispersePayMetadata.toData.indexOf(
                      data
                    )}] = EvvmMock.DispersePayMetadata({
                        amount: ${data.amount},
                        to_address: ${data.to_address},
                        to_identity: ${data.to_identity}
                    });`;
                  })
                  .join("\n");
                navigator.clipboard.writeText(dataToCopy);
              }}
            >
              Copy dispersePaymetadata for Solidity
            </button>

            <button
              style={{
                padding: "0.5rem",
                margin: "0.5rem",
                borderRadius: "5px",
              }}
              onClick={() => {
                const data = dispersePayMetadata;
                if (!data) {
                  return;
                }
                const dataToCopy = `dispersePay(
                  ${data.from},
                  dispersePayMetadata,
                  ${data.token},
                  ${data.amount},
                  ${data.priorityFee},
                  ${data.priority},
                  ${data.nonce},
                  ${data.executor},
                  ${data.signature}
                )`;
                navigator.clipboard.writeText(dataToCopy);
              }}
            >
              Copy dispersePay for Solidity
            </button>
            <button
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "0.5rem",
                margin: "0.5rem",
              }}
              onClick={() => {
                setDispersePayMetadata(null);
              }}
            >
              Clear
            </button>
          </>
        )}
      </div>
    </div>
  );
};
