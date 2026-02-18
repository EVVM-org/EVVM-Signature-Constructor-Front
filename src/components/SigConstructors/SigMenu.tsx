'use client'
import { useState, ReactNode } from 'react'
import {
  Accordion,
  Button,
  Fieldset,
  Group,
  Input,
  Select,
  Tabs,
  TextInput,
} from '@mantine/core'
import { switchChain } from '@wagmi/core'
import { readContracts } from '@wagmi/core'
import { config, networks } from '@/config/index'
import { networkOptions, networkMap } from '@/utils/networks'
import {
  getPayComponents,
  getStakingComponents,
  getMnsComponents,
  getP2PComponents,
  registryComponents,
  getFaucetComponents,
  MenuItem,
} from './menuItems'
import { CoreABI } from '@evvm/evvm-js'

import { RegisterEvvmComponent, SetEvvmIdComponent } from './EvvmRegistery'

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

  const [network, setNetwork] = useState('sepolia')

  const handleNetworkChange = async (
    e: React.ChangeEvent<HTMLSelectElement> | string | null
  ) => {
    // support both native <select> (event) and Mantine <Select> (value:string|null)
    const value =
      typeof e === 'string' || e === null ? (e ?? network) : e.target.value
    setNetwork(value)

    // networkMap is now imported from utils/networks

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

  const components: MenuItem[] =
    menu === 'faucet'
      ? getFaucetComponents(coreAddress)
      : menu === 'pay'
        ? getPayComponents(coreAddress)
        : menu === 'staking'
          ? getStakingComponents(stakingAddress, coreAddress)
          : menu === 'mns'
            ? getMnsComponents(nameserviceAddress, coreAddress)
            : menu === 'p2pswap'
              ? getP2PComponents(p2pswapAddress, coreAddress)
              : menu === 'registry'
                ? registryComponents.map(item =>
                    item.id === 'setEvvmId'
                      ? { ...item, element: <SetEvvmIdComponent coreAddress={coreAddress} /> }
                      : item
                  )
                : []

  return (
    <div
      style={{
        maxWidth: '80vw',
        width: '100%',
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
        >
          EVVM Signature Constructor
        </h1>
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
          marginTop: '-1.5rem',
        }}
      >
        <p style={{ fontSize: 14, marginBottom: '-0.5vw' }}>
          P2P Swap Contract Address (optional)
        </p>
        <Input
          size="compact-md"
          type="text"
          placeholder="0x..."
          value={p2pswapAddress}
          onChange={(e) => setP2pswapAddress(e.target.value)}
        />
      </div>

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
