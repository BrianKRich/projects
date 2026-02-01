import AthleteList from './components/AthleteList'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto py-6 px-4">
          <h1 className="text-3xl font-bold text-gray-900">Jones County XC</h1>
        </div>
      </header>
      <main className="py-6">
        <AthleteList />
      </main>
    </div>
  )
}

export default App
