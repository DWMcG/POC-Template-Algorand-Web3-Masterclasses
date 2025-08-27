// src/utils/credentialStorage.ts
import algosdk from 'algosdk'
import { getAlgodClient } from '@algorandfoundation/algokit-utils'

/**
 * Store a credential JSON on-chain.
 * For PoC we’ll just put the JSON string in a note field of a 0-ALGO tx.
 */
export async function storeCredentialOnChain(credential: any, sender: string) {
  const algod = getAlgodClient()
  const params = await algod.getTransactionParams().do()

  const note = new TextEncoder().encode(JSON.stringify(credential))

  const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: sender,
    to: sender, // self-payment, just to anchor note
    amount: 0,
    suggestedParams: params,
    note,
  })

  // You’ll need to sign with wallet provider
  // @txnlab/use-wallet-react gives you sign/send hooks
  // Placeholder: integrate sign/send here
  console.log('Transaction ready to send with note:', txn)
}
