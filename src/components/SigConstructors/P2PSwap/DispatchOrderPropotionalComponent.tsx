'use client'
import React, { useMemo } from 'react'
import {
  TitleAndLink,
  NumberInputWithGenerator,
  AddressInputField,
  PrioritySelector,
  DataDisplayWithClear,
  HelperInfo,
} from '@/components/SigConstructors/InputsAndModules'

import { execute } from '@evvm/evvm-js'
import { getEvvmSigner, getCurrentChainId } from '@/utils/evvm-signer'
import {
  IDispatchOrderData,
  P2PSwap,
  Core,
  type ISerializableSignedAction,
} from '@evvm/evvm-js'

interface DispatchOrderFillPropotionalFeeComponentProps {
  p2pSwapAddress: string
}

export const DispatchOrderFillPropotionalFeeComponent = ({
  p2pSwapAddress,
}: DispatchOrderFillPropotionalFeeComponentProps) => {
  const [priority, setPriority] = React.useState('low')
  const [amountB, setAmountB] = React.useState(0n)
  const [dataToGet, setDataToGet] =
    React.useState<ISerializableSignedAction<IDispatchOrderData> | null>(null)

  const fee: bigint = useMemo(
    () => (amountB * 500n) / 10_000n,
    [amountB]
  )

  /**
   * Create the signature, prepare data to make the function call
   */
  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value

    // retrieve variables from inputs
    // todo: replace this approach with actual state usage
    const nonce = BigInt(getValue('nonceInput_DispatchOrderFillPropotionalFee'))
    const tokenA = getValue(
      'tokenA_DispatchOrderFillPropotionalFee'
    ) as `0x${string}`
    const tokenB = getValue(
      'tokenB_DispatchOrderFillPropotionalFee'
    ) as `0x${string}`
    const amountB = BigInt(getValue('amountB_DispatchOrderFillPropotionalFee'))
    const orderId = BigInt(getValue('orderId_DispatchOrderFillPropotionalFee'))
    const priorityFee = BigInt(
      getValue('priorityFee_DispatchOrderFillPropotionalFee')
    )
    const noncePay = BigInt(
      getValue('noncePay_DispatchOrderFillPropotionalFee')
    )

    const amountOfTokenBToFill = amountB + fee

    try {
      const signer = await getEvvmSigner()
      
      // Create EVVM service for payment
      const coreService = new Core({
        signer,
        address: p2pSwapAddress as `0x${string}`,
        chainId: getCurrentChainId(),
      })
      
      // Create P2PSwap service
      const p2pSwapService = new P2PSwap({
        signer,
        address: p2pSwapAddress as `0x${string}`,
        chainId: getCurrentChainId(),
      })

      // create evvm pay() signature
      const payAction = await coreService.pay({
        toAddress: p2pSwapAddress as `0x${string}`,
        tokenAddress: tokenB,
        amount: amountOfTokenBToFill,
        priorityFee: priorityFee,
        nonce: noncePay,
        isAsyncExec: priority === 'high',
        senderExecutor: p2pSwapAddress as `0x${string}`,
      })

      // create p2pswap dispatchOrderFillPropotionalFee() signature
      const dispatchOrderAction = await p2pSwapService.dispatchOrder_fillPropotionalFee({
        nonce: nonce,
        tokenA: tokenA,
        tokenB: tokenB,
        orderId: orderId,
        amountOfTokenBToFill: amountOfTokenBToFill,
        evvmSignedAction: payAction,
      })
      if (!fee) throw new Error('Error calculating fee')

      // prepare data to execute transaction (send it to state)
      setDataToGet(dispatchOrderAction.toJSON())
    } catch (error) {
      console.error('Error creating signature:', error)
    }
  }

  const executeAction = async () => {
    if (!dataToGet) {
      console.error('No data to execute dispatchOrderFillPropotionalFee')
      return
    }

    if (!p2pSwapAddress) {
      console.error('P2PSwap address is not provided')
      return
    }

    try {
      const signer = await getEvvmSigner()
      await execute(signer, dataToGet)
      console.log('Order dispatched successfully')
      setDataToGet(null)
    } catch (error) {
      console.error('Error executing transaction:', error)
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Dispatch Order (with proportional fee)"
        link="https://www.evvm.info/docs/SignatureStructures/P2PSwap/DispatchOrderSignatureStructure"
      />
      <br />

      <AddressInputField
        label="Token A address"
        inputId="tokenA_DispatchOrderFillPropotionalFee"
        placeholder="Enter token A address"
      />

      <AddressInputField
        label="Token B address"
        inputId="tokenB_DispatchOrderFillPropotionalFee"
        placeholder="Enter token B address"
      />

      {[
        {
          label: 'Order ID',
          id: 'orderId_DispatchOrderFillPropotionalFee',
          type: 'number',
        },
        {
          label: 'Priority fee',
          id: 'priorityFee_DispatchOrderFillPropotionalFee',
          type: 'number',
        },
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

      <div style={{ marginBottom: '1rem' }}>
        <p>Amount of token B to fill</p>
        <div className="flex">
          <input
            type="number"
            placeholder="Enter amount of token b to fill"
            id="amountB_DispatchOrderFillPropotionalFee"
            style={{
              color: 'black',
              backgroundColor: 'white',
              height: '2rem',
              width: '25rem',
            }}
            onInput={(e) => setAmountB(BigInt(e.currentTarget.value))}
          />
        </div>
      </div>

      <PrioritySelector onPriorityChange={setPriority} />

      {/* Nonce section with automatic generator */}

      <NumberInputWithGenerator
        label="Nonce for P2PSwap"
        inputId="nonceInput_DispatchOrderFillPropotionalFee"
        placeholder="Enter nonce"
        showRandomBtn={true}
      />

      <NumberInputWithGenerator
        label="Nonce for EVVM contract interaction"
        inputId="noncePay_DispatchOrderFillPropotionalFee"
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

      {/* Create signature button */}
      <button
        onClick={makeSig}
        style={{
          padding: '0.5rem',
          marginTop: '1rem',
        }}
      >
        Create signature
      </button>

      {/* Results section */}
      <DataDisplayWithClear
        dataToGet={dataToGet}
        onClear={() => setDataToGet(null)}
        onExecute={executeAction}
      />
    </div>
  )
}
