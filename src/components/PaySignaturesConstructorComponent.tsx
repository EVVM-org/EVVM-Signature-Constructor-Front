import React from "react";
import { getAccount } from "@wagmi/core";
import { useSignMessage } from "wagmi";
import { config } from "../config/index";
import mersenneTwister from "../utils/mersenneTwister";
import { buildMessageSignedForPay } from "../utils/constructMessage";

type PayData = {
  from: `0x${string}`;
  to_address: `0x${string}`;
  to_identity: string;
  token: string;
  amount: string;
  priorityFee: string;
  nonce: string;
  priority: string;
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

export const PaySignaturesConstructorComponent = () => {
  const account = getAccount(config);

  const [selectedToken, setSelectedToken] = React.useState(
    "0x0000000000000000000000000000000000000000"
  );
  const [isUsingUsernames, setIsUsingUsernames] = React.useState(true);
  const [isUsingExecutor, setIsUsingExecutor] = React.useState(false);
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<PayData | null>(null);
  const [showData, setShowData] = React.useState(false);

  const { signMessage } = useSignMessage();

  const makePayment = async () => {
    const nonce = (document.getElementById("nonceInput") as HTMLInputElement)
      .value;

    const tokenAddress = (
      document.getElementById("tokenAddress") as HTMLInputElement
    ).value;

    const to = isUsingUsernames
      ? (document.getElementById("toUsername") as HTMLInputElement).value
      : (document.getElementById("toAddress") as HTMLInputElement).value;

    const executor = isUsingExecutor
      ? (document.getElementById("executorInput") as HTMLInputElement).value
      : "0x0000000000000000000000000000000000000000";

    const ammountConverted = (
      document.getElementById("amountTokenInput") as HTMLInputElement
    ).value;

    const priorityFeeConverted = (
      document.getElementById("priorityFeeInput") as HTMLInputElement
    ).value;

    signMessage(
      {
        message: buildMessageSignedForPay(
          to,
          tokenAddress,
          ammountConverted,
          priorityFeeConverted,
          nonce!.toString(),
          priority === "high",
          executor
        ),
      },
      {
        onSuccess: async (data, variables, context) => {
          console.log("----------Message signed----------");
          console.log(data);
          setDataToGet({
            from: account.address as `0x${string}`,
            to_address: (to.startsWith("0x")
              ? to
              : "0x0000000000000000000000000000000000000000") as `0x${string}`,
            to_identity: to.startsWith("0x") ? "" : to,
            token: tokenAddress,
            amount: ammountConverted,
            priorityFee: priorityFeeConverted.toString(),
            nonce: nonce.toString(),
            priority: priority === "high" ? "true" : "false",
            executor: executor,
            signature: data,
          });
        },
      }
    );
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <h1>Single pay</h1>
      <h3 style={{ textAlign: "center", color: "#3A9EE3" }}>
        <a href="https://www.evvm.org/docs/SignatureStructures/EVVM/SinglePaymentSignatureStructure">
          Learn more about single payment signatures structure here
        </a>
      </h3>
      <br />
      <div>
        <div style={{ marginBottom: "1rem" }}>
          <p>
            {`To: `}
            <select
              id="usingUsernames"
              style={{
                color: "black",
                backgroundColor: "white",
                height: "2rem",
                width: "6rem",
              }}
              onChange={(a) => {
                setIsUsingUsernames(a.target.value === "true");
              }}
            >
              <option value="true">Username</option>
              <option value="false">Address</option>
            </select>
            {isUsingUsernames && (
              <input
                type="text"
                placeholder="Enter username"
                id="toUsername"
                style={{
                  color: "black",
                  backgroundColor: "white",
                  height: "2rem",
                  width: "25rem",
                }}
              />
            )}
            {!isUsingUsernames && (
              <input
                type="text"
                placeholder="Enter address"
                id="toAddress"
                style={{
                  color: "black",
                  backgroundColor: "white",
                  height: "2rem",
                  width: "25rem",
                }}
              />
            )}
          </p>
        </div>
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
                  document.getElementById("nonceInput") as HTMLInputElement
                ).value = nonce.toString();
              }}
            >
              Generate random nonce
            </button>
            <input
              type="number"
              placeholder="Enter nonce"
              id="nonceInput"
              style={{
                color: "black",
                backgroundColor: "white",
                height: "2rem",
                width: "25rem",
              }}
            />
          </p>
        </div>
        <br />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <p>Token address</p>
        <input
          type="text"
          placeholder="Enter token address"
          id="tokenAddress"
          style={{
            color: "black",
            backgroundColor: "white",
            height: "2rem",
            width: "25rem",
          }}
          value={selectedToken}
          onChange={(e) => {
            setSelectedToken(e.target.value);
          }}
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <p>Amount</p>
        <input
          type="number"
          placeholder="Enter amount"
          id="amountTokenInput"
          style={{
            color: "black",
            backgroundColor: "white",
            height: "2rem",
            width: "25rem",
          }}
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <p>Priority fee</p>
        <input
          type="number"
          placeholder="Enter priority fee"
          id="priorityFeeInput"
          style={{
            color: "black",
            backgroundColor: "white",
            height: "2rem",
            width: "25rem",
          }}
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <p>Are you using an executor?</p>
        <select
          id="usingExecutor"
          style={{
            color: "black",
            backgroundColor: "white",
            height: "2rem",
            width: "5rem",
          }}
          onChange={(a) => {
            setIsUsingExecutor(a.target.value === "true");
          }}
        >
          <option value="false">No</option>
          <option value="true">Yes</option>
        </select>
        {isUsingExecutor && (
          <input
            type="text"
            placeholder="Enter executor address"
            id="executorInput"
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
        <p>Priority</p>
        <select
          id="priority"
          style={{
            color: "black",
            backgroundColor: "white",
            height: "2rem",
            width: "12rem",
          }}
          onChange={(a) => {
            setPriority(a.target.value);
          }}
        >
          <option value="low">Low (synchronous nonce)</option>
          <option value="high">High (asynchronous nonce)</option>
        </select>
      </div>
      <button
        onClick={makePayment}
        style={{
          padding: "0.5rem",
          marginTop: "1rem",
        }}
      >
        Make signature
      </button>
      <br />
      <div>
        {dataToGet && (
          <div>
            <h2>ready</h2>

            {showData && (
              <div
                style={{
                  color: "black",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  backgroundColor: "#f0f0f0",
                  //enviar texto a la derecha
                  textAlign: "left",
                  padding: "1rem",
                }}
              >
                {`From: ${dataToGet.from} `}
                <button
                  style={{
                    color: "white",
                    backgroundColor: "#637988",
                    padding: "0.3rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(dataToGet.from);
                  }}
                >
                  Copy
                </button>
                <br />
                {`To address: ${dataToGet.to_address} `}
                <button
                  style={{
                    color: "white",
                    backgroundColor: "#637988",
                    padding: "0.3rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(dataToGet.to_address);
                  }}
                >
                  Copy
                </button>
                <br />

                {`To identity: ${dataToGet.to_identity} `}
                <button
                  style={{
                    color: "white",
                    backgroundColor: "#637988",
                    padding: "0.3rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(dataToGet.to_identity);
                  }}
                >
                  Copy
                </button>
                <br />
                {`Token: ${dataToGet.token} `}
                <button
                  style={{
                    color: "white",
                    backgroundColor: "#637988",
                    padding: "0.3rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(dataToGet.token);
                  }}
                >
                  Copy
                </button>
                <br />
                {`Amount: ${dataToGet.amount} `}
                <button
                  style={{
                    color: "white",
                    backgroundColor: "#637988",
                    padding: "0.3rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(dataToGet.amount);
                  }}
                >
                  Copy
                </button>
                <br />
                {`Priority fee: ${dataToGet.priorityFee} `}
                <button
                  style={{
                    color: "white",
                    backgroundColor: "#637988",
                    padding: "0.3rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(dataToGet.priorityFee);
                  }}
                >
                  Copy
                </button>
                <br />
                {`Nonce: ${dataToGet.nonce} `}
                <button
                  style={{
                    color: "white",
                    backgroundColor: "#637988",
                    padding: "0.3rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(dataToGet.nonce);
                  }}
                >
                  Copy
                </button>
                <br />
                {`Priority: ${dataToGet.priority} `}
                <button
                  style={{
                    color: "white",
                    backgroundColor: "#637988",
                    padding: "0.3rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(dataToGet.priority);
                  }}
                >
                  Copy
                </button>
                <br />
                {`Executor: ${dataToGet.executor} `}
                <button
                  style={{
                    color: "white",
                    backgroundColor: "#637988",
                    padding: "0.3rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(dataToGet.executor);
                  }}
                >
                  Copy
                </button>
                <br />
                {`Signature: ${dataToGet.signature} `}
                <button
                  style={{
                    color: "white",
                    backgroundColor: "#637988",
                    padding: "0.3rem",
                    border: "none",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(dataToGet.signature);
                  }}
                >
                  Copy
                </button>
              </div>
            )}
            <button
              style={{
                margin: "0.5rem",
                borderRadius: "5px",
              }}
              onClick={() => {
                setShowData(!showData);
              }}
            >
              {showData ? "Hide data" : "Show data"}
            </button>
            <div>
              <button
                style={{
                  padding: "0.5rem",
                  margin: "0.5rem",
                  borderRadius: "5px",
                }}
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(dataToGet, null, 2)
                  );
                }}
              >
                Copy for json
              </button>

              <button
                style={{
                  padding: "0.5rem",
                  margin: "0.5rem",
                }}
                onClick={() => {
                  //signature se le resta 0x y se agrega hex
                  navigator.clipboard.writeText(
                    `PayData({from: ${dataToGet.from}, to_address: ${
                      dataToGet.to_address
                    }, to_identity: "${dataToGet.to_identity}", token: ${
                      dataToGet.token
                    }, amount: ${dataToGet.amount}, priorityFee: ${
                      dataToGet.priorityFee
                    }, nonce: ${dataToGet.nonce}, priority: ${
                      dataToGet.priority
                    }, executor: ${
                      dataToGet.executor
                    }, signature: hex"${dataToGet.signature.slice(2)}"});`
                  );
                }}
              >
                Copy for solidity
              </button>
              <button
                style={{
                  backgroundColor: "red",
                  color: "white",
                  padding: "0.5rem",
                  margin: "0.5rem",
                }}
                onClick={() => {
                  setDataToGet(null);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
