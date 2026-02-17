'use client'
import { useState, ReactNode } from 'react'
import {
  Accordion,
  Button,
  Fieldset,
  Group,
  Select,
  Tabs,
  TextInput,
} from '@mantine/core'
import { switchChain } from '@wagmi/core'
import { readContracts } from '@wagmi/core'
import { config, networks } from '@/config/index'
import { CoreABI } from '@evvm/evvm-js'
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
} from './NameServiceFunctions'
import { FaucetFunctionsComponent } from './FaucetFunctions/FaucetFunctionsComponent'
import {
  PaySignaturesComponent,
  DispersePayComponent,
} from './PaymentFunctions'
import {
  GoldenStakingComponent,
  PresaleStakingComponent,
  PublicStakingComponent,
} from './StakingFunctions'

import { FaucetBalanceChecker } from './FaucetFunctions/FaucetBalanceChecker'
import {
  MakeOrderComponent,
  CancelOrderComponent,
  DispatchOrderFillPropotionalFeeComponent,
  DispatchOrderFillFixedFeeComponent,
} from './P2PSwap'
import { RegisterEvvmComponent, SetEvvmIdComponent } from './EvvmRegistery'

const boxStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '8px',
  width: '100%',
  marginBottom: '1rem',
} as const

const selectStyle = {
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '8px',
  width: '100%',
  backgroundColor: '#f9f9f9',
  color: '#333',
  marginBottom: '1rem',
} as const

export const SigMenu = () => {
  const [menu, setMenu] = useState('pay')
  const [coreAddress, setEvvmAddress] = useState('')
  const [stakingAddress, setStakingAddress] = useState('')
  const [nameserviceAddress, setNameserviceAddress] = useState('')
  const [evvmId, setEvvmId] = useState(0)
  const [p2pswapAddress, setP2pswapAddress] = useState('')
  const [loading, setLoading] = useState(false)

  type MenuItem = {
    id: string
    title: string
    description?: string
    element: ReactNode
  }

  const networkOptions = [
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
  ]
  const [network, setNetwork] = useState('sepolia')

  const handleNetworkChange = async (
    e: React.ChangeEvent<HTMLSelectElement> | string | null
  ) => {
    // support both native <select> (event) and Mantine <Select> (value:string|null)
    const value =
      typeof e === 'string' || e === null ? (e ?? network) : e.target.value
    setNetwork(value)

    const networkMap: { [key: string]: number } = {
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
    }

    const networkIndex = networkMap[value]
    if (networkIndex !== undefined && networks[networkIndex]) {
      const chainId = networks[networkIndex].id
      if (typeof chainId === 'number' && !isNaN(chainId)) {
        try {
          await switchChain(config, { chainId })
        } catch (err) {
          console.error('Failed to switch chain:', err)
        }
      }
    }
  }

  const fetchContracts = async () => {
    if (!coreAddress) {
      alert('Please enter a valid EVVM address')
      return
    }
    setLoading(true)
    try {
      const contracts = [
        {
          abi: CoreABI as any,
          address: coreAddress as `0x${string}`,
          functionName: 'getStakingContractAddress',
          args: [],
        },
        {
          abi: CoreABI as any,
          address: coreAddress as `0x${string}`,
          functionName: 'getNameServiceAddress',
          args: [],
        },
        {
          abi: CoreABI as any,
          address: coreAddress as `0x${string}`,
          functionName: 'getEvvmID',
          args: [],
        },
      ]
      const results = await readContracts(config, { contracts })
      const [stakingAddrResult, nsAddrResult, evvmIdResult] = results
      setStakingAddress(
        typeof stakingAddrResult?.result === 'string'
          ? stakingAddrResult.result
          : ''
      )

      console.log('EVVM ID result:', evvmIdResult) // Log the EVVM ID result for debugging
      setNameserviceAddress(
        typeof nsAddrResult?.result === 'string' ? nsAddrResult.result : ''
      )

      // evvmId may come back as string | number | bigint depending on provider/viem
      const rawEvvmId = evvmIdResult?.result
      const evvmIdValue =
        typeof rawEvvmId === 'string'
          ? parseInt(rawEvvmId)
          : typeof rawEvvmId === 'bigint'
            ? Number(rawEvvmId)
            : typeof rawEvvmId === 'number'
              ? rawEvvmId
              : 0
      setEvvmId(evvmIdValue)
    } catch (err) {
      setStakingAddress('')
      setNameserviceAddress('')
      alert('Could not fetch contract addresses')
    } finally {
      setLoading(false)
    }
  }

  const payComponents: MenuItem[] = [
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

  const stakingComponents: MenuItem[] = [
    {
      id: 'golden',
      title: 'Golden Staking',
      description: 'Golden staking utilities',
      element: (
        <GoldenStakingComponent
          stakingAddress={stakingAddress}
          coreAddress={coreAddress}
        />
      ),
    },
    {
      id: 'presale',
      title: 'Presale Staking',
      description: 'Presale staking utilities',
      element: (
        <PresaleStakingComponent
          stakingAddress={stakingAddress}
          coreAddress={coreAddress}
        />
      ),
    },
    {
      id: 'public',
      title: 'Public Staking',
      description: 'Public staking interactions',
      element: (
        <PublicStakingComponent
          stakingAddress={stakingAddress}
          coreAddress={coreAddress}
        />
      ),
    },
  ]

  const mnsComponents: MenuItem[] = [
    {
      id: 'preReg',
      title: 'Pre-registration',
      description: 'Pre-register a username',
      element: (
        <PreRegistrationUsernameComponent
          nameServiceAddress={nameserviceAddress}
          coreAddress={coreAddress}
        />
      ),
    },
    {
      id: 'reg',
      title: 'Register Username',
      description: 'Register a username',
      element: (
        <RegistrationUsernameComponent
          nameServiceAddress={nameserviceAddress}
          coreAddress={coreAddress}
        />
      ),
    },
    {
      id: 'makeOffer',
      title: 'Make Offer',
      description: 'Create an offer',
      element: (
        <MakeOfferComponent
          nameServiceAddress={nameserviceAddress}
          coreAddress={coreAddress}
        />
      ),
    },
    {
      id: 'withdrawOffer',
      title: 'Withdraw Offer',
      description: 'Withdraw an existing offer',
      element: (
        <WithdrawOfferComponent
          nameServiceAddress={nameserviceAddress}
          coreAddress={coreAddress}
        />
      ),
    },
    {
      id: 'acceptOffer',
      title: 'Accept Offer',
      description: 'Accept an offer',
      element: (
        <AcceptOfferComponent
          nameServiceAddress={nameserviceAddress}
          coreAddress={coreAddress}
        />
      ),
    },
    {
      id: 'renewUsername',
      title: 'Renew Username',
      description: 'Renew a username registration',
      element: (
        <RenewUsernameComponent
          nameServiceAddress={nameserviceAddress}
          coreAddress={coreAddress}
        />
      ),
    },
    {
      id: 'addCustomMetadata',
      title: 'Add Metadata',
      description: 'Add custom metadata to a name',
      element: (
        <AddCustomMetadataComponent
          nameServiceAddress={nameserviceAddress}
          coreAddress={coreAddress}
        />
      ),
    },
    {
      id: 'removeCustomMetadata',
      title: 'Remove Metadata',
      description: 'Remove custom metadata',
      element: (
        <RemoveCustomMetadataComponent
          nameServiceAddress={nameserviceAddress}
          coreAddress={coreAddress}
        />
      ),
    },
    {
      id: 'flushCustomMetadata',
      title: 'Flush Metadata',
      description: 'Flush all custom metadata',
      element: (
        <FlushCustomMetadataComponent
          nameServiceAddress={nameserviceAddress}
          coreAddress={coreAddress}
        />
      ),
    },
    {
      id: 'flushUsername',
      title: 'Flush Username',
      description: 'Flush username registration data',
      element: (
        <FlushUsernameComponent
          nameServiceAddress={nameserviceAddress}
          coreAddress={coreAddress}
        />
      ),
    },
  ]

  const p2pComponents: MenuItem[] = [
    {
      id: 'makeOrder',
      title: 'Make Order',
      description: 'Create a P2P order',
      element: (
        <MakeOrderComponent
          p2pSwapAddress={p2pswapAddress}
          coreAddress={coreAddress}
        />
      ),
    },
    {
      id: 'cancelOrder',
      title: 'Cancel Order',
      description: 'Cancel an order',
      element: (
        <CancelOrderComponent
          p2pSwapAddress={p2pswapAddress}
          coreAddress={coreAddress}
        />
      ),
    },
    {
      id: 'dispatchOrder_fillPropotionalFee',
      title: 'Dispatch (Proportional Fee)',
      description: 'Dispatch order (proportional fee)',
      element: (
        <DispatchOrderFillPropotionalFeeComponent
          p2pSwapAddress={p2pswapAddress}
          coreAddress={coreAddress}
        />
      ),
    },
    {
      id: 'dispatchOrder_fillFixedFee',
      title: 'Dispatch (Fixed Fee)',
      description: 'Dispatch order (fixed fee)',
      element: (
        <DispatchOrderFillFixedFeeComponent
          p2pSwapAddress={p2pswapAddress}
          coreAddress={coreAddress}
        />
      ),
    },
  ]

  const registryComponents: MenuItem[] = [
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
      element: <SetEvvmIdComponent coreAddress={coreAddress} />,
    },
  ]

  const components: MenuItem[] =
    menu === 'faucet'
      ? [
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
      : menu === 'pay'
        ? payComponents
        : menu === 'staking'
          ? stakingComponents
          : menu === 'mns'
            ? mnsComponents
            : menu === 'p2pswap'
              ? p2pComponents
              : menu === 'registry'
                ? registryComponents
                : []

  return (
    <div
      style={{
      maxWidth: '80vw',
        width: '100%',
        margin: '0rem auto',
        padding: '1rem',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#111',
            textAlign: 'center',
            margin: 0,
          }}
        >EVVM Signature Constructor</h1>
        {stakingAddress && nameserviceAddress ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              background: '#f8fafc',
              border: '1.5px solid #d1d5db',
              borderRadius: 10,
              padding: '1rem 1.5rem',
              minWidth: 0,
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{ fontSize: 15, color: '#444', fontFamily: 'monospace' }}
            >
              <strong>EVVM ID:</strong> {evvmId}
            </div>
            <div
              style={{ fontSize: 15, color: '#444', fontFamily: 'monospace' }}
            >
              <strong>EVVM:</strong> {coreAddress}
            </div>
            <div
              style={{ fontSize: 15, color: '#444', fontFamily: 'monospace' }}
            >
              <strong>Staking:</strong> {stakingAddress}
            </div>
            <div
              style={{ fontSize: 15, color: '#444', fontFamily: 'monospace' }}
            >
              <strong>NameService:</strong> {nameserviceAddress}
            </div>
          </div>
        ) : (
          <Fieldset legend="Evvm Contract Details" radius="md">
            <TextInput
              label="Core contract address"
              placeholder="0x..."
              value={coreAddress}
              onChange={(e) => setEvvmAddress(e.target.value)}
            />
            <Select
              label="Host Chain"
              value={network}
              onChange={(val) => handleNetworkChange(val)}
              data={networkOptions}
            />

            <Group justify="flex-end" mt="md">
              <Button onClick={fetchContracts}>Load instance</Button>
            </Group>
          </Fieldset>
        )}
      </div>

      <input
        type="text"
        placeholder="P2P Swap Contract Address (optional)"
        value={p2pswapAddress}
        onChange={(e) => setP2pswapAddress(e.target.value)}
        style={{
          padding: '0.75rem 1rem',
          margin: '0 auto',
          borderRadius: 8,
          background: '#f9fafb',
          color: '#222',
          border: '1.5px solid #d1d5db',
          width: 420,
          fontFamily: 'monospace',
          fontSize: 16,
          boxSizing: 'border-box',
          outline: 'none',
          transition: 'border 0.2s',
        }}
      />

      <label
        style={{
          fontWeight: 600,
          fontSize: 16,
          color: '#333',
          textAlign: 'center',
          width: '100%',
        }}
      >
        Select a function:
      </label>

      <Tabs
        color="green"
        variant="pills"
        value={menu}
        onChange={(value) => setMenu(value || 'pay')}
        style={{ marginBottom: '-1.5rem' }}
      >
        <Tabs.List>
          <Tabs.Tab value="pay">Payment</Tabs.Tab>
          <Tabs.Tab value="staking">Staking</Tabs.Tab>
          <Tabs.Tab value="mns">Name Service</Tabs.Tab>
          <Tabs.Tab value="p2pswap">P2P Swap</Tabs.Tab>
          <Tabs.Tab value="registry">EVVM Registry</Tabs.Tab>
          <Tabs.Tab value="faucet">Faucet</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      <div>
        <Accordion
          variant="contained"
          radius="md"
          chevronPosition="right"
          style={{ marginTop: '0rem' }}
        >
          {components.map((item) => (
            <Accordion.Item key={item.id} value={item.id}>
              <Accordion.Control>{item.title}</Accordion.Control>
              <Accordion.Panel>{item.element}</Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </div>
  )
}
