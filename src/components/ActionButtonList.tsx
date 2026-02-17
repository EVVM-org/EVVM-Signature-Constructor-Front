'use client'
import { useDisconnect, useAppKit, useAppKitNetwork  } from '@reown/appkit/react'
import { networks } from '@/config'
import { Button } from '@mantine/core'

export const ActionButtonList = () => {
    const { disconnect } = useDisconnect();
    const { open } = useAppKit();
    const { switchNetwork } = useAppKitNetwork();

    const handleDisconnect = async () => {
      try {
        await disconnect();
      } catch (error) {
        console.error("Failed to disconnect:", error);
      }
    }
  return (
    <div>
        <Button onClick={() => open()}>Open</Button>
        <Button onClick={handleDisconnect}>Disconnect</Button>
        <Button onClick={() => switchNetwork(networks[1]) }>Switch</Button>
    </div>
  )
}
