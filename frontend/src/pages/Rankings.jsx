import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'

function parseTime(timeStr) {
  const parts = timeStr.split(':')
  if (parts.length !== 2) return Infinity
  const mins = parseInt(parts[0], 10)
  const secs = parseFloat(parts[1])
  return mins * 60 + secs
}

export default function Rankings() {
  const { get } = useApi()
  const [boys, setBoys] = useState([])
  const [girls, setGirls] = useState([])
  const [activeTab, setActiveTab] = useState('Boys')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      get('/api/athletes'),
      get('/api/results'),
      get('/api/meets'),
    ])
      .then(([athletes, results, meets]) => {
        const athleteMap = {}
        athletes.forEach(a => { athleteMap[a.id] = a })

        const meetMap = {}
        meets.forEach(m => { meetMap[m.id] = m })

        // Group results by athlete, find best time
        const bestByAthlete = {}
        results.forEach(r => {
          const secs = parseTime(r.time)
          if (!bestByAthlete[r.athleteId] || secs < bestByAthlete[r.athleteId].secs) {
            bestByAthlete[r.athleteId] = { secs, time: r.time, meetId: r.meetId }
          }
        })

        // Build ranked lists
        const ranked = Object.entries(bestByAthlete)
          .map(([id, best]) => ({
            athlete: athleteMap[Number(id)],
            bestTime: best.time,
            bestTimeSecs: best.secs,
            meetName: meetMap[best.meetId]?.name || '—',
          }))
          .filter(r => r.athlete)
          .sort((a, b) => a.bestTimeSecs - b.bestTimeSecs)

        setBoys(ranked.filter(r => r.athlete.gender === 'M'))
        setGirls(ranked.filter(r => r.athlete.gender === 'F'))
        setLoading(false)
      })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  if (loading) return <div role="status" className="text-center py-12 text-gray-500">Computing rankings...</div>
  if (error) return <div role="alert" className="text-center py-12 text-red-500">Error: {error}</div>

  const rows = activeTab === 'Boys' ? boys : girls

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#4D007B] mb-6">Rankings</h1>

      {/* Gender tabs */}
      <div role="tablist" aria-label="Rankings by gender" className="flex gap-2 mb-6">
        {['Boys', 'Girls'].map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`rankings-${tab}-panel`}
            id={`rankings-${tab}-tab`}
            onClick={() => setActiveTab(tab)}
            className={
              'px-4 py-1.5 sm:px-6 sm:py-2 rounded-lg font-semibold transition-colors ' +
              (activeTab === tab
                ? 'bg-[#FFD700] text-[#4D007B]'
                : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50')
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Rankings table */}
      <div role="tabpanel" id={`rankings-${activeTab}-panel`} aria-labelledby={`rankings-${activeTab}-tab`}>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full">
          <caption className="sr-only">{activeTab} rankings by best time</caption>
          <thead>
            <tr className="bg-[#4D007B] text-white">
              <th scope="col" className="px-2 sm:px-6 py-2 sm:py-3 text-left text-sm font-semibold">Rank</th>
              <th scope="col" className="px-2 sm:px-6 py-2 sm:py-3 text-left text-sm font-semibold">Name</th>
              <th scope="col" className="px-2 sm:px-6 py-2 sm:py-3 text-left text-sm font-semibold hidden sm:table-cell">Grade</th>
              <th scope="col" className="px-2 sm:px-6 py-2 sm:py-3 text-left text-sm font-semibold">Best Time</th>
              <th scope="col" className="px-2 sm:px-6 py-2 sm:py-3 text-left text-sm font-semibold hidden sm:table-cell">Meet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map((r, i) => (
              <tr key={r.athlete.id} className="hover:bg-gray-50">
                <td className="px-2 sm:px-6 py-2 sm:py-3 text-sm font-bold text-gray-900">
                  {i === 0 ? <span aria-label="1st place">🥇</span> : i === 1 ? <span aria-label="2nd place">🥈</span> : i === 2 ? <span aria-label="3rd place">🥉</span> : i + 1}
                </td>
                <td className="px-2 sm:px-6 py-2 sm:py-3 text-sm font-medium text-gray-900">{r.athlete.name}</td>
                <td className="px-2 sm:px-6 py-2 sm:py-3 text-sm text-gray-500 hidden sm:table-cell">{r.athlete.grade}</td>
                <td className="px-2 sm:px-6 py-2 sm:py-3 text-sm font-semibold text-[#4D007B]">{r.bestTime}</td>
                <td className="px-2 sm:px-6 py-2 sm:py-3 text-sm text-gray-500 hidden sm:table-cell">{r.meetName}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-2 sm:px-6 py-8 text-center text-gray-400">No rankings data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </div>
    </div>
  )
}
