type PayInputData = {
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

type DispersePayMetadata = {
  amount: string;
  to_address: `0x${string}`;
  to_identity: string;
};

type DispersePayInputData = {
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

export type { PayInputData, DispersePayMetadata, DispersePayInputData };
