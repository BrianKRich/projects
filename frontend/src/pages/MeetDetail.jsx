import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'

function formatDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function MeetDetail() {
  const { meetId } = useParams()
  const { get } = useApi()
  const [meet, setMeet] = useState(null)
  const [results, setResults] = useState([])
  const [athleteMap, setAthleteMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([
      get('/api/meets'),
      get(`/api/results?meetId=${meetId}`),
      get('/api/athletes'),
    ])
      .then(([meets, res, athletes]) => {
        const found = meets.find(m => String(m.id) === String(meetId))
        if (!found) {
          setError('Meet not found')
          setLoading(false)
          return
        }
        setMeet(found)
        setResults(res)
        const map = {}
        athletes.forEach(a => { map[a.id] = a })
        setAthleteMap(map)
        setLoading(false)
      })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [meetId])

  if (loading) return <div className="text-center py-12 text-gray-500">Loading meet details...</div>
  if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>

  // Split results by gender based on athlete lookup
  const boysResults = results.filter(r => athleteMap[r.athleteId]?.gender === 'M')
  const girlsResults = results.filter(r => athleteMap[r.athleteId]?.gender === 'F')

  function ResultsTable({ rows, title }) {
    if (rows.length === 0) return null
    return (
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#4D007B] mb-2">{title}</h3>
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="min-w-full">
            <thead>
              <tr className="bg-[#4D007B] text-white">
                <th className="px-6 py-3 text-left text-sm font-semibold">Place</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Athlete</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Grade</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map(r => {
                const athlete = athleteMap[r.athleteId]
                return (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-bold text-gray-900">{r.place}</td>
                    <td className="px-6 py-3 text-sm text-gray-900">{athlete?.name || '—'}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{athlete?.grade || '—'}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{r.time}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Link to="/meets" className="inline-flex items-center text-[#4D007B] hover:underline mb-4 text-sm">
        &larr; Back to Meets
      </Link>

      {/* Meet header */}
      <div className="bg-[#4D007B] text-white rounded-xl p-6 mb-6">
        <h1 className="text-2xl font-bold">{meet.name}</h1>
        <p className="text-gray-300 mt-1">{formatDate(meet.date)}</p>
        {meet.location && <p className="text-gray-300 text-sm">{meet.location}</p>}
        {meet.description && <p className="text-gray-200 text-sm mt-2">{meet.description}</p>}
      </div>

      {/* Results */}
      <ResultsTable rows={boysResults} title="Boys Results" />
      <ResultsTable rows={girlsResults} title="Girls Results" />

      {results.length === 0 && (
        <p className="text-center text-gray-400 py-8">No results recorded for this meet.</p>
      )}
    </div>
  )
}
