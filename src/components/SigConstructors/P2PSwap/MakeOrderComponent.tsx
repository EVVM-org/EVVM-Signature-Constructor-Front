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
  IMakeOrderData,
  P2PSwap,
  EVVM,
  type ISerializableSignedAction,
} from '@evvm/evvm-js'

interface MakeOrderComponentProps {
  p2pSwapAddress: string
}

export const MakeOrderComponent = ({
  p2pSwapAddress,
}: MakeOrderComponentProps) => {
  const [priority, setPriority] = React.useState('low')
  const [dataToGet, setDataToGet] = React.useState<ISerializableSignedAction<IMakeOrderData> | null>(
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
    const nonce = BigInt(getValue('nonceInput_MakeOrder'))
    const tokenA = getValue('tokenA_MakeOrder') as `0x${string}`
    const tokenB = getValue('tokenB_MakeOrder') as `0x${string}`
    const amountA = BigInt(getValue('amountA_MakeOrder'))
    const amountB = BigInt(getValue('amountB_MakeOrder'))
    const priorityFee = BigInt(getValue('priorityFee_MakeOrder'))
    const nonce_EVVM = BigInt(getValue('nonce_EVVM_MakeOrder'))

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
        tokenAddress: tokenA,
        amount: amountA,
        priorityFee: priorityFee,
        nonce: nonce_EVVM,
        priorityFlag: priority === 'high',
        executor: p2pSwapAddress as `0x${string}`,
      })

      // create p2pswap makeOrder() signature
      const makeOrderAction = await p2pSwapService.makeOrder({
        nonce: nonce,
        tokenA: tokenA,
        tokenB: tokenB,
        amountA: amountA,
        amountB: amountB,
        evvmSignedAction: payAction,
      })

      // prepare data to execute transaction (send it to state)
      setDataToGet(makeOrderAction.toJSON())
    } catch (error) {
      console.error('Error creating signature:', error)
    }
  }

  const executeAction = async () => {
    if (!dataToGet) {
      console.error('No data to execute makeOrder')
      return
    }

    if (!p2pSwapAddress) {
      console.error('P2PSwap address is not provided')
      return
    }

    try {
      const signer = await getEvvmSigner()
      await execute(signer, dataToGet)
      console.log('Order created successfully')
      setDataToGet(null)
    } catch (error) {
      console.error('Error executing order:', error)
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      {!p2pSwapAddress && (
        <strong style={{ color: 'red' }}>
          Must provide a valid P2P Swap Contract address to use these functions
        </strong>
      )}
      <TitleAndLink
        title="Make Order"
        link="https://www.evvm.info/docs/SignatureStructures/P2PSwap/MakeOrderSignatureStructure"
      />
      <br />

      <AddressInputField
        label="Token A address"
        inputId="tokenA_MakeOrder"
        placeholder="Enter token A address"
      />

      <AddressInputField
        label="Token B address"
        inputId="tokenB_MakeOrder"
        placeholder="Enter token B address"
      />

      {[
        { label: 'Amount of token A', id: 'amountA_MakeOrder', type: 'number' },
        { label: 'Amount of token B', id: 'amountB_MakeOrder', type: 'number' },
        { label: 'Priority fee', id: 'priorityFee_MakeOrder', type: 'number' },
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
        inputId="nonceInput_MakeOrder"
        placeholder="Enter nonce"
        showRandomBtn={true}
      />

      <NumberInputWithGenerator
        label="Nonce for EVVM contract interaction"
        inputId="nonce_EVVM_MakeOrder"
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
