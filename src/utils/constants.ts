// Token Addresses
export const MATE_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000001' as const
export const ETH_TOKEN_ADDRESS = '0x0000000000000000000000000000000000000000' as const

// Contract Addresses
export const REGISTRY_ADDRESS = '0x389dC8fb09211bbDA841D59f4a51160dA2377832' as const

// Documentation URLs
const DOCS_BASE_URL = 'https://www.evvm.info/docs' as const

export const DOCS_URLS = {
  intro: `${DOCS_BASE_URL}/intro`,
  payment: {
    singlePayment: `${DOCS_BASE_URL}/SignatureStructures/EVVM/SinglePaymentSignatureStructure`,
    dispersePayment: `${DOCS_BASE_URL}/SignatureStructures/EVVM/DispersePaymentSignatureStructure`,
  },
  nameService: {
    preRegistration: `${DOCS_BASE_URL}/SignatureStructures/NameService/preRegistrationUsernameStructure`,
    registration: `${DOCS_BASE_URL}/SignatureStructures/NameService/registrationUsernameStructure`,
    makeOffer: `${DOCS_BASE_URL}/SignatureStructures/NameService/makeOfferStructure`,
    withdrawOffer: `${DOCS_BASE_URL}/SignatureStructures/NameService/withdrawOfferStructure`,
    acceptOffer: `${DOCS_BASE_URL}/SignatureStructures/NameService/acceptOfferStructure`,
    renewUsername: `${DOCS_BASE_URL}/SignatureStructures/NameService/renewUsernameStructure`,
    addCustomMetadata: `${DOCS_BASE_URL}/SignatureStructures/NameService/addCustomMetadataStructure`,
    removeCustomMetadata: `${DOCS_BASE_URL}/SignatureStructures/NameService/removeCustomMetadataStructure`,
    flushCustomMetadata: `${DOCS_BASE_URL}/SignatureStructures/NameService/flushCustomMetadataStructure`,
    flushUsername: `${DOCS_BASE_URL}/SignatureStructures/NameService/flushUsernameStructure`,
  },
  staking: {
    stakingUnstaking: `${DOCS_BASE_URL}/SignatureStructures/SMate/StakingUnstakingStructure`,
  },
  p2pSwap: {
    makeOrder: `${DOCS_BASE_URL}/SignatureStructures/P2PSwap/MakeOrderSignatureStructure`,
    cancelOrder: `${DOCS_BASE_URL}/SignatureStructures/P2PSwap/CancelOrderSignatureStructure`,
    dispatchOrder: `${DOCS_BASE_URL}/SignatureStructures/P2PSwap/DispatchOrderSignatureStructure`,
  },
} as const
