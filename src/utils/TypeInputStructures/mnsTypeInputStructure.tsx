type PreRegistrationUsernameInputData = {
  user: `0x${string}`;
  nonce: bigint;
  hashUsername: string;
  priorityFeeForFisher: bigint;
  signature: string;
  nonce_Evvm: bigint;
  priority_Evvm: boolean;
  signature_Evvm: string;
};

type RegistrationUsernameInputData = {
  user: `0x${string}`;
  nonce: bigint;
  username: string;
  clowNumber: bigint;
  signature: string;
  priorityFeeForFisher: bigint;
  nonce_Evvm: bigint;
  priority_Evvm: boolean;
  signature_Evvm: string;
};

type MakeOfferInputData = {
  user: `0x${string}`;
  nonce: bigint;
  username: string;
  amount: bigint;
  expireDate: bigint;
  priorityFeeForFisher: bigint;
  signature: string;
  nonce_Evvm: bigint;
  priority_Evvm: boolean;
  signature_Evvm: string;
};

export type {
  PreRegistrationUsernameInputData,
  RegistrationUsernameInputData,
  MakeOfferInputData,
};
