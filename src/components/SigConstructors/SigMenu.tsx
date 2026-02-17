'use client'
import { useState } from 'react'
import { Button, Fieldset, Group, Select, Tabs, TextInput } from '@mantine/core'
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

  const payComponents = [
    <PaySignaturesComponent key="pay" coreAddress={coreAddress} />,
    <DispersePayComponent key="disperse" coreAddress={coreAddress} />,
  ]

  const stakingComponents = [
    <GoldenStakingComponent
      key="golden"
      stakingAddress={stakingAddress}
      coreAddress={coreAddress}
    />,
    <PresaleStakingComponent
      key="presale"
      stakingAddress={stakingAddress}
      coreAddress={coreAddress}
    />,
    <PublicStakingComponent
      key="public"
      stakingAddress={stakingAddress}
      coreAddress={coreAddress}
    />,
  ]

  const mnsComponents = [
    <PreRegistrationUsernameComponent
      key="preReg"
      nameServiceAddress={nameserviceAddress}
      coreAddress={coreAddress}
    />,
    <RegistrationUsernameComponent
      key="reg"
      nameServiceAddress={nameserviceAddress}
      coreAddress={coreAddress}
    />,
    <MakeOfferComponent
      key="makeOffer"
      nameServiceAddress={nameserviceAddress}
      coreAddress={coreAddress}
    />,
    <WithdrawOfferComponent
      key="withdrawOffer"
      nameServiceAddress={nameserviceAddress}
      coreAddress={coreAddress}
    />,
    <AcceptOfferComponent
      key="acceptOffer"
      nameServiceAddress={nameserviceAddress}
      coreAddress={coreAddress}
    />,
    <RenewUsernameComponent
      key="renewUsername"
      nameServiceAddress={nameserviceAddress}
      coreAddress={coreAddress}
    />,
    <AddCustomMetadataComponent
      key="addCustomMetadata"
      nameServiceAddress={nameserviceAddress}
      coreAddress={coreAddress}
    />,
    <RemoveCustomMetadataComponent
      key="removeCustomMetadata"
      nameServiceAddress={nameserviceAddress}
      coreAddress={coreAddress}
    />,
    <FlushCustomMetadataComponent
      key="flushCustomMetadata"
      nameServiceAddress={nameserviceAddress}
      coreAddress={coreAddress}
    />,
    <FlushUsernameComponent
      key="flushUsername"
      nameServiceAddress={nameserviceAddress}
      coreAddress={coreAddress}
    />,
  ]

  const p2pComponents = [
    <MakeOrderComponent
      key="makeOrder"
      p2pSwapAddress={p2pswapAddress}
      coreAddress={coreAddress}
    />,
    <CancelOrderComponent
      key="cancelOrder"
      p2pSwapAddress={p2pswapAddress}
      coreAddress={coreAddress}
    />,
    <DispatchOrderFillPropotionalFeeComponent
      key="dispatchOrder_fillPropotionalFee"
      p2pSwapAddress={p2pswapAddress}
      coreAddress={coreAddress}
    />,
    <DispatchOrderFillFixedFeeComponent
      key="dispatchOrder_fillFixedFee"
      p2pSwapAddress={p2pswapAddress}
      coreAddress={coreAddress}
    />,
  ]

  const registryComponents = [
    <RegisterEvvmComponent key="registerEvvm" />,
    <SetEvvmIdComponent key="setEvvmId" coreAddress={coreAddress} />,
  ]

  const components =
    menu === 'faucet'
      ? [
          <FaucetFunctionsComponent key="faucet" coreAddress={coreAddress} />,
          <FaucetBalanceChecker
            key="faucetBalance"
            coreAddress={coreAddress}
          />,
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
        maxWidth: 900,
        margin: '0rem auto',
        padding: '2rem 1.5rem',
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
        <h1>EVVM Signature Constructor</h1>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {components.map((Component, index) => (
          <div
            key={index}
            style={{
              ...boxStyle,
              background: '#f9fafb',
              boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)',
            }}
          >
            {Component}
          </div>
        ))}
      </div>
    </div>
  )
}
