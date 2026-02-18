// Menu item arrays for SigMenu
import { ReactNode } from 'react'
import {
  PreRegistrationUsernameComponent,
  RegistrationUsernameComponent,
  MakeOfferComponent,
  WithdrawOfferComponent,
  AcceptOfferComponent,
  RenewUsernameComponent,
  AddCustomMetadataComponent,
  RemoveCustomMetadataComponent,
  FlushCustomMetadataComponent,
  FlushUsernameComponent,
} from '@/components/SigConstructors/NameServiceFunctions'
import { FaucetFunctionsComponent } from '@/components/SigConstructors/FaucetFunctions/FaucetFunctionsComponent'
import { FaucetBalanceChecker } from '@/components/SigConstructors/FaucetFunctions/FaucetBalanceChecker'
import {
  PaySignaturesComponent,
  DispersePayComponent,
} from '@/components/SigConstructors/PaymentFunctions'
import {
  GoldenStakingComponent,
  PresaleStakingComponent,
  PublicStakingComponent,
} from '@/components/SigConstructors/StakingFunctions'
import {
  MakeOrderComponent,
  CancelOrderComponent,
  DispatchOrderFillPropotionalFeeComponent,
  DispatchOrderFillFixedFeeComponent,
} from '@/components/SigConstructors/P2PSwap'
import { RegisterEvvmComponent, SetEvvmIdComponent } from '@/components/SigConstructors/EvvmRegistery'

export type MenuItem = {
  id: string
  title: string
  description?: string
  element: ReactNode
}

export const getPayComponents = (coreAddress: string): MenuItem[] => [
  {
    id: 'pay',
    title: 'Pay Signatures',
    description: 'Create and sign payments',
    element: <PaySignaturesComponent coreAddress={coreAddress} />,
  },
  {
    id: 'disperse',
    title: 'Disperse Pay',
    description: 'Disperse payments to multiple recipients',
    element: <DispersePayComponent coreAddress={coreAddress} />,
  },
]

export const getStakingComponents = (stakingAddress: string, coreAddress: string): MenuItem[] => [
  {
    id: 'golden',
    title: 'Golden Staking',
    description: 'Golden staking utilities',
    element: <GoldenStakingComponent stakingAddress={stakingAddress} coreAddress={coreAddress} />,
  },
  {
    id: 'presale',
    title: 'Presale Staking',
    description: 'Presale staking utilities',
    element: <PresaleStakingComponent stakingAddress={stakingAddress} coreAddress={coreAddress} />,
  },
  {
    id: 'public',
    title: 'Public Staking',
    description: 'Public staking interactions',
    element: <PublicStakingComponent stakingAddress={stakingAddress} coreAddress={coreAddress} />,
  },
]

export const getMnsComponents = (nameserviceAddress: string, coreAddress: string): MenuItem[] => [
  {
    id: 'preReg',
    title: 'Pre-registration',
    description: 'Pre-register a username',
    element: <PreRegistrationUsernameComponent nameServiceAddress={nameserviceAddress} coreAddress={coreAddress} />,
  },
  {
    id: 'reg',
    title: 'Register Username',
    description: 'Register a username',
    element: <RegistrationUsernameComponent nameServiceAddress={nameserviceAddress} coreAddress={coreAddress} />,
  },
  {
    id: 'makeOffer',
    title: 'Make Offer',
    description: 'Create an offer',
    element: <MakeOfferComponent nameServiceAddress={nameserviceAddress} coreAddress={coreAddress} />,
  },
  {
    id: 'withdrawOffer',
    title: 'Withdraw Offer',
    description: 'Withdraw an existing offer',
    element: <WithdrawOfferComponent nameServiceAddress={nameserviceAddress} coreAddress={coreAddress} />,
  },
  {
    id: 'acceptOffer',
    title: 'Accept Offer',
    description: 'Accept an offer',
    element: <AcceptOfferComponent nameServiceAddress={nameserviceAddress} coreAddress={coreAddress} />,
  },
  {
    id: 'renewUsername',
    title: 'Renew Username',
    description: 'Renew a username registration',
    element: <RenewUsernameComponent nameServiceAddress={nameserviceAddress} coreAddress={coreAddress} />,
  },
  {
    id: 'addCustomMetadata',
    title: 'Add Metadata',
    description: 'Add custom metadata to a name',
    element: <AddCustomMetadataComponent nameServiceAddress={nameserviceAddress} coreAddress={coreAddress} />,
  },
  {
    id: 'removeCustomMetadata',
    title: 'Remove Metadata',
    description: 'Remove custom metadata',
    element: <RemoveCustomMetadataComponent nameServiceAddress={nameserviceAddress} coreAddress={coreAddress} />,
  },
  {
    id: 'flushCustomMetadata',
    title: 'Flush Metadata',
    description: 'Flush all custom metadata',
    element: <FlushCustomMetadataComponent nameServiceAddress={nameserviceAddress} coreAddress={coreAddress} />,
  },
  {
    id: 'flushUsername',
    title: 'Flush Username',
    description: 'Flush username registration data',
    element: <FlushUsernameComponent nameServiceAddress={nameserviceAddress} coreAddress={coreAddress} />,
  },
]

export const getP2PComponents = (p2pswapAddress: string, coreAddress: string): MenuItem[] => [
  {
    id: 'makeOrder',
    title: 'Make Order',
    description: 'Create a P2P order',
    element: <MakeOrderComponent p2pSwapAddress={p2pswapAddress} coreAddress={coreAddress} />,
  },
  {
    id: 'cancelOrder',
    title: 'Cancel Order',
    description: 'Cancel an order',
    element: <CancelOrderComponent p2pSwapAddress={p2pswapAddress} coreAddress={coreAddress} />,
  },
  {
    id: 'dispatchOrder_fillPropotionalFee',
    title: 'Dispatch (Proportional Fee)',
    description: 'Dispatch order (proportional fee)',
    element: <DispatchOrderFillPropotionalFeeComponent p2pSwapAddress={p2pswapAddress} coreAddress={coreAddress} />,
  },
  {
    id: 'dispatchOrder_fillFixedFee',
    title: 'Dispatch (Fixed Fee)',
    description: 'Dispatch order (fixed fee)',
    element: <DispatchOrderFillFixedFeeComponent p2pSwapAddress={p2pswapAddress} coreAddress={coreAddress} />,
  },
]

export const registryComponents: MenuItem[] = [
  {
    id: 'registerEvvm',
    title: 'Register EVVM',
    description: 'Register EVVM instance',
    element: <RegisterEvvmComponent />,
  },
  {
    id: 'setEvvmId',
    title: 'Set EVVM ID',
    description: 'Set EVVM ID on core',
    element: <SetEvvmIdComponent coreAddress={''} />,
  },
]

export const getFaucetComponents = (coreAddress: string): MenuItem[] => [
  {
    id: 'faucet',
    title: 'Faucet Functions',
    description: 'Faucet utilities',
    element: <FaucetFunctionsComponent coreAddress={coreAddress} />,
  },
  {
    id: 'faucetBalance',
    title: 'Faucet Balance',
    description: 'Check faucet balance',
    element: <FaucetBalanceChecker coreAddress={coreAddress} />,
  },
]
