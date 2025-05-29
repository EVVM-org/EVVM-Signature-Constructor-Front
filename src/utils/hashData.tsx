import { keccak256, encodePacked, encodeAbiParameters, sha256 } from "viem";

const abiParameters = [
  {
    type: "tuple[]",
    components: [{ type: "uint256" }, { type: "address" }, { type: "string" }],
  },
];

function hashPreregisteredUsername(username: string, clowNumber: bigint) {
  return keccak256(encodePacked(["string", "uint256"], [username, clowNumber]));
}

//crear [] con los datos de los usuarios
// debe ser [[amount, to_address, to_username], [amount, to_address, to_username]]

function hashDispersePaymentUsersToPay(toData: any[]) {
  console.log(encodeAbiParameters(abiParameters, [toData]));
  return sha256(encodeAbiParameters(abiParameters, [toData]));
}

export { hashPreregisteredUsername, hashDispersePaymentUsersToPay };
