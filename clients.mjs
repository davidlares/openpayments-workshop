import { createAuthenticatedClient } from '@interledger/open-payments'
import { join } from 'node:path'
import dotenv from 'dotenv'

dotenv.config({ path: join(process.cwd(), '.env') })

// client instance
const client = await createAuthenticatedClient({
  walletAddressUrl: process.env.WALLET_ADDRESS,
  privateKey: process.env.PRIVATE_KEY_PATH,
  keyId: process.env.KEY_ID,
});

export { client }