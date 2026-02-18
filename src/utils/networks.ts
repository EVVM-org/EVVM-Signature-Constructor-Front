// Network options and mapping for EVVM Signature Constructor

export const networkOptions = [
  { value: 'sepolia', label: 'Sepolia' },
  { value: 'arbitrumSepolia', label: 'Arbitrum Sepolia' },
  { value: 'hederaTestnet', label: 'Hedera Testnet' },
  { value: 'baseSepolia', label: 'Base Sepolia' },
  { value: 'mantleSepoliaTestnet', label: 'Mantle Sepolia Testnet' },
  { value: 'monadTestnet', label: 'Monad Testnet' },
  { value: 'zksyncSepoliaTestnet', label: 'zkSync Sepolia Testnet' },
  { value: 'celoSepolia', label: 'Celo Sepolia' },
  { value: 'opBNBTestnet', label: 'opBNB Testnet' },
  { value: 'scrollSepolia', label: 'Scroll Sepolia' },
  { value: 'zircuitGarfieldTestnet', label: 'Zircuit Garfield Testnet' },
  { value: 'optimismSepolia', label: 'Optimism Sepolia' },
  { value: 'avalancheFuji', label: 'Avalanche Fuji' },
  { value: 'flareTestnet', label: 'Flare Testnet' },
  { value: 'storyAeneid', label: 'Story Aeneid' },
]

export const networkMap: { [key: string]: number } = {
  sepolia: 0,
  arbitrumSepolia: 1,
  hederaTestnet: 2,
  baseSepolia: 3,
  mantleSepoliaTestnet: 4,
  monadTestnet: 5,
  zksyncSepoliaTestnet: 6,
  celoSepolia: 7,
  opBNBTestnet: 8,
  scrollSepolia: 9,
  zircuitGarfieldTestnet: 10,
  optimismSepolia: 11,
  avalancheFuji: 12,
  flareTestnet: 13,
  storyAeneid: 14,
}
