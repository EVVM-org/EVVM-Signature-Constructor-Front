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

// Helper function: Hash disperse payment data for multiple recipients
function hashDispersePaymentUsersToPay(toData: DispersePayMetadata[]) {
  const formattedData = toData.map((item) => [
    BigInt(item.amount),
    item.to_address,
    item.to_identity,
  ]);
  return sha256(encodeAbiParameters(abiDispersePayParameters, [formattedData]));
}

function hashPreRegisteredUsername(username: string, clowNumber: bigint) {
  return keccak256(encodePacked(["string", "uint256"], [username, clowNumber]));
}

export {hashDispersePaymentUsersToPay, hashPreRegisteredUsername };
