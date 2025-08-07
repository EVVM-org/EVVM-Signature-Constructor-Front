type PreRegistrationUsernameInputData = {
  user: `0x${string}`;
  hashPreRegisteredUsername: string;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

type RegistrationUsernameInputData = {
  user: `0x${string}`;
  username: string;
  clowNumber: bigint;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

type MakeOfferInputData = {
  user: `0x${string}`;
  username: string;
  expireDate: bigint;
  amount: bigint;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

type WithdrawOfferInputData = {
  user: `0x${string}`;
  username: string;
  offerID: bigint;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

type AcceptOfferInputData = {
  user: `0x${string}`;
  username: string;
  offerID: bigint;
  nonce: string;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

type RenewUsernameInputData = {
  user: `0x${string}`;
  username: string;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

type AddCustomMetadataInputData = {
  user: `0x${string}`;
  identity: string;
  value: string;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

type RemoveCustomMetadataInputData = {
  user: `0x${string}`;
  identity: string;
  key: bigint;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

type FlushCustomMetadataInputData = {
  user: `0x${string}`;
  identity: string;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};


type FlushUsernameInputData = {
  user: `0x${string}`;
  username: string;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
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
