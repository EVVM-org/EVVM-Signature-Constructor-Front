import React from "react";
import { getAccount } from "@wagmi/core";
import { useSignMessage } from "wagmi";
import { config } from "../config/index";
import mersenneTwister from "../utils/mersenneTwister";
import { buildMessageSignedForPay } from "../config/constructMessage";

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
      <div>
        <div>
          <p>
            {`To: `}
            <select
              id="usingUsernames"
              style={{ color: "black" }}
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
                style={{ color: "black" }}
              />
            )}
            {!isUsingUsernames && (
              <input
                type="text"
                placeholder="Enter address"
                id="toAddress"
                style={{ color: "black" }}
              />
            )}
          </p>
        </div>
        <br />
        <div>
          <p>
            {`Nonce: `}
            <button
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
              style={{ color: "black" }}
            />
          </p>
        </div>
        <br />
      </div>
      <div>
        <p>Token address</p>
        <input
          type="text"
          placeholder="Enter token address"
          id="tokenAddress"
          style={{ color: "black" }}
          value={selectedToken}
          onChange={(e) => {
            setSelectedToken(e.target.value);
          }}
        />
        <input
          type="number"
          placeholder="Enter amount"
          id="amountTokenInput"
          style={{ color: "black" }}
        />
        <input
          type="number"
          placeholder="Enter priority fee"
          id="priorityFeeInput"
          style={{ color: "black" }}
        />
        <p>Are you using an executor?</p>
        <select
          id="usingExecutor"
          style={{ color: "black" }}
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
            placeholder="Enter executor"
            id="executorInput"
            style={{ color: "black" }}
          />
        )}
      </div>
      <div>
        <p>Priority</p>
        <select
          id="priority"
          style={{ color: "black" }}
          onChange={(a) => {
            setPriority(a.target.value);
          }}
        >
          <option value="low">Low</option>
          <option value="high">High</option>
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
                }}
              >
                {`From: ${dataToGet.from} `}
                <button
                  style={{
                    color: "black",
                    backgroundColor: "white",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.5rem",
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(dataToGet.from);
                  }}
                ></button>
                <br />
                {`To address: ${dataToGet.to_address} `}
                <button
                  style={{
                    color: "black",
                    backgroundColor: "white",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.5rem",
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(dataToGet.to_address);
                  }}
                ></button>
                <br />

                {`To identity: ${dataToGet.to_identity} `}
                <button
                  style={{
                    color: "black",
                    backgroundColor: "white",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.5rem",
                  }}
                  onClick={() => {
                    navigator.clipboard.writeText(dataToGet.to_identity);
                  }}
                ></button>
                <br />
                {`Token: ${dataToGet.token} `}
                <button
                  style={copyButtonStyle}
                  onClick={() => {
                    navigator.clipboard.writeText(dataToGet.token);
                  }}
                ></button>
                <br />
                {`Amount: ${dataToGet.amount} `}
                <button
                  style={copyButtonStyle}
                  onClick={() => {
                    navigator.clipboard.writeText(dataToGet.amount);
                  }}
                ></button>
                <br />
                {`Priority fee: ${dataToGet.priorityFee} `}
                <button
                  style={copyButtonStyle}
                  onClick={() => {
                    navigator.clipboard.writeText(dataToGet.priorityFee);
                  }}
                ></button>
                <br />
                {`Nonce: ${dataToGet.nonce} `}
                <button
                  style={copyButtonStyle}
                  onClick={() => {
                    navigator.clipboard.writeText(dataToGet.nonce);
                  }}
                ></button>
                <br />
                {`Priority: ${dataToGet.priority} `}
                <button
                  style={copyButtonStyle}
                  onClick={() => {
                    navigator.clipboard.writeText(dataToGet.priority);
                  }}
                ></button>
                <br />
                {`Executor: ${dataToGet.executor} `}
                <button
                  style={copyButtonStyle}
                  onClick={() => {
                    navigator.clipboard.writeText(dataToGet.executor);
                  }}
                ></button>
                <br />
                {`Signature: ${dataToGet.signature} `}
                <button
                  style={copyButtonStyle}
                  onClick={() => {
                    navigator.clipboard.writeText(dataToGet.signature);
                  }}
                ></button>
              </div>
            )}
            <button
              style={{
                padding: "0.5rem",
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
                  color: "white",
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
