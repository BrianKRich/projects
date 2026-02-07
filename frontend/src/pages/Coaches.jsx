import { useState, useEffect } from 'react'
import { useApi } from '../hooks/useApi'

export default function Coaches() {
  const { get } = useApi()
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    get('/api/coaches')
      .then(data => { setCoaches(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  if (loading) return <div role="status" className="text-center py-12 text-gray-600">Loading coaching staff...</div>
  if (error) return <div role="alert" className="text-center py-12 text-red-600">Error: {error}</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#4D007B] mb-2">Coaching Staff</h1>
      <p className="text-gray-500 mb-6">Meet the dedicated coaching staff leading our Greyhounds to excellence.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {coaches.map(coach => (
          <article key={coach.id} className="bg-white rounded-xl shadow overflow-hidden">
            <div className="h-2 bg-[#4D007B]" aria-hidden="true" />
            <div className="p-4 sm:p-6">
              <h2 className="text-xl font-bold text-gray-900">{coach.name}</h2>
              <p className="text-[#FFD700] font-semibold text-sm mt-0.5" role="text">{coach.title}</p>
              {coach.bio && <p className="text-gray-700 text-sm mt-3 line-clamp-4">{coach.bio}</p>}
            </div>
          </article>
        ))}

        {coaches.length === 0 && (
          <p className="col-span-full text-center text-gray-400 py-12">No coaching staff on file.</p>
        )}
      </div>
    </div>
  )
}
