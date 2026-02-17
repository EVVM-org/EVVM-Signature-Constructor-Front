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
  IAddCustomMetadataData,
  IPayData,
  NameService,
  Core,
  type ISerializableSignedAction,
} from '@evvm/evvm-js'
import { NameServiceComponentProps } from '@/types'
import { Button } from '@mantine/core'

type InfoData = {
  IPayData: ISerializableSignedAction<IPayData>
  IAddCustomMetadataData: ISerializableSignedAction<IAddCustomMetadataData>
}

export const AddCustomMetadataComponent = ({
  nameServiceAddress,
  coreAddress,
}: NameServiceComponentProps) => {
  const [priority, setPriority] = React.useState('high')
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null)
  const [amountToAddCustomMetadata, setAmountToAddCustomMetadata] =
    React.useState<bigint | null>(null)

  const getValue = (id: string) => {
    const el = document.getElementById(id) as HTMLInputElement | null
    if (!el) {
      throw new Error(
        `Input element with id '${id}' not found. Ensure the input is rendered and the id is correct.`
      )
    }
    return el.value
  }

  const makeSig = async () => {
    const formData = {
      addressNameService: nameServiceAddress,
      nonceNameService: getValue('nonceNameServiceInput_addCustomMetadata'),
      identity: getValue('identityInput_addCustomMetadata'),
      schema: getValue('schemaInput_addCustomMetadata'),
      subschema: getValue('subschemaInput_addCustomMetadata'),
      value: getValue('valueInput_addCustomMetadata'),
      priorityFeePay: true,
      nonceEVVM: getValue('nonceEVVMInput_addCustomMetadata'),
      isAsyncExec: priority === 'high',
    }

    const valueCustomMetadata = `${formData.schema}:${formData.subschema}>${formData.value}`

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

      await getPriceToAddCustomMetadata()

      const amount = amountToAddCustomMetadata
        ? BigInt(amountToAddCustomMetadata)
        : BigInt(5000000000000000000 * 10)

      // Sign EVVM payment first
      const payAction = await coreService.pay({
        toAddress: formData.addressNameService as `0x${string}`,
        tokenAddress:
          '0x0000000000000000000000000000000000000001' as `0x${string}`,
        amount: amount,
        priorityFee: BigInt(formData.priorityFeePay),
        nonce: BigInt(formData.nonceEVVM),
        isAsyncExec: formData.isAsyncExec,
        senderExecutor: formData.addressNameService as `0x${string}`,
      })

      // Sign add custom metadata action
      const addCustomMetadataAction =
        await nameServiceService.addCustomMetadata({
          identity: formData.identity,
          value: valueCustomMetadata,
          nonce: BigInt(formData.nonceNameService),
          evvmSignedAction: payAction,
        })

      setDataToGet({
        IPayData: payAction.toJSON(),
        IAddCustomMetadataData: addCustomMetadataAction.toJSON(),
      })
    } catch (error) {
      console.error('Error creating signature:', error)
    }
  }

  const getPriceToAddCustomMetadata = async () => {
    // Use nameServiceAddress from props, not input
    if (!nameServiceAddress) {
      setAmountToAddCustomMetadata(null)
    } else {
      await readContract(config, {
        abi: NameServiceABI,
        address: nameServiceAddress as `0x${string}`,
        functionName: 'getPriceToAddCustomMetadata',
        args: [],
      })
        .then((price) => {
          console.log('Price to add custom metadata:', price)
          setAmountToAddCustomMetadata(price ? BigInt(price.toString()) : null)
        })
        .catch((error) => {
          console.error('Error reading price to add custom metadata:', error)
          setAmountToAddCustomMetadata(null)
        })
    }
  }

  const executeAction = async () => {
    if (!dataToGet) {
      console.error('No data to execute payment')
      return
    }

    try {
      const signer = await getEvvmSigner()
      await execute(signer, dataToGet.IAddCustomMetadataData)
      console.log('Add custom metadata executed successfully')
      setDataToGet(null)
    } catch (error) {
      console.error('Error executing add custom metadata:', error)
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Add custom metadata of identity"
        link="https://www.evvm.info/docs/SignatureStructures/NameService/addCustomMetadataStructure"
      />

      <br />

      <NumberInputWithGenerator
        label="NameService Nonce"
        inputId="nonceNameServiceInput_addCustomMetadata"
        placeholder="Enter nonce"
      />

      <TextInputField
        label="Identity"
        inputId="identityInput_addCustomMetadata"
        placeholder="Enter identity"
      />

      <TextInputField
        label="Schema"
        inputId="schemaInput_addCustomMetadata"
        placeholder="Enter schema"
      />

      <TextInputField
        label="Subschema"
        inputId="subschemaInput_addCustomMetadata"
        placeholder="Enter subschema"
      />

      <TextInputField
        label="Value"
        inputId="valueInput_addCustomMetadata"
        placeholder="Enter value"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_addCustomMetadata"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="Core (pay) Async Nonce"
        inputId="nonceEVVMInput_addCustomMetadata"
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
