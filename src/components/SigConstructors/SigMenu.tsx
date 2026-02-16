'use client'
import { useState } from 'react'
import { switchChain } from '@wagmi/core'
import { readContracts } from '@wagmi/core'
import { config, networks } from '@/config/index'
import { CoreABI } from '@evvm/evvm-js'
import { FaucetFunctionsComponent } from './FaucetFunctions/FaucetFunctionsComponent'
import { PaySignaturesComponent } from './PaymentFunctions/PaySignaturesComponent'
import { DispersePayComponent } from './PaymentFunctions/DispersePayComponent'
import { GoldenStakingComponent } from './StakingFunctions/GoldenStakingComponent'
import { PresaleStakingComponent } from './StakingFunctions/PresaleStakingComponent'
import { PublicStakingComponent } from './StakingFunctions/PublicStakingComponent'
import { PreRegistrationUsernameComponent } from './NameServiceFunctions/PreRegistrationUsernameComponent'
import { RegistrationUsernameComponent } from './NameServiceFunctions/RegistrationUsernameComponent'
import { MakeOfferComponent } from './NameServiceFunctions/MakeOfferComponent'
import { WithdrawOfferComponent } from './NameServiceFunctions/WithdrawOfferComponent'
import { AcceptOfferComponent } from './NameServiceFunctions/AcceptOfferComponent'
import { RenewUsernameComponent } from './NameServiceFunctions/RenewUsernameComponent'
import { AddCustomMetadataComponent } from './NameServiceFunctions/AddCustomMetadataComponent'
import { RemoveCustomMetadataComponent } from './NameServiceFunctions/RemoveCustomMetadataComponent'
import { FlushCustomMetadataComponent } from './NameServiceFunctions/FlushCustomMetadataComponent'
import { FlushUsernameComponent } from './NameServiceFunctions/FlushUsernameComponent'
import { FaucetBalanceChecker } from './FaucetFunctions/FaucetBalanceChecker'
import { MakeOrderComponent } from './P2PSwap/MakeOrderComponent'
import { CancelOrderComponent } from './P2PSwap/CancelOrderComponent'
import { DispatchOrderFillPropotionalFeeComponent } from './P2PSwap/DispatchOrderPropotionalComponent'
import { DispatchOrderFillFixedFeeComponent } from './P2PSwap/DispatchOrderFixedComponent'
import { RegisterEvvmComponent } from './EvvmRegistery/RegisterEvvmComponent'
import { SetEvvmIdComponent } from './EvvmRegistery/SetEvvmIdComponent'

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
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value
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
    <GoldenStakingComponent key="golden" stakingAddress={stakingAddress} coreAddress={coreAddress} />,
    <PresaleStakingComponent key="presale" stakingAddress={stakingAddress} coreAddress={coreAddress} />,
    <PublicStakingComponent key="public" stakingAddress={stakingAddress} coreAddress={coreAddress} />,
  ]

  const mnsComponents = [
    <PreRegistrationUsernameComponent
      key="preReg"
      nameServiceAddress={nameserviceAddress}
    />,
    <RegistrationUsernameComponent
      key="reg"
      nameServiceAddress={nameserviceAddress}
    />,
    <MakeOfferComponent
      key="makeOffer"
      nameServiceAddress={nameserviceAddress}
    />,
    <WithdrawOfferComponent
      key="withdrawOffer"
      nameServiceAddress={nameserviceAddress}
    />,
    <AcceptOfferComponent
      key="acceptOffer"
      nameServiceAddress={nameserviceAddress}
    />,
    <RenewUsernameComponent
      key="renewUsername"
      nameServiceAddress={nameserviceAddress}
    />,
    <AddCustomMetadataComponent
      key="addCustomMetadata"
      nameServiceAddress={nameserviceAddress}
    />,
    <RemoveCustomMetadataComponent
      key="removeCustomMetadata"
      nameServiceAddress={nameserviceAddress}
    />,
    <FlushCustomMetadataComponent
      key="flushCustomMetadata"
      nameServiceAddress={nameserviceAddress}
    />,
    <FlushUsernameComponent
      key="flushUsername"
      nameServiceAddress={nameserviceAddress}
    />,
  ]

  const p2pComponents = [
    <MakeOrderComponent key="makeOrder" p2pSwapAddress={p2pswapAddress} />,
    <CancelOrderComponent key="cancelOrder" p2pSwapAddress={p2pswapAddress} />,
    <DispatchOrderFillPropotionalFeeComponent
      key="dispatchOrder_fillPropotionalFee"
      p2pSwapAddress={p2pswapAddress}
    />,
    <DispatchOrderFillFixedFeeComponent
      key="dispatchOrder_fillFixedFee"
      p2pSwapAddress={p2pswapAddress}
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
        <h3>Enter your EVVM contract address:</h3>
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="EVVM Contract Address"
              value={coreAddress}
              onChange={(e) => setEvvmAddress(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
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
            <select
              style={{
                padding: '0.7rem 1.2rem',
                borderRadius: 8,
                border: '1.5px solid #d1d5db',
                background: '#f9fafb',
                color: '#222',
                fontWeight: 500,
                fontSize: 15,
                minWidth: 180,
                marginRight: 8,
                boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)',
                outline: 'none',
                transition: 'border 0.2s',
                cursor: 'pointer',
              }}
              value={network}
              onChange={handleNetworkChange}
            >
              {networkOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              onClick={fetchContracts}
              disabled={loading}
              style={{
                padding: '0.7rem 1.5rem',
                borderRadius: 8,
                border: '1.5px solid #d1d5db',
                background: loading ? '#e5e7eb' : '#f3f4f6',
                color: '#222',
                fontWeight: 600,
                fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                minWidth: 140,
              }}
            >
              {loading ? 'Loading...' : 'Load Contracts'}
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
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
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          width: '100%',
        }}
      >
        <label
          htmlFor="sig-menu-select"
          style={{
            fontWeight: 600,
            fontSize: 16,
            color: '#333',
            marginBottom: 4,
            textAlign: 'center',
            width: '100%',
          }}
        >
          Select a function:
        </label>
        <select
          id="sig-menu-select"
          onChange={(e) => setMenu(e.target.value)}
          style={{
            ...selectStyle,
            fontSize: 16,
            fontWeight: 500,
            border: '1.5px solid #d1d5db',
            background: '#f9fafb',
            color: '#222',
            maxWidth: 400,
            minWidth: 260,
            margin: '0 auto',
            textAlign: 'center',
            boxShadow: '0 1px 4px 0 rgba(0,0,0,0.02)',
            display: 'block',
          }}
          value={menu}
        >
          <option value="pay">Payment signatures</option>
          <option value="staking">Staking signatures</option>
          <option value="mns">Name Service signatures</option>
          <option value="p2pswap">P2P Swap signatures</option>
          <option value="registry">EVVM Registry</option>
          <option value="faucet">Faucet functions</option>
        </select>
      </div>

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
