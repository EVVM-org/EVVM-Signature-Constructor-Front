import { createSignerWithViem } from "@evvm/evvm-js";
import { getWalletClient, getChainId } from "wagmi/actions";
import { config } from "@/config";

export async function getEvvmSigner() {
  const walletClient = await getWalletClient(config);
  if (!walletClient) {
    throw new Error("Wallet not connected");
  }
  return createSignerWithViem(walletClient);
}

export function getCurrentChainId(): number {
  return getChainId(config);
}
