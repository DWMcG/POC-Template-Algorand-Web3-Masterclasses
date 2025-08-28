// src/components/VerifyCredentialModal.tsx
import React from 'react'

interface VerifyCredentialModalProps {
  open: boolean
  onClose: () => void
  credentialData: {
    companyName?: string
    logo?: string
    position?: string
    startDate?: string
    endDate?: string
  }
}

const VerifyCredentialModal: React.FC<VerifyCredentialModalProps> = ({ open, onClose, credentialData }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
        <h2 className="text-xl font-bold mb-4">Verified Credential</h2>

        {credentialData.logo && (
          <img src={credentialData.logo} alt="Company Logo" className="w-24 h-24 mb-4 mx-auto" />
        )}
        <p><strong>Company:</strong> {credentialData.companyName || 'N/A'}</p>
        <p><strong>Position:</strong> {credentialData.position || 'N/A'}</p>
        <p><strong>Start Date:</strong> {credentialData.startDate || 'N/A'}</p>
        <p><strong>End Date:</strong> {credentialData.endDate || 'N/A'}</p>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerifyCredentialModal
