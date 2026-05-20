import { useEffect, useState } from 'react'
import API from './services/api'

function App() {
  const [trackers, setTrackers] = useState([])

  const [name, setName] = useState('')
  const [url, setUrl] = useState('')

  const [editingTracker, setEditingTracker] =
    useState(null)

  const [editName, setEditName] = useState('')
  const [editUrl, setEditUrl] = useState('')

  const [historyModal, setHistoryModal] =
    useState(null)

  const [historyData, setHistoryData] = useState([])

  async function fetchTrackers() {
    try {
      const response = await API.get('/trackers')

      setTrackers(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  async function addTracker(e) {
    e.preventDefault()

    if (!name || !url) return

    try {
      await API.post('/trackers', {
        name,
        url
      })

      setName('')
      setUrl('')

      fetchTrackers()
    } catch (error) {
      console.log(error)
    }
  }

  async function deleteTracker(id) {
    try {
      await API.delete(`/trackers/${id}`)

      fetchTrackers()
    } catch (error) {
      console.log(error)
    }
  }

  async function toggleTracker(tracker) {
    try {
      if (tracker.status === 'active') {
        await API.patch(`/trackers/${tracker.id}/pause`)
      } else {
        await API.patch(`/trackers/${tracker.id}/resume`)
      }

      fetchTrackers()
    } catch (error) {
      console.log(error)
    }
  }

  function openEditModal(tracker) {
    setEditingTracker(tracker)

    setEditName(tracker.name)
    setEditUrl(tracker.url)
  }

  async function saveEdit() {
    try {
      await API.put(
        `/trackers/${editingTracker.id}`,
        {
          name: editName,
          url: editUrl
        }
      )

      setEditingTracker(null)

      fetchTrackers()
    } catch (error) {
      console.log(error)
    }
  }

  async function openHistory(tracker) {
    try {
      const response = await API.get(
        `/trackers/${tracker.id}/history`
      )

      setHistoryData(response.data.data)

      setHistoryModal(tracker)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchTrackers()

    const interval = setInterval(() => {
      fetchTrackers()
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-950 text-white p-8">
      <h1 className="text-5xl font-black mb-8 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
        FirstCry Stock Tracker
      </h1>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800 p-6 rounded-2xl shadow-xl">
          <p className="text-slate-400">
            Total Trackers
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {trackers.length}
          </h2>
        </div>

        <div className="bg-green-900/40 p-6 rounded-2xl shadow-xl">
          <p className="text-green-300">
            In Stock
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {
              trackers.filter(
                (tracker) => tracker.inStock
              ).length
            }
          </h2>
        </div>

        <div className="bg-yellow-900/40 p-6 rounded-2xl shadow-xl">
          <p className="text-yellow-300">
            Active Trackers
          </p>

          <h2 className="text-4xl font-bold mt-2">
            {
              trackers.filter(
                (tracker) =>
                  tracker.status === 'active'
              ).length
            }
          </h2>
        </div>
      </div>

      <form
        onSubmit={addTracker}
        className="bg-slate-800/80 backdrop-blur border border-slate-700 p-6 rounded-2xl mb-8 shadow-xl"
      >
        <h2 className="text-2xl font-bold mb-4">
          Add New Tracker
        </h2>

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-lg bg-slate-700 mb-4 outline-none"
        />

        <input
          type="text"
          placeholder="Product URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full p-3 rounded-lg bg-slate-700 mb-4 outline-none"
        />

        <button className="bg-green-500 hover:bg-green-600 transition px-5 py-3 rounded-lg font-bold">
          Add Tracker
        </button>
      </form>

      <div className="grid gap-4">
        {trackers.map((tracker, index) => (
          <div
            key={tracker.id}
            className="bg-slate-800/80 backdrop-blur border border-slate-700 p-5 rounded-2xl shadow-xl hover:scale-[1.01] transition"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">
                  #{index + 1} {tracker.name}
                </h2>

                <p className="text-slate-400 mt-2 break-all">
                  {tracker.url}
                </p>

                <p className="mt-2 text-sm">
                  Status:
                  <span
                    className={`ml-2 font-bold ${
                      tracker.status === 'active'
                        ? 'text-green-400'
                        : 'text-yellow-400'
                    }`}
                  >
                    {tracker.status.toUpperCase()}
                  </span>
                </p>
              </div>

              <div>
                {tracker.inStock ? (
                  <span className="bg-green-500 px-4 py-2 rounded-full text-sm font-bold">
                    IN STOCK
                  </span>
                ) : (
                  <span className="bg-red-500 px-4 py-2 rounded-full text-sm font-bold">
                    OUT OF STOCK
                  </span>
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-3 flex-wrap">
              <button
                onClick={() => toggleTracker(tracker)}
                className="bg-yellow-500 hover:bg-yellow-600 transition text-black px-4 py-2 rounded-lg"
              >
                {tracker.status === 'active'
                  ? 'Pause'
                  : 'Resume'}
              </button>

              <button
                onClick={() => openEditModal(tracker)}
                className="bg-blue-500 hover:bg-blue-600 transition px-4 py-2 rounded-lg"
              >
                Edit
              </button>

              <button
                onClick={() => openHistory(tracker)}
                className="bg-purple-500 hover:bg-purple-600 transition px-4 py-2 rounded-lg"
              >
                History
              </button>

              <button
                onClick={() => deleteTracker(tracker.id)}
                className="bg-red-600 hover:bg-red-700 transition px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingTracker && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-slate-800 p-6 rounded-2xl w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">
              Edit Tracker
            </h2>

            <input
              type="text"
              value={editName}
              onChange={(e) =>
                setEditName(e.target.value)
              }
              className="w-full p-3 rounded-lg bg-slate-700 mb-4 outline-none"
            />

            <input
              type="text"
              value={editUrl}
              onChange={(e) =>
                setEditUrl(e.target.value)
              }
              className="w-full p-3 rounded-lg bg-slate-700 mb-4 outline-none"
            />

            <div className="flex gap-3">
              <button
                onClick={saveEdit}
                className="bg-green-500 hover:bg-green-600 transition px-4 py-2 rounded-lg"
              >
                Save
              </button>

              <button
                onClick={() =>
                  setEditingTracker(null)
                }
                className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {historyModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
          <div className="bg-slate-800 p-6 rounded-2xl w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-bold mb-4">
              History - {historyModal.name}
            </h2>

            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {historyData.length === 0 && (
                <p>No history found</p>
              )}

              {historyData.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-700 p-4 rounded-lg"
                >
                  <p className="font-bold">
                    {item.event}
                  </p>

                  <p className="text-sm text-slate-300 mt-1">
                    {new Date(
                      item.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setHistoryModal(null)}
              className="bg-red-500 hover:bg-red-600 transition px-4 py-2 rounded-lg mt-4"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App