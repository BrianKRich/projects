import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Athletes from './pages/Athletes'
import Meets from './pages/Meets'
import MeetDetail from './pages/MeetDetail'
import Rankings from './pages/Rankings'
import Coaches from './pages/Coaches'
import Login from './pages/Login'
import Admin from './pages/Admin'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="athletes" element={<Athletes />} />
          <Route path="meets" element={<Meets />} />
          <Route path="meets/:meetId" element={<MeetDetail />} />
          <Route path="rankings" element={<Rankings />} />
          <Route path="coaches" element={<Coaches />} />
          <Route path="login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="admin" element={<Admin />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}
