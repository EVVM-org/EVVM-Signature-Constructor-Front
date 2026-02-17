'use client'
import React from 'react'
import { config } from '@/config/index'
import { readContract } from '@wagmi/core'
import {
  TitleAndLink,
  NumberInputWithGenerator,
  PrioritySelector,
  DataDisplayWithClear,
  HelperInfo,
  NumberInputField,
  TextInputField,
} from '@/components/SigConstructors/InputsAndModules'
import { execute } from '@evvm/evvm-js'
import { getEvvmSigner, getCurrentChainId } from '@/utils/evvm-signer'
import { NameServiceABI } from '@evvm/evvm-js'
import {
  IPayData,
  IFlushUsernameData,
  NameService,
  Core,
  type ISerializableSignedAction,
} from '@evvm/evvm-js'
import { NameServiceComponentProps } from '@/types'
import { Button } from '@mantine/core'

type InfoData = {
  IPayData: ISerializableSignedAction<IPayData>
  IFlushUsernameData: ISerializableSignedAction<IFlushUsernameData>
}

export const FlushUsernameComponent = ({
  nameServiceAddress,
  coreAddress,
}: NameServiceComponentProps) => {
  const [priority, setPriority] = React.useState('high')
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null)

  const getValue = (id: string) =>
    (document.getElementById(id) as HTMLInputElement).value

  const makeSig = async () => {
    const formData = {
      addressNameService: nameServiceAddress,
      nonceNameService: getValue('nonceNameServiceInput_flushUsername'),
      username: getValue('usernameInput_flushUsername'),
      priorityFeePay: getValue('priorityFeeInput_flushUsername'),
      noncePay: getValue('nonceEVVMInput_flushUsername'),
      isAsyncExecPay: priority === 'high',
    }

    try {
      const signer = await getEvvmSigner()

      // Create EVVM service for payment
      const coreService = new Core({
        signer,
        address: coreAddress as `0x${string}`,
        chainId: getCurrentChainId(),
      })

      // Create NameService service
      const nameServiceService = new NameService({
        signer,
        address: formData.addressNameService as `0x${string}`,
        chainId: getCurrentChainId(),
      })

      const priceToFlushUsername = await readContract(config, {
        abi: NameServiceABI,
        address: formData.addressNameService as `0x${string}`,
        functionName: 'getPriceToFlushUsername',
        args: [formData.username],
      })
      if (!priceToFlushUsername) {
        console.error('Price to remove custom metadata is not available')
        return
      }

      // Sign EVVM payment first
      const payAction = await coreService.pay({
        toAddress: formData.addressNameService as `0x${string}`,
        tokenAddress:
          '0x0000000000000000000000000000000000000001' as `0x${string}`,
        amount: priceToFlushUsername as bigint,
        priorityFee: BigInt(formData.priorityFeePay),
        nonce: BigInt(formData.noncePay),
        isAsyncExec: true,
        senderExecutor: formData.addressNameService as `0x${string}`,
      })

      // Sign flush username action
      const flushUsernameAction = await nameServiceService.flushUsername({
        username: formData.username,
        nonce: BigInt(formData.nonceNameService),
        evvmSignedAction: payAction,
      })

      setDataToGet({
        IPayData: payAction.toJSON(),
        IFlushUsernameData: flushUsernameAction.toJSON(),
      })
    } catch (error) {
      console.error('Error creating signature:', error)
    }
  }

  const executeAction = async () => {
    if (!dataToGet) {
      console.error('No data to execute payment')
      return
    }

    try {
      const signer = await getEvvmSigner()
      await execute(signer, dataToGet.IFlushUsernameData)
      console.log('Flush username executed successfully')
      setDataToGet(null)
    } catch (error) {
      console.error('Error executing flush username:', error)
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Delete Username"
        link="https://www.evvm.info/docs/SignatureStructures/NameService/flushUsernameStructure"
      />
      <br />
      <p>
        This function deletes all metadata associated with a username but does
        not remove the offers made on that username.
      </p>
      <br />

      {/* Nonce section with automatic generator */}

      <NumberInputWithGenerator
        label="NameService Nonce"
        inputId="nonceNameServiceInput_flushUsername"
        placeholder="Enter nonce"
      />

      <TextInputField
        label="Identity"
        inputId="usernameInput_flushUsername"
        placeholder="Enter username"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_flushUsername"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="Core (pay) Async Nonce"
        inputId="nonceEVVMInput_flushUsername"
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
