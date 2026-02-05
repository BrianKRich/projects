import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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

export default function Meets() {
  const { get } = useApi()
  const [meets, setMeets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    get('/api/meets')
      .then(data => { setMeets(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [])

  if (loading) return <div className="text-center py-12 text-gray-500">Loading meets...</div>
  if (error) return <div className="text-center py-12 text-red-500">Error: {error}</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#4D007B] mb-6">Meets</h1>

      <div className="flex flex-col gap-4">
        {meets.map(meet => (
          <Link
            key={meet.id}
            to={`/meets/${meet.id}`}
            className="bg-white rounded-xl shadow p-5 hover:shadow-md transition border-l-4 border-[#4D007B]"
          >
            <h2 className="text-xl font-bold text-[#4D007B]">{meet.name}</h2>
            <p className="text-gray-500 mt-1">{formatDate(meet.date)}</p>
            {meet.location && <p className="text-gray-400 text-sm mt-0.5">{meet.location}</p>}
            {meet.description && <p className="text-gray-500 text-sm mt-2">{meet.description}</p>}
          </Link>
        ))}

        {meets.length === 0 && (
          <p className="text-center text-gray-400 py-12">No meets on file yet.</p>
        )}
      </div>
    </div>
  )
}
