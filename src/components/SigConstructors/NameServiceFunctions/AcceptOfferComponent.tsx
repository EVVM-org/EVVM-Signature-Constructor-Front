'use client'
import React from 'react'
import { config } from '@/config/index'
import {
  TitleAndLink,
  NumberInputWithGenerator,
  PrioritySelector,
  DataDisplayWithClear,
  HelperInfo,
  NumberInputField,
  TextInputField,
} from '@/components/SigConstructors/InputsAndModules'
import { Button } from '@mantine/core'
import { execute } from '@evvm/evvm-js'
import { getEvvmSigner, getCurrentChainId } from '@/utils/evvm-signer'
import {
  IPayData,
  IAcceptOfferData,
  NameService,
  Core,
  type ISerializableSignedAction,
} from '@evvm/evvm-js'
import { NameServiceComponentProps } from '@/types'

type InfoData = {
  IPayData: ISerializableSignedAction<IPayData>
  IAcceptOfferData: ISerializableSignedAction<IAcceptOfferData>
}

export const AcceptOfferComponent = ({
  nameServiceAddress,
  coreAddress,
}: NameServiceComponentProps) => {
  const [priority, setPriority] = React.useState('high')
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null)

  const makeSig = async () => {
    const getValue = (id: string) =>
      (document.getElementById(id) as HTMLInputElement).value

    const formData = {
      username: getValue('usernameInput_acceptOffer'),
      offerId: getValue('offerIdInput_acceptOffer'),
      nonce: getValue('nonceInput_acceptOffer'),
      priorityFeePay: getValue('priorityFeePayInput_acceptOffer'),
      isAsyncExecPay: priority === 'high',
      noncePay: getValue('noncePayInput_acceptOffer'),
    }

    try {
      const signer = await getEvvmSigner()

      // Create Core service for payment
      const coreService = new Core({
        signer,
        address: coreAddress as `0x${string}`,
        chainId: getCurrentChainId(),
      })

      // Create NameService service
      const nameServiceService = new NameService({
        signer,
        address: nameServiceAddress as `0x${string}`,
        chainId: getCurrentChainId(),
      })

      // Sign EVVM payment first
      const payAction = await coreService.pay({
        toAddress: nameServiceAddress as `0x${string}`,
        tokenAddress:
          '0x0000000000000000000000000000000000000001' as `0x${string}`,
        amount: BigInt(0),
        priorityFee: BigInt(formData.priorityFeePay),
        nonce: BigInt(formData.noncePay),
        isAsyncExec: true,
        senderExecutor: nameServiceAddress as `0x${string}`,
      })

      // Sign accept offer action
      const acceptOfferAction = await nameServiceService.acceptOffer({
        username: formData.username,
        offerID: BigInt(formData.offerId),
        nonce: BigInt(formData.nonce),
        evvmSignedAction: payAction,
      })

      setDataToGet({
        IPayData: payAction.toJSON(),
        IAcceptOfferData: acceptOfferAction.toJSON(),
      })
    } catch (error) {
      console.error('Error signing accept offer:', error)
    }
  }

  const executeAction = async () => {
    if (!dataToGet) {
      console.error('No data to execute payment')
      return
    }

    try {
      const signer = await getEvvmSigner()
      await execute(signer, dataToGet.IAcceptOfferData)
      console.log('Accept offer executed successfully')
      setDataToGet(null)
    } catch (error) {
      console.error('Error executing accept offer:', error)
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Accept offer of username"
        link="https://www.evvm.info/docs/SignatureStructures/NameService/acceptOfferStructure"
      />

      <br />

      <NumberInputWithGenerator
        label="NameService Nonce"
        inputId="nonceInput_acceptOffer"
        placeholder="Enter nonce"
      />

      <TextInputField
        label="Username"
        inputId="usernameInput_acceptOffer"
        placeholder="Enter username"
      />

      <NumberInputField
        label="Offer ID"
        inputId="offerIdInput_acceptOffer"
        placeholder="Enter offer ID"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeePayInput_acceptOffer"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="Core (pay) Async Nonce"
        inputId="noncePayInput_acceptOffer"
        placeholder="Enter nonce"
        showRandomBtn={true}
      />

      {/* Create signature button */}
      <Button
        onClick={makeSig}
        style={{
          padding: '0.5rem',
          marginTop: '1rem',
        }}
      >
        Create signature
      </Button>

      <DataDisplayWithClear
        dataToGet={dataToGet}
        onClear={() => setDataToGet(null)}
        onExecute={executeAction}
      />
    </div>
  )
}
