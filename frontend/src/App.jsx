import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CoursesPage from './pages/CoursesPage'
import CoursePage from './pages/CoursePage'
import AdminUploadPage from './pages/AdminUploadPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/courses/:slug" element={<CoursePage />} />
        <Route path="/admin/upload" element={<AdminUploadPage />} />
      </Routes>
    </Router>
  )
}

export default App
