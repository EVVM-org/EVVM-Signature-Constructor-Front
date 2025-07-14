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

export type { PreRegistrationUsernameInputData };
