import { useState, useCallback } from 'react'
import { getEvvmSigner } from '@/utils/evvm-signer'

export interface SignatureExecutionOptions<TData = any> {
  onBuildSignature: () => Promise<TData>
  onExecute?: (data: TData) => Promise<void>
}

/**
 * Hook para manejar la lógica común de creación y ejecución de firmas
 */
export const useSignatureExecution = <TData = any>() => {
  const [loading, setLoading] = useState(false)
  const [dataToGet, setDataToGet] = useState<TData | null>(null)

  const buildSignature = useCallback(async (
    builder: () => Promise<TData>
  ) => {
    setLoading(true)
    try {
      const data = await builder()
      setDataToGet(data)
      return data
    } catch (error) {
      console.error('Error building signature:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const executeSignature = useCallback(async (
    executor: (data: TData) => Promise<void>,
    data?: TData
  ) => {
    const signatureData = data ?? dataToGet
    if (!signatureData) {
      console.error('No signature data available')
      return
    }

    setLoading(true)
    try {
      await executor(signatureData)
    } catch (error) {
      console.error('Error executing signature:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [dataToGet])

  const clearData = useCallback(() => {
    setDataToGet(null)
  }, [])

  const getSigner = useCallback(async () => {
    try {
      return await getEvvmSigner()
    } catch (error) {
      console.error('Error getting signer:', error)
      throw error
    }
  }, [])

  return {
    loading,
    dataToGet,
    buildSignature,
    executeSignature,
    clearData,
    getSigner,
  }
}
