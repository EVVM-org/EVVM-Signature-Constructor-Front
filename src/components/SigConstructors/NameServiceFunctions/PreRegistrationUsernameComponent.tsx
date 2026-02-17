'use client'
import React from 'react'
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
import { keccak256 } from 'viem'
import {
  IPayData,
  IPreRegistrationUsernameData,
  NameService,
  Core,
  type ISerializableSignedAction,
} from '@evvm/evvm-js'
import { NameServiceComponentProps } from '@/types'

type InfoData = {
  IPayData: ISerializableSignedAction<IPayData>
  IPreRegistrationUsernameData: ISerializableSignedAction<IPreRegistrationUsernameData>
}

export const PreRegistrationUsernameComponent = ({
  nameServiceAddress,
  coreAddress,
}: NameServiceComponentProps) => {
  const [priority, setPriority] = React.useState('low')
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null)

  const makeSig = async () => {
    const getValue = (id: string) => {
      const el = document.getElementById(id) as HTMLInputElement | null
      if (!el) {
        throw new Error(
          `Input element with id '${id}' not found. Ensure the input is rendered and the id is correct.`
        )
      }
      return el.value
    }

    const formData = {
      addressNameService: nameServiceAddress,
      username: getValue('usernameInput_preRegistration'),
      nonce: getValue('nonceNameServiceInput_preRegistration'),
      lockNumber: getValue('lockNumberInput_preRegistration'),
      noncePay: getValue('nonceEVVMInput_preRegistration'),
      priorityFeePay: getValue('priorityFeeInput_preRegistration'),
      isAsyncExecPay: priority === 'high',
    }

    // Validate that required fields are not empty
    if (!formData.username) {
      throw new Error('Username is required')
    }
    if (!formData.nonce) {
      throw new Error('NameService nonce is required')
    }
    if (!formData.lockNumber) {
      throw new Error('Lock number is required')
    }
    if (!formData.noncePay) {
      throw new Error('EVVM nonce is required')
    }
    if (!formData.priorityFeePay) {
      throw new Error('Priority fee is required')
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

      // Sign EVVM payment first
      const payAction = await coreService.pay({
        toAddress: formData.addressNameService as `0x${string}`,
        tokenAddress:
          '0x0000000000000000000000000000000000000001' as `0x${string}`,
        amount: BigInt(0),
        priorityFee: BigInt(formData.priorityFeePay),
        nonce: BigInt(formData.noncePay),
        isAsyncExec: formData.isAsyncExecPay,
        senderExecutor: formData.addressNameService as `0x${string}`,
      })

      // Hash the username + lockNumber for pre-registration (keccak256 -> bytes32)
      const hashUsername = keccak256(
        new TextEncoder().encode(`${formData.username}${formData.lockNumber}`)
      )

      // Sign pre-registration action
      const preRegistrationAction =
        await nameServiceService.preRegistrationUsername({
          hashPreRegisteredUsername: hashUsername,
          nonce: BigInt(formData.nonce),
          evvmSignedAction: payAction,
        })

      setDataToGet({
        IPayData: payAction.toJSON(),
        IPreRegistrationUsernameData: preRegistrationAction.toJSON(),
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
      await execute(signer, dataToGet.IPreRegistrationUsernameData)
      console.log('Pre-registration username executed successfully')
      setDataToGet(null)
    } catch (error) {
      console.error('Error executing pre-registration username:', error)
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Pre-registration of username"
        link="https://www.evvm.info/docs/SignatureStructures/NameService/preRegistrationUsernameStructure"
      />
      <br />
      <p>
        If this name was registered before is possible that you need to flush
        the custom metadata
      </p>
      <br />
      {/* Address Input */}

      {/* Nonce section with automatic generator */}

      <NumberInputWithGenerator
        label="Lock Number"
        inputId="lockNumberInput_preRegistration"
        placeholder="Enter clow number"
      />

      {/* Basic input fields */}

      <TextInputField
        label="Username"
        inputId="usernameInput_preRegistration"
        placeholder="Enter username"
      />

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_preRegistration"
        placeholder="Enter priority fee"
      />

      <NumberInputWithGenerator
        label="NameService Nonce"
        inputId="nonceNameServiceInput_preRegistration"
        placeholder="Enter nonce"
      />

      {/* Priority configuration */}
      <PrioritySelector onPriorityChange={setPriority} />

      <NumberInputWithGenerator
        label="EVVM Nonce"
        inputId="nonceEVVMInput_preRegistration"
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

      <DataDisplayWithClear
        dataToGet={dataToGet}
        onClear={() => setDataToGet(null)}
        onExecute={executeAction}
      />
    </div>
  )
}
