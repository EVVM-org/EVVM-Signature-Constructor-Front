type GoldenStakingInputData = {
  isStaking: boolean;
  amountOfSMate: bigint;
  signature: string;
};

type PresaleStakingInputData = {
  isStaking: boolean;
  user: `0x${string}`;
  nonce: bigint;
  signature: string;
  priorityFee_Evvm: bigint;
  priority_Evvm: boolean;
  signature_Evvm: string;
};

export type { GoldenStakingInputData, PresaleStakingInputData };
