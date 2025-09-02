import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import NFTmint from './components/NFTmint'
import Tokenmint from './components/Tokenmint'
import EmploymentForm from './components/credentials/EmploymentForm'
import VerifyNFT from './components/VerifyNFT'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState(false)
  const [openPaymentModal, setOpenPaymentModal] = useState(false)
  const [openTokenModal, setOpenTokenModal] = useState(false)
  const [openEmploymentModal, setOpenEmploymentModal] = useState(false)
  const [openVerifyModal, setOpenVerifyModal] = useState(false)

  const [generatedCredentials, setGeneratedCredentials] = useState<any[]>([])

  const { activeAddress, transactionSigner } = useWallet()
  const { enqueueSnackbar } = useSnackbar()

  const handleCredentialGenerated = async (credential: any) => {
    setOpenEmploymentModal(false)
    enqueueSnackbar('✅ Employment credential created successfully!', { variant: 'success' })

    if (!activeAddress || !activeAddress.length) {
      enqueueSnackbar('⚠️ Connect your wallet to issue credential.', { variant: 'warning' })
      return
    }
    if (!transactionSigner) {
      enqueueSnackbar('⚠️ Wallet signer not available.', { variant: 'error' })
      return
    }

    try {
      // 1️⃣ Generate SHA-256 hash of credential
      const credentialString = JSON.stringify(credential)
      const encoder = new TextEncoder()
      const credentialBytes = encoder.encode(credentialString)
      const hashBuffer = await crypto.subtle.digest('SHA-256', credentialBytes)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

      // 2️⃣ Inject company logo into credential
      credential.logo = 'ipfs://bafkreid5s3jasdzpei6dcsm7gcontemmhw3htwk4bjkexbtejnt4ipmm7i'

      // 3️⃣ Prepare metadataUrl (Pinata or inline)
      const jwt = import.meta.env.VITE_PINATA_JWT as string | undefined

      if (jwt) {
        const res = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            pinataOptions: { cidVersion: 1 },
            pinataContent: {
              ...credential,  // all fields entered by user
              logo: "ipfs://bafkreid5s3jasdzpei6dcsm7gcontemmhw3htwk4bjkexbtejnt4ipmm7i", // JPG logo on Pinata
              image: "ipfs://bafkreid5s3jasdzpei6dcsm7gcontemmhw3htwk4bjkexbtejnt4ipmm7i", // JPG logo on Pinata
              hashHex
            },
          }),
        })

        if (res.ok) {
          const data = await res.json()

          // ✅ Full credential object with metadataUrl and hashHex
          const fullCredential = {
            //Only wallet-friendly metadata is pinned
            metadataUrl: `ipfs://${data.IpfsHash}`, // IPFS CID from Pinata
            hashHex,
            //Keep credential seperatrly, not merged
            credentialData: credential
          }
          enqueueSnackbar('📌 Credential pinned to IPFS', { variant: 'info' })

          // ✅ Pass new object to NFTMint (triggers useEffect)
          setGeneratedCredentials([fullCredential])
        } else {
          const fallbackMetadata = JSON.stringify(credential)
          setGeneratedCredentials([{ ...credential, metadataUrl: fallbackMetadata, hashHex }])
          enqueueSnackbar('⚠️ Using inline JSON for NFT URL (Pinata failed)', { variant: 'warning' })
        }
      } else {
        const fallbackMetadata = JSON.stringify(credential)
        setGeneratedCredentials([{ ...credential, metadataUrl: fallbackMetadata, hashHex }])
        enqueueSnackbar('⚠️ No Pinata JWT set, using inline JSON as metadata', { variant: 'warning' })
      }
    } catch (e) {
      console.error(e)
      enqueueSnackbar('❌ Failed to prepare credential.', { variant: 'error' })
    }
  }

  const handleVerifyCredential = () => {
    if (generatedCredentials.length > 0) {
      enqueueSnackbar('✅ Credential found! Verification successful.', { variant: 'success' })
    } else {
      enqueueSnackbar('⚠️ No credential found. Verification failed.', { variant: 'error' })
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4">
      <div className="flex flex-col items-center justify-start mt-32 w-full max-w-5xl">
        <img src="/verifyHRlogo.jpg" alt="verifyHR logo" className="w-48 h-auto mb-6" />

        <div className="bg-white shadow-xl rounded-2xl p-8 text-center w-full max-w-md border border-gray-200 mb-6">
          <h2 className="text-xl font-semibold text-[#1C2D5A]">verifyHR</h2>
          <p className="text-gray-600 mb-6">Issue and verify credentials with ease.</p>
           <p className="text-gray-600 mb-6">Test.</p>
           <p className="text-gray-600 mb-6">Test 2.</p>
           <p className="text-gray-600 mb-6">Test 3.</p>
        
          <button
            className="w-full py-2 rounded-lg text-white"
            style={{ backgroundColor: '#1C2D5A' }}
            onClick={() => setOpenWalletModal(true)}
          >
            {activeAddress ? 'Connected' : 'Connect Wallet'}
          </button>
        </div>

        {activeAddress && (
          <div className="flex flex-row flex-wrap justify-center gap-4 w-full">
            <div className="bg-white shadow-xl rounded-2xl p-8 text-center w-full sm:w-96 border border-gray-200 mb-4">
              <h2 className="text-xl font-semibold text-[#1C2D5A]">issue</h2>
              <p className="text-gray-600 mb-6">Create education and employment credentials.</p>
              <div className="flex flex-col gap-4">
                <button
                  className="w-full py-2 rounded-lg text-[#1C2D5A] border border-[#1C2D5A] bg-white"
                  onClick={() => setOpenEmploymentModal(true)}
                >
                  create employment credential
                </button>
                <button
                  className="w-full py-2 rounded-lg text-[#1C2D5A] border border-[#1C2D5A] bg-white"
                  onClick={() => setOpenEmploymentModal(true)}
                >
                  create education credential
                  </button>

              </div>
            </div>

            <div className="bg-white shadow-xl rounded-2xl p-8 text-center w-full sm:w-96 border border-gray-200 mb-4">
              <h2 className="text-xl font-semibold text-[#1C2D5A]">verify</h2>
              <p className="text-gray-600 mb-6">One step verification of candidate credentials.</p>
              <div className="flex flex-col gap-4">
                <button
                  className="w-full py-2 rounded-lg text-white"
                  style={{ backgroundColor: '#00C48C' }}
                  onClick={() => setOpenVerifyModal(true)}
                >
                  verify credential
                </button>
                
              </div>
            </div>
          </div>
        )}
      </div>

      <ConnectWallet openModal={openWalletModal} closeModal={() => setOpenWalletModal(false)} />
      <Transact openModal={openPaymentModal} setModalState={setOpenPaymentModal} />
      <NFTmint
        openModal={false}
        setModalState={() => {}}
        credentialJSON={generatedCredentials[generatedCredentials.length - 1]}
      />
      <Tokenmint openModal={openTokenModal} setModalState={setOpenTokenModal} />
      <VerifyNFT
        openModal={openVerifyModal}
        setModalState={setOpenVerifyModal}
      />

      {openEmploymentModal && (
        <dialog id="employment_modal" className="modal modal-open bg-slate-200">
          <form method="dialog" className="modal-box w-full max-w-md">
            <h3 className="font-bold text-lg mb-2">Issue Employment Credential</h3>
            <EmploymentForm onSubmit={handleCredentialGenerated} />
            <div className="modal-action">
              <button className="btn" onClick={() => setOpenEmploymentModal(false)}>Close</button>
            </div>
          </form>
        </dialog>
      )}
    </div>
  )
}

export default Home
