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
import { Button } from '@mantine/core'
import { execute } from '@evvm/evvm-js'
import { getEvvmSigner, getCurrentChainId } from '@/utils/evvm-signer'
import { NameServiceABI, CoreABI } from '@evvm/evvm-js'
import {
  IPayData,
  IRegistrationUsernameData,
  NameService,
  Core,
  type ISerializableSignedAction,
} from '@evvm/evvm-js'
import { NameServiceComponentProps } from '@/types'

type InfoData = {
  IPayData: ISerializableSignedAction<IPayData>
  IRegistrationUsernameData: ISerializableSignedAction<IRegistrationUsernameData>
}

export const RegistrationUsernameComponent = ({
  nameServiceAddress,
  coreAddress,
}: NameServiceComponentProps) => {
  const [priority, setPriority] = React.useState('high')
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null)
  const [rewardAmount, setRewardAmount] = React.useState<bigint | null>(null)
  const [registrationPrice, setRegistrationPrice] = React.useState<
    bigint | null
  >(null)

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
      nonceNameService: getValue('nonceNameServiceInput_registrationUsername'),
      username: getValue('usernameInput_registrationUsername'),
      lockNumber: getValue('lockNumberInput_registrationUsername'),
      priorityFeePay: getValue('priorityFeeInput_registrationUsername'),
      nonceEVVM: getValue('nonceEVVMInput_registrationUsername'),
      isAsyncExec: priority === 'high',
    }

    // Validate that required fields are not empty
    if (!formData.username) {
      throw new Error('Username is required')
    }
    if (!formData.nonceNameService) {
      throw new Error('NameService nonce is required')
    }
    if (!formData.lockNumber) {
      throw new Error('Lock number is required')
    }
    if (!formData.nonceEVVM) {
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

      // Ensure we have latest rewardAmount (fallback) and read price for the username
      await readRewardAmount()
      const priceFromContract = await readRegistrationPrice(formData.username)

      // Sign EVVM payment first — use getPriceOfRegistration result when available
      const payAmount =
        priceFromContract ??
        (rewardAmount ? rewardAmount * BigInt(100) : BigInt(0))

      const payAction = await coreService.pay({
        toAddress: formData.addressNameService as `0x${string}`,
        tokenAddress:
          '0x0000000000000000000000000000000000000001' as `0x${string}`,
        amount: payAmount,
        priorityFee: BigInt(formData.priorityFeePay),
        nonce: BigInt(formData.nonceEVVM),
        isAsyncExec: formData.isAsyncExec,
        senderExecutor: formData.addressNameService as `0x${string}`,
      })

      // Sign registration username action
      const registrationAction = await nameServiceService.registrationUsername({
        username: formData.username,
        lockNumber: BigInt(formData.lockNumber),
        nonce: BigInt(formData.nonceNameService),
        evvmSignedAction: payAction,
      })

      setDataToGet({
        IPayData: payAction.toJSON(),
        IRegistrationUsernameData: registrationAction.toJSON(),
      })
    } catch (error) {
      console.error('Error creating signatures:', error)
    }
  }

  const readRewardAmount = async () => {
    // Use the prop directly instead of a missing input
    if (!nameServiceAddress) {
      setRewardAmount(null)
    } else {
      await readContract(config, {
        abi: NameServiceABI,
        address: nameServiceAddress as `0x${string}`,
        functionName: 'getCoreAddress',
        args: [],
      })
        .then((coreAddress) => {
          if (!coreAddress) {
            setRewardAmount(null)
          }

          readContract(config, {
            abi: CoreABI,
            address: coreAddress as `0x${string}`,
            functionName: 'getRewardAmount',
            args: [],
          })
            .then((reward) => {
              console.log('Mate reward amount:', reward)
              setRewardAmount(reward ? BigInt(reward.toString()) : null)
            })
            .catch((error) => {
              console.error('Error reading mate reward amount:', error)
              setRewardAmount(null)
            })
        })
        .catch((error) => {
          console.error('Error reading NameService address:', error)
          setRewardAmount(null)
        })
    }
  }

  const readRegistrationPrice = async (username: string) => {
    if (!nameServiceAddress || !username) {
      setRegistrationPrice(null)
      return null
    }

    try {
      const price = await readContract(config, {
        abi: NameServiceABI,
        address: nameServiceAddress as `0x${string}`,
        functionName: 'getPriceOfRegistration',
        args: [username],
      })
      const val = price ? BigInt(price.toString()) : null
      console.log('getPriceOfRegistration ->', username, val)
      setRegistrationPrice(val)
      return val
    } catch (err) {
      console.error('Error reading getPriceOfRegistration:', err)
      setRegistrationPrice(null)
      return null
    }
  }

  const executeAction = async () => {
    if (!dataToGet) {
      console.error('No data to execute payment')
      return
    }

    try {
      const signer = await getEvvmSigner()
      await execute(signer, dataToGet.IRegistrationUsernameData)
      console.log('Registration username executed successfully')
      setDataToGet(null)
    } catch (error) {
      console.error('Error executing registration username:', error)
    }
  }

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Registration of username"
        link="https://www.evvm.info/docs/SignatureStructures/NameService/registrationUsernameStructure"
      />

      <br />

      <p>
        This functionality is not considering username offers to calculate
        registration fees. We acknowledge that this functionality is needed to
        avoid reentrancy renewal attacks to avoid paying the demand based
        renewal fee.
      </p>
      <br />

      <NumberInputWithGenerator
        label="NameService Nonce"
        inputId="nonceNameServiceInput_registrationUsername"
        placeholder="Enter nonce"
      />

      <NumberInputField
        label="Lock Number"
        inputId="lockNumberInput_registrationUsername"
        placeholder="Enter clow number"
      />

      <TextInputField
        label="Username"
        inputId="usernameInput_registrationUsername"
        placeholder="Enter username"
      />

      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <strong>Calculated registration price:</strong>{' '}
        {registrationPrice !== null ? registrationPrice.toString() : '—'}
        <Button
          onClick={async () => {
            const el = document.getElementById(
              'usernameInput_registrationUsername'
            ) as HTMLInputElement | null
            if (!el) return
            await readRegistrationPrice(el.value)
          }}
          style={{ marginLeft: 12, padding: '4px 8px', fontSize: 12 }}
        >
          Refresh price
        </Button>
      </div>

      <NumberInputField
        label="Priority fee"
        inputId="priorityFeeInput_registrationUsername"
        placeholder="Enter priority fee"
      />
      <NumberInputWithGenerator
        label="Core (pay) Async Nonce"
        inputId="nonceEVVMInput_registrationUsername"
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
