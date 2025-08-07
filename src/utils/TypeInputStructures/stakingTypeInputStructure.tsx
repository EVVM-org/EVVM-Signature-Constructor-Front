type GoldenStakingInputData = {
  isStaking: boolean;
  amountOfStaking: bigint;
  signature_EVVM: string;
};

type PresaleStakingInputData = {
  user: `0x${string}`;
  isStaking: boolean;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

type PublicStakingInputData = {
  user: `0x${string}`;
  isStaking: boolean;
  amountOfStaking: bigint;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

type PublicServiceStakingInputData = {
  user: `0x${string}`;
  service: `0x${string}`;
  isStaking: boolean;
  amountOfStaking: bigint;
  nonce: bigint;
  signature: string;
  priorityFee_EVVM: bigint;
  nonce_EVVM: bigint;
  priorityFlag_EVVM: boolean;
  signature_EVVM: string;
};

export type {
  GoldenStakingInputData,
  PresaleStakingInputData,
  PublicStakingInputData,
  PublicServiceStakingInputData,
};
