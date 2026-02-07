import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'

function RosterTable({ title, subtitle, rows }) {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-bold text-[#4D007B] mb-0.5">{title}</h2>
      <p className="text-sm text-gray-500 mb-3">{subtitle}</p>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full">
          <caption className="sr-only">{title} roster</caption>
          <thead>
            <tr className="bg-[#4D007B] text-white">
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-sm font-semibold">Name</th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-sm font-semibold hidden sm:table-cell">Gender</th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-sm font-semibold">Grade</th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-sm font-semibold">PR</th>
              <th className="px-2 sm:px-6 py-2 sm:py-3 text-left text-sm font-semibold hidden sm:table-cell">Events</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(a => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-2 sm:px-6 py-2 sm:py-3 text-sm font-medium text-gray-900">{a.name}</td>
                <td className="px-2 sm:px-6 py-2 sm:py-3 text-sm text-gray-500 hidden sm:table-cell">{a.gender === 'M' ? 'Boys' : 'Girls'}</td>
                <td className="px-2 sm:px-6 py-2 sm:py-3 text-sm text-gray-500">{a.grade}</td>
                <td className="px-2 sm:px-6 py-2 sm:py-3 text-sm text-gray-500">{a.personal_record || '—'}</td>
                <td className="px-2 sm:px-6 py-2 sm:py-3 text-sm text-gray-500 hidden sm:table-cell">{a.events || '—'}</td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-2 sm:px-6 py-8 text-center text-gray-400">No athletes match your filters.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

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

  if (loading) return <div role="status" className="text-center py-12 text-gray-500">Loading athletes...</div>
  if (error) return <div role="alert" className="text-center py-12 text-red-500">Error: {error}</div>

  const filtered = athletes.filter(a => {
    const matchesSearch = a.name.toLowerCase().includes(search.toLowerCase())
    const matchesGender = gender === 'All' || a.gender === (gender === 'Boys' ? 'M' : 'F')
    return matchesSearch && matchesGender
  })

  const varsity = filtered.filter(a => a.grade >= 11)
  const jv = filtered.filter(a => a.grade <= 10)

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
          aria-label="Search athletes"
          className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4D007B]"
        />
        <fieldset className="flex gap-2 border-0 p-0 m-0">
          <legend className="sr-only">Filter by gender</legend>
          {genderOptions.map(opt => (
            <button
              key={opt}
              onClick={() => setGender(opt)}
              aria-pressed={gender === opt}
              className={
                'px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-medium transition-colors ' +
                (gender === opt
                  ? 'bg-[#FFD700] text-[#4D007B]'
                  : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50')
              }
            >
              {opt}
            </button>
          ))}
        </fieldset>
      </div>

      <RosterTable title="Varsity" subtitle="Grades 11 & 12" rows={varsity} />
      <RosterTable title="Junior Varsity" subtitle="Grades 9 & 10" rows={jv} />

      <p className="mt-4 text-sm text-gray-400 text-center">
        Showing {filtered.length} of {athletes.length} athletes
      </p>
    </div>
  )
}
