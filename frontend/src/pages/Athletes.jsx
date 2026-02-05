import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'

export default function Athletes() {
  const { get } = useApi()
  const [athletes, setAthletes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [gender, setGender] = useState('All')

  useEffect(() => {
    get('/api/athletes')
      .then(data => { setAthletes(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  if (loading) return <div className="text-center py-12 text-gray-500">Loading athletes...</div>
  if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>

  const filtered = athletes.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase())
    const matchesGender = gender === 'All' || a.gender === (gender === 'Boys' ? 'M' : 'F')
    return matchesSearch && matchesGender
  })

  const genderOptions = ['All', 'Boys', 'Girls']

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#4D007B] mb-6">Athletes</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search athletes..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4D007B]"
        />
        <div className="flex gap-2">
          {genderOptions.map(opt => (
            <button
              key={opt}
              onClick={() => setGender(opt)}
              className={
                'px-4 py-2 rounded-lg font-medium transition-colors ' +
                (gender === opt
                  ? 'bg-[#FFD700] text-[#4D007B]'
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50')
              }
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead>
            <tr className="bg-[#4D007B] text-white">
              <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Gender</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Grade</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Personal Record</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Events</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(a => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3 text-sm font-medium text-gray-900">{a.name}</td>
                <td className="px-6 py-3 text-sm text-gray-500">{a.gender === 'M' ? 'Boys' : 'Girls'}</td>
                <td className="px-6 py-3 text-sm text-gray-500">{a.grade}</td>
                <td className="px-6 py-3 text-sm text-gray-500">{a.personal_record || '—'}</td>
                <td className="px-6 py-3 text-sm text-gray-500">{a.events || '—'}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No athletes match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-sm text-gray-400 text-center">
        Showing {filtered.length} of {athletes.length} athletes
      </p>
    </div>
  )
}
