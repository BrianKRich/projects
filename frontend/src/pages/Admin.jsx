import { useState, useEffect, useCallback, useRef } from 'react'
import { useApi } from '../hooks/useApi'

// ─── Shared helpers ────────────────────────────────────────────

const TABS = ['Athletes', 'Meets', 'Results', 'Coaches', 'Future Meets']

function TabBar({ active, onChange }) {
  const listRef = useRef(null)

  function handleKeyDown(e) {
    const tabs = [...listRef.current.querySelectorAll('[role="tab"]')]
    const idx = tabs.indexOf(e.target)
    let next = -1
    if (e.key === 'ArrowRight') next = (idx + 1) % tabs.length
    else if (e.key === 'ArrowLeft') next = (idx - 1 + tabs.length) % tabs.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = tabs.length - 1
    if (next >= 0) {
      e.preventDefault()
      tabs[next].focus()
      onChange(TABS[next])
    }
  }

  return (
    <div role="tablist" aria-label="Admin sections" className="flex gap-1 mb-6 flex-wrap" ref={listRef} onKeyDown={handleKeyDown}>
      {TABS.map(t => (
        <button
          key={t}
          role="tab"
          tabIndex={active === t ? 0 : -1}
          aria-selected={active === t}
          aria-controls={`admin-${t}-panel`}
          id={`admin-${t}-tab`}
          onClick={() => onChange(t)}
          className={
            'px-2 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ' +
            (active === t
              ? 'bg-[#4D007B] text-white focus-visible:outline-[#FFD700]'
              : 'bg-white border border-gray-300 text-gray-600 hover:bg-gray-50')
          }
        >
          {t}
        </button>
      ))}
    </div>
  )
}

// ─── Athletes tab ──────────────────────────────────────────────

function emptyAthlete() {
  return { name: '', gender: 'M', grade: 9, personal_record: '', events: '' }
}

function AthleteForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <tr className="bg-yellow-50">
      <td className="px-3 py-2">
        <input aria-label="Athlete name" value={form.name} onChange={set('name')} placeholder="Name" className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D007B]" />
      </td>
      <td className="px-3 py-2">
        <select aria-label="Gender" value={form.gender} onChange={set('gender')} className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D007B]">
          <option value="M">Boys</option>
          <option value="F">Girls</option>
        </select>
      </td>
      <td className="px-3 py-2">
        <select aria-label="Grade" value={form.grade} onChange={set('grade')} className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D007B]">
          {[9, 10, 11, 12].map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </td>
      <td className="px-3 py-2">
        <input aria-label="Personal record" value={form.personal_record} onChange={set('personal_record')} placeholder="e.g. 17:22" className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D007B]" />
      </td>
      <td className="px-3 py-2">
        <input aria-label="Events" value={form.events} onChange={set('events')} placeholder="e.g. 5K Varsity" className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D007B]" />
      </td>
      <td className="px-3 py-2 flex gap-2">
        <button onClick={() => onSave(form)} className="px-3 py-1 bg-[#4D007B] text-white rounded text-xs font-semibold hover:bg-[#3a0059] focus-visible:outline-[#FFD700]">Save</button>
        <button onClick={onCancel} className="px-3 py-1 bg-gray-200 text-gray-600 rounded text-xs font-semibold hover:bg-gray-300">Cancel</button>
      </td>
    </tr>
  )
}

function AthletesTab() {
  const api = useApi()
  const [athletes, setAthletes] = useState([])
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState(null)

  const load = useCallback(() => {
    api.get('/api/athletes').then(setAthletes).catch(() => {})
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd(form) {
    await api.post('/api/athletes', form)
    setAdding(false)
    load()
  }

  async function handleEdit(id, form) {
    await api.put(`/api/athletes?id=${id}`, form)
    setEditId(null)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this athlete? Associated results will also be deleted.')) return
    await api.del(`/api/athletes?id=${id}`)
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800">Athletes</h2>
        <button onClick={() => setAdding(true)} className="px-4 py-1.5 bg-[#FFD700] text-[#4D007B] rounded-lg text-sm font-semibold hover:bg-[#e6c200]">+ Add Athlete</button>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-[#4D007B] text-white">
              <th className="px-3 py-2 text-sm font-semibold">Name</th>
              <th className="px-3 py-2 text-sm font-semibold">Gender</th>
              <th className="px-3 py-2 text-sm font-semibold">Grade</th>
              <th className="px-3 py-2 text-sm font-semibold">PR</th>
              <th className="px-3 py-2 text-sm font-semibold">Events</th>
              <th className="px-3 py-2 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {adding && <AthleteForm initial={emptyAthlete()} onSave={handleAdd} onCancel={() => setAdding(false)} />}
            {athletes.map(a =>
              editId === a.id
                ? <AthleteForm key={a.id} initial={a} onSave={(form) => handleEdit(a.id, form)} onCancel={() => setEditId(null)} />
                : (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-900">{a.name}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{a.gender === 'M' ? 'Boys' : 'Girls'}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{a.grade}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{a.personal_record || '—'}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{a.events || '—'}</td>
                    <td className="px-3 py-2 flex gap-2">
                      <button onClick={() => setEditId(a.id)} aria-label={`Edit athlete ${a.name}`} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-700">Edit</button>
                      <button onClick={() => handleDelete(a.id)} aria-label={`Delete athlete ${a.name}`} className="text-xs px-2 py-1 bg-red-100 rounded hover:bg-red-200 text-red-600">Delete</button>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Meets tab ─────────────────────────────────────────────────

function emptyMeet() {
  return { name: '', date: '', location: '', description: '' }
}

function MeetForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <tr className="bg-yellow-50">
      <td className="px-3 py-2">
        <input aria-label="Meet name" value={form.name} onChange={set('name')} placeholder="Meet name" className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D007B]" />
      </td>
      <td className="px-3 py-2">
        <input aria-label="Meet date" type="date" value={form.date} onChange={set('date')} className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D007B]" />
      </td>
      <td className="px-3 py-2">
        <input aria-label="Location" value={form.location} onChange={set('location')} placeholder="Location" className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D007B]" />
      </td>
      <td className="px-3 py-2">
        <input aria-label="Description" value={form.description} onChange={set('description')} placeholder="Description" className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D007B]" />
      </td>
      <td className="px-3 py-2 flex gap-2">
        <button onClick={() => onSave(form)} className="px-3 py-1 bg-[#4D007B] text-white rounded text-xs font-semibold hover:bg-[#3a0059] focus-visible:outline-[#FFD700]">Save</button>
        <button onClick={onCancel} className="px-3 py-1 bg-gray-200 text-gray-600 rounded text-xs font-semibold hover:bg-gray-300">Cancel</button>
      </td>
    </tr>
  )
}

function MeetsTab() {
  const api = useApi()
  const [meets, setMeets] = useState([])
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState(null)

  const load = useCallback(() => {
    api.get('/api/meets').then(setMeets).catch(() => {})
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd(form) {
    await api.post('/api/meets', form)
    setAdding(false)
    load()
  }

  async function handleEdit(id, form) {
    await api.put(`/api/meets?id=${id}`, form)
    setEditId(null)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this meet? Associated results will also be deleted.')) return
    await api.del(`/api/meets?id=${id}`)
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800">Meets</h2>
        <button onClick={() => setAdding(true)} className="px-4 py-1.5 bg-[#FFD700] text-[#4D007B] rounded-lg text-sm font-semibold hover:bg-[#e6c200]">+ Add Meet</button>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-[#4D007B] text-white">
              <th className="px-3 py-2 text-sm font-semibold">Name</th>
              <th className="px-3 py-2 text-sm font-semibold">Date</th>
              <th className="px-3 py-2 text-sm font-semibold">Location</th>
              <th className="px-3 py-2 text-sm font-semibold hidden sm:table-cell">Description</th>
              <th className="px-3 py-2 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {adding && <MeetForm initial={emptyMeet()} onSave={handleAdd} onCancel={() => setAdding(false)} />}
            {meets.map(m =>
              editId === m.id
                ? <MeetForm key={m.id} initial={m} onSave={(form) => handleEdit(m.id, form)} onCancel={() => setEditId(null)} />
                : (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-900">{m.name}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{m.date}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{m.location || '—'}</td>
                    <td className="px-3 py-2 text-sm text-gray-500 hidden sm:table-cell">{m.description || '—'}</td>
                    <td className="px-3 py-2 flex gap-2">
                      <button onClick={() => setEditId(m.id)} aria-label={`Edit meet ${m.name}`} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-700">Edit</button>
                      <button onClick={() => handleDelete(m.id)} aria-label={`Delete meet ${m.name}`} className="text-xs px-2 py-1 bg-red-100 rounded hover:bg-red-200 text-red-600">Delete</button>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Results tab ───────────────────────────────────────────────

function ResultForm({ initial, athletes, meets, onSave, onCancel }) {
  const [form, setForm] = useState(initial)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <tr className="bg-yellow-50">
      <td className="px-3 py-2">
        <select aria-label="Athlete" value={form.athleteId} onChange={set('athleteId')} className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D007B]">
          <option value="">Select athlete</option>
          {athletes.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </td>
      <td className="px-3 py-2">
        <select aria-label="Meet" value={form.meetId} onChange={set('meetId')} className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D007B]">
          <option value="">Select meet</option>
          {meets.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </td>
      <td className="px-3 py-2">
        <input aria-label="Time" value={form.time} onChange={set('time')} placeholder="MM:SS" className="w-24 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D007B]" />
      </td>
      <td className="px-3 py-2">
        <input aria-label="Place" type="number" value={form.place} onChange={set('place')} placeholder="Place" className="w-20 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D007B]" />
      </td>
      <td className="px-3 py-2 flex gap-2">
        <button onClick={() => onSave(form)} className="px-3 py-1 bg-[#4D007B] text-white rounded text-xs font-semibold hover:bg-[#3a0059] focus-visible:outline-[#FFD700]">Save</button>
        <button onClick={onCancel} className="px-3 py-1 bg-gray-200 text-gray-600 rounded text-xs font-semibold hover:bg-gray-300">Cancel</button>
      </td>
    </tr>
  )
}

function ResultsTab() {
  const api = useApi()
  const [results, setResults] = useState([])
  const [athletes, setAthletes] = useState([])
  const [meets, setMeets] = useState([])
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState(null)

  const load = useCallback(() => {
    Promise.all([
      api.get('/api/results'),
      api.get('/api/athletes'),
      api.get('/api/meets'),
    ]).then(([r, a, m]) => { setResults(r); setAthletes(a); setMeets(m) }).catch(() => {})
  }, [])

  useEffect(() => { load() }, [load])

  const athleteMap = {}
  athletes.forEach(a => { athleteMap[a.id] = a })
  const meetMap = {}
  meets.forEach(m => { meetMap[m.id] = m })

  function emptyResult() {
    return { athleteId: '', meetId: '', time: '', place: '' }
  }

  async function handleAdd(form) {
    await api.post('/api/results', { ...form, athleteId: Number(form.athleteId), meetId: Number(form.meetId), place: Number(form.place) })
    setAdding(false)
    load()
  }

  async function handleEdit(id, form) {
    await api.put(`/api/results?id=${id}`, { ...form, athleteId: Number(form.athleteId), meetId: Number(form.meetId), place: Number(form.place) })
    setEditId(null)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this result?')) return
    await api.del(`/api/results?id=${id}`)
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800">Results</h2>
        <button onClick={() => setAdding(true)} className="px-4 py-1.5 bg-[#FFD700] text-[#4D007B] rounded-lg text-sm font-semibold hover:bg-[#e6c200]">+ Add Result</button>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-[#4D007B] text-white">
              <th className="px-3 py-2 text-sm font-semibold">Athlete</th>
              <th className="px-3 py-2 text-sm font-semibold">Meet</th>
              <th className="px-3 py-2 text-sm font-semibold">Time</th>
              <th className="px-3 py-2 text-sm font-semibold">Place</th>
              <th className="px-3 py-2 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {adding && <ResultForm initial={emptyResult()} athletes={athletes} meets={meets} onSave={handleAdd} onCancel={() => setAdding(false)} />}
            {results.map(r =>
              editId === r.id
                ? <ResultForm key={r.id} initial={r} athletes={athletes} meets={meets} onSave={(form) => handleEdit(r.id, form)} onCancel={() => setEditId(null)} />
                : (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-900">{athleteMap[r.athleteId]?.name || r.athleteId}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{meetMap[r.meetId]?.name || r.meetId}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{r.time}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{r.place}</td>
                    <td className="px-3 py-2 flex gap-2">
                      <button onClick={() => setEditId(r.id)} aria-label={`Edit result for ${athleteMap[r.athleteId]?.name || 'athlete'} at ${meetMap[r.meetId]?.name || 'meet'}`} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-700">Edit</button>
                      <button onClick={() => handleDelete(r.id)} aria-label={`Delete result for ${athleteMap[r.athleteId]?.name || 'athlete'} at ${meetMap[r.meetId]?.name || 'meet'}`} className="text-xs px-2 py-1 bg-red-100 rounded hover:bg-red-200 text-red-600">Delete</button>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Coaches tab ───────────────────────────────────────────────

function emptyCoach() {
  return { name: '', title: '', bio: '' }
}

function CoachForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <tr className="bg-yellow-50">
      <td className="px-3 py-2">
        <input aria-label="Coach name" value={form.name} onChange={set('name')} placeholder="Name" className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D007B]" />
      </td>
      <td className="px-3 py-2">
        <input aria-label="Title" value={form.title} onChange={set('title')} placeholder="Title" className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D007B]" />
      </td>
      <td className="px-3 py-2">
        <input aria-label="Bio" value={form.bio} onChange={set('bio')} placeholder="Bio" className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D007B]" />
      </td>
      <td className="px-3 py-2 flex gap-2">
        <button onClick={() => onSave(form)} className="px-3 py-1 bg-[#4D007B] text-white rounded text-xs font-semibold hover:bg-[#3a0059] focus-visible:outline-[#FFD700]">Save</button>
        <button onClick={onCancel} className="px-3 py-1 bg-gray-200 text-gray-600 rounded text-xs font-semibold hover:bg-gray-300">Cancel</button>
      </td>
    </tr>
  )
}

function CoachesTab() {
  const api = useApi()
  const [coaches, setCoaches] = useState([])
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState(null)

  const load = useCallback(() => {
    api.get('/api/coaches').then(setCoaches).catch(() => {})
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd(form) {
    await api.post('/api/coaches', form)
    setAdding(false)
    load()
  }

  async function handleEdit(id, form) {
    await api.put(`/api/coaches?id=${id}`, form)
    setEditId(null)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this coach?')) return
    await api.del(`/api/coaches?id=${id}`)
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800">Coaches</h2>
        <button onClick={() => setAdding(true)} className="px-4 py-1.5 bg-[#FFD700] text-[#4D007B] rounded-lg text-sm font-semibold hover:bg-[#e6c200]">+ Add Coach</button>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-[#4D007B] text-white">
              <th className="px-3 py-2 text-sm font-semibold">Name</th>
              <th className="px-3 py-2 text-sm font-semibold">Title</th>
              <th className="px-3 py-2 text-sm font-semibold hidden sm:table-cell">Bio</th>
              <th className="px-3 py-2 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {adding && <CoachForm initial={emptyCoach()} onSave={handleAdd} onCancel={() => setAdding(false)} />}
            {coaches.map(c =>
              editId === c.id
                ? <CoachForm key={c.id} initial={c} onSave={(form) => handleEdit(c.id, form)} onCancel={() => setEditId(null)} />
                : (
                  <tr key={c.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-900">{c.name}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{c.title}</td>
                    <td className="px-3 py-2 text-sm text-gray-500 hidden sm:table-cell">{c.bio || '—'}</td>
                    <td className="px-3 py-2 flex gap-2">
                      <button onClick={() => setEditId(c.id)} aria-label={`Edit coach ${c.name}`} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-700">Edit</button>
                      <button onClick={() => handleDelete(c.id)} aria-label={`Delete coach ${c.name}`} className="text-xs px-2 py-1 bg-red-100 rounded hover:bg-red-200 text-red-600">Delete</button>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Future Meets tab ──────────────────────────────────────────

function emptyFutureMeet() {
  return { name: '', date: '', location: '', level: 'Varsity' }
}

function FutureMeetForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState(initial)
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <tr className="bg-yellow-50">
      <td className="px-3 py-2">
        <input aria-label="Meet name" value={form.name} onChange={set('name')} placeholder="Meet name" className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D007B]" />
      </td>
      <td className="px-3 py-2">
        <input aria-label="Meet date" type="date" value={form.date} onChange={set('date')} className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D007B]" />
      </td>
      <td className="px-3 py-2">
        <input aria-label="Location" value={form.location} onChange={set('location')} placeholder="Location" className="w-full border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D007B]" />
      </td>
      <td className="px-3 py-2">
        <select aria-label="Level" value={form.level} onChange={set('level')} className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#4D007B]">
          <option value="Varsity">Varsity</option>
          <option value="JV">JV</option>
        </select>
      </td>
      <td className="px-3 py-2 flex gap-2">
        <button onClick={() => onSave(form)} className="px-3 py-1 bg-[#4D007B] text-white rounded text-xs font-semibold hover:bg-[#3a0059] focus-visible:outline-[#FFD700]">Save</button>
        <button onClick={onCancel} className="px-3 py-1 bg-gray-200 text-gray-600 rounded text-xs font-semibold hover:bg-gray-300">Cancel</button>
      </td>
    </tr>
  )
}

function FutureMeetsTab() {
  const api = useApi()
  const [meets, setMeets] = useState([])
  const [adding, setAdding] = useState(false)
  const [editId, setEditId] = useState(null)

  const load = useCallback(() => {
    api.get('/api/future-meets').then(setMeets).catch(() => {})
  }, [])

  useEffect(() => { load() }, [load])

  async function handleAdd(form) {
    await api.post('/api/future-meets', form)
    setAdding(false)
    load()
  }

  async function handleEdit(id, form) {
    await api.put(`/api/future-meets?id=${id}`, form)
    setEditId(null)
    load()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this future meet?')) return
    await api.del(`/api/future-meets?id=${id}`)
    load()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold text-gray-800">Future Meets</h2>
        <button onClick={() => setAdding(true)} className="px-4 py-1.5 bg-[#FFD700] text-[#4D007B] rounded-lg text-sm font-semibold hover:bg-[#e6c200]">+ Add Future Meet</button>
      </div>
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="bg-[#4D007B] text-white">
              <th className="px-3 py-2 text-sm font-semibold">Name</th>
              <th className="px-3 py-2 text-sm font-semibold">Date</th>
              <th className="px-3 py-2 text-sm font-semibold">Location</th>
              <th className="px-3 py-2 text-sm font-semibold">Level</th>
              <th className="px-3 py-2 text-sm font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {adding && <FutureMeetForm initial={emptyFutureMeet()} onSave={handleAdd} onCancel={() => setAdding(false)} />}
            {meets.map(m =>
              editId === m.id
                ? <FutureMeetForm key={m.id} initial={m} onSave={(form) => handleEdit(m.id, form)} onCancel={() => setEditId(null)} />
                : (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-sm text-gray-900">{m.name}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{m.date}</td>
                    <td className="px-3 py-2 text-sm text-gray-500">{m.location || '—'}</td>
                    <td className="px-3 py-2 text-sm">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${m.level === 'Varsity' ? 'bg-[#4D007B] text-white' : 'bg-[#FFD700] text-[#4D007B]'}`}>
                        {m.level}
                      </span>
                    </td>
                    <td className="px-3 py-2 flex gap-2">
                      <button onClick={() => setEditId(m.id)} aria-label={`Edit future meet ${m.name}`} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-700">Edit</button>
                      <button onClick={() => handleDelete(m.id)} aria-label={`Delete future meet ${m.name}`} className="text-xs px-2 py-1 bg-red-100 rounded hover:bg-red-200 text-red-600">Delete</button>
                    </td>
                  </tr>
                )
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─── Admin page root ───────────────────────────────────────────

export default function Admin() {
  const [activeTab, setActiveTab] = useState('Athletes')

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-[#4D007B] mb-6">Admin Dashboard</h1>
      <TabBar active={activeTab} onChange={setActiveTab} />

      {activeTab === 'Athletes' && <div role="tabpanel" id="admin-Athletes-panel" aria-labelledby="admin-Athletes-tab"><AthletesTab /></div>}
      {activeTab === 'Meets' && <div role="tabpanel" id="admin-Meets-panel" aria-labelledby="admin-Meets-tab"><MeetsTab /></div>}
      {activeTab === 'Results' && <div role="tabpanel" id="admin-Results-panel" aria-labelledby="admin-Results-tab"><ResultsTab /></div>}
      {activeTab === 'Coaches' && <div role="tabpanel" id="admin-Coaches-panel" aria-labelledby="admin-Coaches-tab"><CoachesTab /></div>}
      {activeTab === 'Future Meets' && <div role="tabpanel" id="admin-Future Meets-panel" aria-labelledby="admin-Future Meets-tab"><FutureMeetsTab /></div>}
    </div>
  )
}
