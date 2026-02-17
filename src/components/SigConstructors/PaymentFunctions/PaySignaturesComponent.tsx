'use client'
import React from 'react'
import {
  Core,
  type IPayData,
  type ISerializableSignedAction,
} from '@evvm/evvm-js'
import { execute } from '@evvm/evvm-js'
import { getEvvmSigner, getCurrentChainId } from '@/utils/evvm-signer'
import {
  TitleAndLink,
  NumberInputWithGenerator,
  AddressInputField,
  PrioritySelector,
  ExecutorSelector,
  DataDisplayWithClear,
  HelperInfo,
} from '@/components/SigConstructors/InputsAndModules'
import { Button } from '@mantine/core'

interface PaySignaturesComponentProps {
  coreAddress: string
}

export const PaySignaturesComponent = ({
  coreAddress,
}: PaySignaturesComponentProps) => {
  const [isUsingUsernames, setIsUsingUsernames] = React.useState(false)
  const [isUsingExecutor, setIsUsingExecutor] = React.useState(false)
  const [priority, setPriority] = React.useState<'low' | 'high'>('low')
  const [dataToGet, setDataToGet] =
    React.useState<ISerializableSignedAction<IPayData> | null>(null)
  const [loading, setLoading] = React.useState(false)

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement)?.value
    if (!coreAddress) {
      console.error('EVVM address is required')
      return
    }

    const to = getValue(isUsingUsernames ? 'toUsername' : 'toAddress')
    const tokenAddress = getValue('tokenAddress_Pay')
    const amount = getValue('amountTokenInput_Pay')
    const priorityFee = getValue('priorityFeeInput_Pay')
    const nonce = getValue('nonceInput_Pay')
    const senderExecutor = isUsingExecutor
      ? getValue('senderExecutorInput_Pay')
      : '0x0000000000000000000000000000000000000000'

    if (!to || !tokenAddress || !amount || !priorityFee || !nonce) {
      console.error('All fields are required')
      return
    }

    setLoading(true)
    try {
      const signer = await getEvvmSigner()
      const evvm = new Core({
        signer,
        address: coreAddress as `0x${string}`,
        chainId: getCurrentChainId(),
      })

      let signedAction
      if (isUsingUsernames) {
        signedAction = await evvm.pay({
          toIdentity: to,
          tokenAddress: tokenAddress as `0x${string}`,
          amount: BigInt(amount),
          priorityFee: BigInt(priorityFee),
          nonce: BigInt(nonce),
          isAsyncExec: priority === 'high',
          senderExecutor: senderExecutor as `0x${string}`,
        })
      } else {
        signedAction = await evvm.pay({
          toAddress: to as `0x${string}`,
          tokenAddress: tokenAddress as `0x${string}`,
          amount: BigInt(amount),
          priorityFee: BigInt(priorityFee),
          nonce: BigInt(nonce),
          isAsyncExec: priority === 'high',
          senderExecutor: senderExecutor as `0x${string}`,
        })
      }

      setDataToGet(signedAction.toJSON())
    } catch (error) {
      console.error('Error creating signature:', error)
    } finally {
      setLoading(false)
    }
  }

  const executePayment = async () => {
    if (!dataToGet || !coreAddress) {
      console.error('Missing data or address')
      return
    }

    try {
      const signer = await getEvvmSigner()
      await execute(signer, dataToGet)
      console.log('Payment executed successfully')
      setDataToGet(null)
    } catch (error) {
      console.error('Error executing payment:', error)
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Single payment"
        link="https://www.evvm.info/docs/SignatureStructures/EVVM/SinglePaymentSignatureStructure"
      />
      <br />

      <div style={{ marginBottom: '1rem' }}>
        <p>
          To:{' '}
          <select
            style={{
              color: 'black',
              backgroundColor: 'white',
              height: '2rem',
              width: '6rem',
            }}
            onChange={(e) => setIsUsingUsernames(e.target.value === 'true')}
          >
            <option value="false">Address</option>
            <option value="true">Username</option>
          </select>
          <input
            type="text"
            placeholder={isUsingUsernames ? 'Enter username' : 'Enter address'}
            id={isUsingUsernames ? 'toUsername' : 'toAddress'}
            style={{
              color: 'black',
              backgroundColor: 'white',
              height: '2rem',
              width: '25rem',
              marginLeft: '0.5rem',
            }}
          />
        </p>
      </div>

      <AddressInputField
        label="Token address"
        inputId="tokenAddress_Pay"
        placeholder="Enter token address"
      />

      {[
        { label: 'Amount', id: 'amountTokenInput_Pay', type: 'number' },
        { label: 'Priority fee', id: 'priorityFeeInput_Pay', type: 'number' },
      ].map(({ label, id, type }) => (
        <div key={id} style={{ marginBottom: '1rem' }}>
          <p>{label}</p>
          <input
            type={type}
            placeholder={`Enter ${label.toLowerCase()}`}
            id={id}
            style={{
              color: 'black',
              backgroundColor: 'white',
              height: '2rem',
              width: '25rem',
            }}
          />
        </div>
      ))}

      <ExecutorSelector
        inputId="senderExecutorInput_Pay"
        placeholder="Enter senderExecutor address"
        onExecutorToggle={setIsUsingExecutor}
        isUsingExecutor={isUsingExecutor}
      />

      <PrioritySelector onPriorityChange={setPriority} />

      <NumberInputWithGenerator
        label="Nonce"
        inputId="nonceInput_Pay"
        placeholder="Enter nonce"
        showRandomBtn={priority !== 'low'}
      />

      <div>
        {priority === 'low' && (
          <HelperInfo label="How to find my sync nonce?">
            <div>
              You can retrieve your next sync nonce from the EVVM contract using
              the <code>getNextCurrentSyncNonce</code> function.
            </div>
          </HelperInfo>
        )}
      </div>

      <Button
        onClick={makeSig}
        disabled={loading}
        loading={loading}
        style={{
          padding: '0.5rem',
          marginTop: '1rem',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Creating...' : 'Create signature'}
      </Button>

      <DataDisplayWithClear
        dataToGet={dataToGet}
        onClear={() => setDataToGet(null)}
        onExecute={executePayment}
      />
    </div>
  )
}
