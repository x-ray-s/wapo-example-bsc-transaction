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

const http = (path, config = {}) => {
  const baseUrl = import.meta.env.DEV ? '/api' : window.location.pathname
  const originSearch = new URLSearchParams(window.location.search)
  const query = new URLSearchParams(config.query || {})
  if (originSearch.get('key')) {
    query.set('key', originSearch.get('key'))
  }
  const orign = window.location.origin
  // wapo server route only support '/' 
  const _path = path === '/' ? '' : path
  const url = new URL(`${orign}${baseUrl}${_path}?${query.toString()}`);
  const { query: _, ...withoutQuery } = config

  return fetch(url.toString(), {
    ...withoutQuery
  })
    .then(res => res.json())
}

const validateClass = (valid) => {
  if (valid === 1) {
    return 'valid'
  } else if (valid === 0) {
    return 'invalid'
  }
  return ''
}

function App() {
  const TOKEN = 'ETH'
  const AMOUNT = '0.001'

  const [info, setInfo] = useState('')
  const [address, setAddress] = useState('')
  const [valid, setValid] = useState(-1)
  const [whitelist, setWhitelist] = useState([])
  const [showWhitelist, setShowWhitelist] = useState(false)
  const [whitelistLoaded, setWhitelistLoaded] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  async function checkWhitelist() {
    const r = await http('/', {
      method: 'POST',
      body: JSON.stringify({ address })
    })
    setValid(r.success ? 1 : 0)
    return r.success
  }

  async function getWhitelist() {
    const r = await http('/', { query: { whitelist: 1 } })
    setWhitelistLoaded(true)
    setWhitelist(r)
  }

  async function getInfo() {
    const r = await http('/', { query: { info: 1 } })
    setInfo(r)
  }

  useEffect(() => {
    getInfo()
  }, [])

  async function send() {
    setModalOpen(false)

    const r = await http('/', {
      method: 'POST',
      body: JSON.stringify({ address, type: 'send' })
    })

    setTimeout(() => {
      if (r.success) {
        alert(`Success to send ${AMOUNT} ${TOKEN} to address`)
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
          Main address: <a href={`https://base-sepolia.blockscout.com//address/${info.address}`} target="_blank">{info.address}</a>
        </p>
        <p>
          Balance: {info.balance} {TOKEN}
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
          Send {AMOUNT} {TOKEN} to address
        </button>
        <Modal openModal={modalOpen} closeModal={() => setModalOpen(false)}>
          <h2>Send Confirm</h2>
          <p>Are you sure you want to send {AMOUNT} {TOKEN} to {address}?</p>
          <div className="modal-buttons">
            <button className="btn" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn" onClick={send}>Confirm</button>
          </div>
        </Modal>
      </div>
    </>
  )
}

export default App
