// src/components/VerifyNFT.tsx
import React, { useState } from 'react'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useSnackbar } from 'notistack'

interface VerifyNFTProps {
  openModal: boolean
  setModalState: (open: boolean) => void
}

const VerifyNFT: React.FC<VerifyNFTProps> = ({ openModal, setModalState }) => {
  const [assetId, setAssetId] = useState('')
  const { enqueueSnackbar } = useSnackbar()

  const handleVerify = async () => {
    try {
      const algorand = AlgorandClient.testNet() // Or mainNet() later
      const assetInfo = await algorand.client.algod.getAssetByID(Number(assetId)).do()

      // ✅ Only check existence on-chain
      enqueueSnackbar(`✅ Asset exists! Asset Name: ${assetInfo.params.name}`, { variant: 'success' })
      setModalState(false)
    } catch (err) {
      enqueueSnackbar('❌ Asset not found or invalid ID', { variant: 'error' })
    }
  }

  if (!openModal) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Verify Credential</h2>
        <input
          type="text"
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          placeholder="Enter Asset ID"
          className="w-full border rounded-lg px-3 py-2 mb-4"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setModalState(false)}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>
          <button
            onClick={handleVerify}
            className="px-4 py-2 rounded-lg bg-green-600 text-white"
          >
            Verify
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyNFT
