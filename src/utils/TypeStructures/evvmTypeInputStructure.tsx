type PayInputData = {
  from: `0x${string}`;
  to_address: `0x${string}`;
  to_identity: string;
  token: `0x${string}`;
  amount: bigint;
  priorityFee: bigint;
  nonce: bigint;
  priority: boolean;
  executor: string;
  signature: string;
};

type DispersePayMetadata = {
  amount: bigint;
  to_address: `0x${string}`;
  to_identity: string;
};

type DispersePayInputData = {
  from: `0x${string}`;
  toData: DispersePayMetadata[];
  token: `0x${string}`;
  amount: bigint;
  priorityFee: bigint;
  priority: boolean;
  nonce: bigint;
  executor: string;
  signature: string;
};

export type { PayInputData, DispersePayMetadata, DispersePayInputData };
