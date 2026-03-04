import { useCallback } from 'react'

/**
 * Hook para leer valores de inputs de forma segura
 */
export const useFormValues = () => {
  const getValue = useCallback((id: string): string => {
    const element = document.getElementById(id) as HTMLInputElement | null
    if (!element) {
      throw new Error(`Input element with id "${id}" not found`)
    }
    return element.value
  }, [])

  const getValueSafe = useCallback((id: string): string | null => {
    const element = document.getElementById(id) as HTMLInputElement | null
    return element?.value ?? null
  }, [])

  const getValues = useCallback((ids: string[]): Record<string, string> => {
    const values: Record<string, string> = {}
    for (const id of ids) {
      values[id] = getValue(id)
    }
    return values
  }, [getValue])

  const validateRequired = useCallback((ids: string[]): boolean => {
    for (const id of ids) {
      const value = getValueSafe(id)
      if (!value || value.trim() === '') {
        console.error(`Field with id "${id}" is required`)
        return false
      }
    }
    return true
  }, [getValueSafe])

  return {
    getValue,
    getValueSafe,
    getValues,
    validateRequired,
  }
}
