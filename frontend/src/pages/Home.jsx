import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useApi } from '../hooks/useApi'

export default function Home() {
  const { get } = useApi()
  const [stats, setStats] = useState({ athletes: 0, meets: 0, results: 0 })

  useEffect(() => {
    Promise.all([
      get('/api/athletes'),
      get('/api/meets'),
      get('/api/results'),
    ])
      .then(([athletes, meets, results]) => {
        setStats({ athletes: athletes.length, meets: meets.length, results: results.length })
      })
      .catch(() => {})
  }, [])

  return (
    <div>
      {/* Hero */}
      <div className="bg-[#4D007B] rounded-xl text-white text-center py-16 px-6 mb-8">
        <h1 className="text-5xl font-bold mb-3">Jones County Greyhounds</h1>
        <p className="text-xl text-gray-200">Building champions on and off the track</p>
      </div>

      {/* Achievement banner */}
      <div className="bg-[#FFD700] rounded-xl text-center py-4 px-6 mb-8">
        <p className="text-[#4D007B] font-bold text-lg">
          Both Teams FOUR-PEAT Champions (2022–2025)
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Athletes', value: stats.athletes },
          { label: 'Meets', value: stats.meets },
          { label: 'Results', value: stats.results },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl shadow p-6 text-center">
            <p className="text-4xl font-bold text-[#4D007B]">{value}</p>
            <p className="text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* CTA cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/athletes"
          className="bg-white rounded-xl shadow p-6 hover:shadow-md transition border-t-4 border-[#4D007B]"
        >
          <h2 className="text-xl font-bold text-[#4D007B] mb-1">Meet Our Athletes</h2>
          <p className="text-gray-500 text-sm">Browse the full roster of Jones County runners.</p>
        </Link>
        <Link
          to="/meets"
          className="bg-white rounded-xl shadow p-6 hover:shadow-md transition border-t-4 border-[#FFD700]"
        >
          <h2 className="text-xl font-bold text-[#4D007B] mb-1">Meet Schedule & Results</h2>
          <p className="text-gray-500 text-sm">View upcoming and past meets with full results.</p>
        </Link>
      </div>
    </div>
  )
}
