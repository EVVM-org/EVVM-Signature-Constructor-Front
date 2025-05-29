import { keccak256, encodePacked, encodeAbiParameters, sha256 } from "viem";

// ABI parameters definition for encoding tuple arrays
// Each tuple contains: uint256 (amount), address (recipient), string (identifier)
const abiParameters = [
  {
    type: "tuple[]",
    components: [{ type: "uint256" }, { type: "address" }, { type: "string" }],
  },
];

/**
 * Hashes a preregistered username with a clown number using keccak256
 * @param username - The username string to hash
 * @param clowNumber - The clown number as bigint
 * @returns The keccak256 hash of the packed encoded data
 */
function hashPreregisteredUsername(username: string, clowNumber: bigint) {
  return keccak256(encodePacked(["string", "uint256"], [username, clowNumber]));
}

/**
 * Hashes payment data for disperse operations using sha256
 * @param toData - Array of payment data tuples containing amount, address, and identifier
 * @returns The sha256 hash of the ABI-encoded payment data
 */
function hashDispersePaymentUsersToPay(toData: any[]) {
  // Log the encoded data for debugging purposes
  console.log(encodeAbiParameters(abiParameters, [toData]));
  // Return sha256 hash of the ABI-encoded data
  return sha256(encodeAbiParameters(abiParameters, [toData]));
}

export { hashPreregisteredUsername, hashDispersePaymentUsersToPay };
