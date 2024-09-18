import { useState, useEffect, useRef } from 'react'


function Modal({ openModal, closeModal, children }) {
  const ref = useRef();

  useEffect(() => {
    if (openModal) {
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [openModal]);

  return (
    <dialog
      ref={ref}
      onCancel={closeModal}
    >
      {children}

    </dialog>
  );
}

function App() {
  const [info, setInfo] = useState('')
  const baseUrl = import.meta.env.DEV ? '/api' : window.location.pathname

  const [address, setAddress] = useState('')
  const [valid, setValid] = useState(-1)
  const [whitelist, setWhitelist] = useState([])
  const [showWhitelist, setShowWhitelist] = useState(false)
  const [whitelistLoaded, setWhitelistLoaded] = useState(false)

  const [modalOpen, setModalOpen] = useState(false)

  const validateClass = (valid) => {
    if (valid === 1) {
      return 'valid'
    } else if (valid === 0) {
      return 'invalid'
    }
    return ''
  }

  async function checkWhitelist() {
    const r = await fetch(`${baseUrl}`, {
      method: 'POST',
      body: JSON.stringify({ address })
    })
      .then(res => res.json())
    setValid(r.success ? 1 : 0)
    return r.success
  }
  async function getWhitelist() {
    const r = await fetch(`${baseUrl}?whitelist=1`)
      .then(res => res.json())
    setWhitelistLoaded(true)
    setWhitelist(r)
  }

  async function getInfo() {
    const r = await fetch(`${baseUrl}?info=1`)
      .then(res => res.json())
    setInfo(r)
  }

  useEffect(() => {
    getInfo()

  }, [])

  async function send001() {
    setModalOpen(false)

    const r = await fetch(`${baseUrl}?send=1`, {
      method: 'POST',
      body: JSON.stringify({ address, type: 'send' })
    })
      .then(res => res.json())

    setTimeout(() => {
      if (r.success) {
        alert('Success to send 0.01 BNB to address')
      } else {
        alert('Address is not in whitelist')
      }
    }, 50)
    if (r.success) {
      setTimeout(() => {
        getInfo()
      }, 1000 * 10)
    }
  }

  return (
    <>

      <h1>Hello Wapo</h1>
      <div className="card">
        <p>
          Main address: <a href={`https://testnet.bscscan.com/address/${info.address}`} target="_blank">{info.address}</a>
        </p>
        <p>
          Balance: {info.balance} BNB
        </p>

        <div>
          <button className="btn" onClick={() => {
            setShowWhitelist(!showWhitelist)
            if (!whitelistLoaded) {
              getWhitelist()
            }
          }}>
            {showWhitelist ? 'Hide' : 'Show'} whitelist
          </button>
          {showWhitelist && (
            <ul>
              {whitelist.map(address => (
                <li key={address}>{address}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="address-section">
          <label htmlFor="address">Address:</label>
          <input id="address" type="text" placeholder="Enter address" className={validateClass(valid)} value={address} onChange={(e) => {
            setAddress(e.target.value)
            setValid(-1)
          }} />
        </div>
        <button className="btn" onClick={checkWhitelist}>
          Check whitelist
        </button>

        <button className="btn" onClick={() => setModalOpen(true)}>
          Send 0.01 BNB to address
        </button>
        <Modal openModal={modalOpen} closeModal={() => setModalOpen(false)}>
          <h2>Send Confirm</h2>
          <p>Are you sure you want to send 0.01 BNB to {address}?</p>
          <div className="modal-buttons">
            <button className="btn" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn" onClick={send001}>Confirm</button>
          </div>
        </Modal>
      </div>
    </>
  )
}

export default App
