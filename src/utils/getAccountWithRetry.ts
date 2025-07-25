import { getAccount } from "@wagmi/core";

/**
 * Obtiene la cuenta con reintentos si la address está indefinida.
 * @param config wagmi config
 * @param maxAttempts número máximo de intentos (default: 10)
 * @param intervalMs intervalo entre intentos en ms (default: 200)
 * @returns Promise con el objeto de cuenta o null si falla
 */
export async function getAccountWithRetry(config: any, maxAttempts = 10, intervalMs = 200): Promise<ReturnType<typeof getAccount> | null> {
  let attempts = 0;
  let walletData = getAccount(config);

  while (!walletData.address && attempts < maxAttempts) {
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    attempts++;
    walletData = getAccount(config);
  }

  if (!walletData.address) {
    console.error("Account address is still undefined after retries");
    return null;
  }

  return walletData;
}
