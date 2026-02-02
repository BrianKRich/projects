import { useState } from 'react'
import AthleteList from './components/AthleteList'
import './App.css'

function App() {
  const [showAPI, setShowAPI] = useState(false)

  const apiEndpoints = [
    {
      category: 'Health',
      endpoints: [
        { method: 'GET', path: '/health', description: 'Check API and database health' }
      ]
    },
    {
      category: 'Athletes',
      endpoints: [
        { method: 'GET', path: '/api/athletes', description: 'List all athletes' },
        { method: 'POST', path: '/api/athletes', description: 'Create a new athlete' },
        { method: 'DELETE', path: '/api/athletes?id={id}', description: 'Delete an athlete by ID' }
      ]
    },
    {
      category: 'Meets',
      endpoints: [
        { method: 'GET', path: '/api/meets', description: 'List all meets' },
        { method: 'POST', path: '/api/meets', description: 'Create a new meet' },
        { method: 'DELETE', path: '/api/meets?id={id}', description: 'Delete a meet by ID' }
      ]
    },
    {
      category: 'Results',
      endpoints: [
        { method: 'GET', path: '/api/results', description: 'List all results' },
        { method: 'GET', path: '/api/results?meetId={id}', description: 'List results for a specific meet' },
        { method: 'GET', path: '/api/results?athleteId={id}', description: 'List results for a specific athlete' },
        { method: 'POST', path: '/api/results', description: 'Create a new result' },
        { method: 'DELETE', path: '/api/results?id={id}', description: 'Delete a result by ID' }
      ]
    }
  ]

  const getMethodColor = (method) => {
    const colors = {
      GET: 'bg-blue-100 text-blue-800',
      POST: 'bg-green-100 text-green-800',
      DELETE: 'bg-red-100 text-red-800'
    }
    return colors[method] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Jones County XC</h1>
            <button
              onClick={() => setShowAPI(!showAPI)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              {showAPI ? 'Hide' : 'Show'} API Docs
            </button>
          </div>
        </div>
      </header>

      {showAPI && (
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">API Documentation</h2>
            <p className="text-gray-600 mb-6">
              Click on any endpoint to open it in a new tab and test it.
            </p>

            <div className="space-y-6">
              {apiEndpoints.map((group, idx) => (
                <div key={idx}>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{group.category}</h3>
                  <div className="space-y-2">
                    {group.endpoints.map((endpoint, endIdx) => (
                      <div
                        key={endIdx}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-200 hover:border-blue-400 transition"
                      >
                        <span className={`px-3 py-1 rounded text-xs font-semibold ${getMethodColor(endpoint.method)}`}>
                          {endpoint.method}
                        </span>
                        <div className="flex-1">
                          <a
                            href={endpoint.path.replace('{id}', '1')}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {endpoint.path}
                          </a>
                          <p className="text-sm text-gray-600 mt-1">{endpoint.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
              <h4 className="font-semibold text-blue-900 mb-2">Notes:</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                <li>GET endpoints can be tested by clicking the links</li>
                <li>POST and DELETE requests require tools like curl or Postman</li>
                <li>Deleting an athlete or meet will cascade delete associated results</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      <main className="py-6">
        <AthleteList />
      </main>
    </div>
  )
}

export default App
