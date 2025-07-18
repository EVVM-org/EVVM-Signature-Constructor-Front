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

type WithdrawOfferInputData = {
  user: `0x${string}`;
  nonce: bigint;
  username: string;
  offerID: bigint;
  priorityFeeForFisher: bigint;
  signature: string;
  nonce_Evvm: bigint;
  priority_Evvm: boolean;
  signature_Evvm: string;
};

type AcceptOfferInputData = {
  user: `0x${string}`;
  nonce: string;
  username: string;
  offerID: bigint;
  priorityFeeForFisher: bigint;
  signature: string;
  nonce_Evvm: bigint;
  priority_Evvm: boolean;
  signature_Evvm: string;
};

type RenewUsernameInputData = {
  user: `0x${string}`;
  nonce: bigint;
  username: string;
  priorityFeeForFisher: bigint;
  signature: string;
  nonce_Evvm: bigint;
  priority_Evvm: boolean;
  signature_Evvm: string;
};

type AddCustomMetadataInputData = {
  user: `0x${string}`;
  nonce: bigint;
  identity: string;
  value: string;
  priorityFeeForFisher: bigint;
  signature: string;
  nonce_Evvm: bigint;
  priority_Evvm: boolean;
  signature_Evvm: string;
};

type RemoveCustomMetadataInputData = {
  user: `0x${string}`;
  nonce: bigint;
  identity: string;
  key: bigint;
  priorityFeeForFisher: bigint;
  signature: string;
  nonce_Evvm: bigint;
  priority_Evvm: boolean;
  signature_Evvm: string;
};

type FlushCustomMetadataInputData = {
  user: `0x${string}`;
  nonce: bigint;
  identity: string;
  priorityFeeForFisher: bigint;
  signature: string;
  nonce_Evvm: bigint;
  priority_Evvm: boolean;
  signature_Evvm: string;
};

type FlushUsernameInputData = {
  user: `0x${string}`;
  identity: string;
  priorityFeeForFisher: bigint;
  nonce: bigint;
  signature: string;
  nonce_Evvm: bigint;
  priority_Evvm: boolean;
  signature_Evvm: string;
};

export type {
  PreRegistrationUsernameInputData,
  RegistrationUsernameInputData,
  MakeOfferInputData,
  WithdrawOfferInputData,
  AcceptOfferInputData,
  RenewUsernameInputData,
  AddCustomMetadataInputData,
  RemoveCustomMetadataInputData,
  FlushCustomMetadataInputData,
  FlushUsernameInputData,
};
