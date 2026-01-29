'use client'
import React from 'react'
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
  ICancelOrderData,
  P2PSwap,
  EVVM,
  type ISerializableSignedAction,
} from '@evvm/evvm-js'
import { MATE_TOKEN_ADDRESS } from '@/utils/constants'

interface CancelOrderComponentProps {
  p2pSwapAddress: string
}

export const CancelOrderComponent = ({
  p2pSwapAddress,
}: CancelOrderComponentProps) => {
  const [priority, setPriority] = React.useState('low')
  const [dataToGet, setDataToGet] = React.useState<ISerializableSignedAction<ICancelOrderData> | null>(
    null
  )

  /**
   * Create the signature, prepare data to make the function call
   */
  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value

    // retrieve variables from inputs
    // todo: replace this approach with actual state usage
    const nonce = BigInt(getValue('nonceInput_CancelOrder'))
    const tokenA = getValue('tokenA_CancelOrder') as `0x${string}`
    const tokenB = getValue('tokenB_CancelOrder') as `0x${string}`
    const orderId = BigInt(getValue('orderId_CancelOrder'))
    const priorityFee = BigInt(getValue('priorityFee_CancelOrder'))
    const nonce_EVVM = BigInt(getValue('nonce_EVVM_CancelOrder'))

    try {
      const signer = await getEvvmSigner()
      
      // Create EVVM service for payment
      const evvmService = new EVVM({
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
      const payAction = await evvmService.pay({
        to: p2pSwapAddress,
        tokenAddress: MATE_TOKEN_ADDRESS as `0x${string}`,
        amount: 0n,
        priorityFee: priorityFee,
        nonce: nonce_EVVM,
        priorityFlag: priority === 'high',
        executor: p2pSwapAddress as `0x${string}`,
      })

      // create p2pswap cancelOrder() signature
      const cancelOrderAction = await p2pSwapService.cancelOrder({
        nonce: nonce,
        tokenA: tokenA,
        tokenB: tokenB,
        orderId: orderId,
        evvmSignedAction: payAction,
      })

      // prepare data to execute transaction (send it to state)
      setDataToGet(cancelOrderAction.toJSON())
    } catch (error) {
      console.error('Error creating signature:', error)
    }
  }

  const executeAction = async () => {
    if (!dataToGet) {
      console.error('No data to execute cancelOrder')
      return
    }

    if (!p2pSwapAddress) {
      console.error('P2PSwap address is not provided')
      return
    }

    try {
      const signer = await getEvvmSigner()
      await execute(signer, dataToGet)
      console.log('Order cancelled successfully')
      setDataToGet(null)
    } catch (error) {
      console.error('Error executing transaction:', error)
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Cancel Order"
        link="https://www.evvm.info/docs/SignatureStructures/P2PSwap/CancelOrderSignatureStructure"
      />
      <br />

      <AddressInputField
        label="Token A address"
        inputId="tokenA_CancelOrder"
        placeholder="Enter token A address"
      />

      <AddressInputField
        label="Token B address"
        inputId="tokenB_CancelOrder"
        placeholder="Enter token B address"
      />

      {[
        {
          label: 'Order ID',
          id: 'orderId_CancelOrder',
          type: 'number',
        },
        {
          label: 'Priority fee (paid in MATE TOKEN)',
          id: 'priorityFee_CancelOrder',
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

      <PrioritySelector onPriorityChange={setPriority} />

      {/* Nonce section with automatic generator */}

      <NumberInputWithGenerator
        label="Nonce for P2PSwap"
        inputId="nonceInput_CancelOrder"
        placeholder="Enter nonce"
        showRandomBtn={true}
      />

      <NumberInputWithGenerator
        label="Nonce for EVVM contract interaction"
        inputId="nonce_EVVM_CancelOrder"
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
