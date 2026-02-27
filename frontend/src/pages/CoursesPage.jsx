import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getAllCourses } from '../services/api'

function CoursesPage() {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getAllCourses()
        setCourses(response.data)
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  const handleCourseClick = (slug) => {
    navigate(`/courses/${slug}`)
  }

  const getCourseIcon = (slug) => {
    const icons = {
      'computer-science': '💻',
      'software-engineering': '⚙️',
      'blis': '📚',
      'bist': '🔧',
    }
    return icons[slug] || '📖'
  }

  const getCourseColor = (slug) => {
    const colors = {
      'computer-science': 'from-blue-600 to-blue-800',
      'software-engineering': 'from-green-600 to-green-800',
      'blis': 'from-purple-600 to-purple-800',
      'bist': 'from-orange-600 to-orange-800',
    }
    return colors[slug] || 'from-gray-600 to-gray-800'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cocis-dark flex items-center justify-center">
        <div className="text-white text-2xl">Loading courses...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cocis-dark">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-cocis-primary py-6 px-4 shadow-lg"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-white text-lg hover:text-cocis-gold transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Select Your Course of Interest</h1>
          <div className="w-24" />
        </div>
      </motion.header>

      {/* Bookshelves */}
      <main className="max-w-6xl mx-auto py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 + 0.3 }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => handleCourseClick(course.slug)}
              className={`cursor-pointer rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br ${getCourseColor(course.slug)}`}
            >
              {/* Bookshelf effect */}
              <div className="relative h-48 flex items-center justify-center bg-black/20">
                {/* Shelf books effect */}
                <div className="flex gap-2 items-end h-32">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: 60 + Math.random() * 60 }}
                      transition={{ delay: index * 0.1 + 0.5 + i * 0.05 }}
                      className="w-6 bg-white/30 rounded-t"
                      style={{
                        height: `${50 + (i % 3) * 25}px`,
                      }}
                    />
                  ))}
                </div>
                
                {/* Course Icon */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="text-6xl">{getCourseIcon(course.slug)}</span>
                </div>
              </div>

              {/* Course Info */}
              <div className="p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">{course.name}</h2>
                <p className="text-white/80 mb-4">{course.description}</p>
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>Duration: {course.durationYears} Years</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full">
                    Year 1 - {course.durationYears}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Coming Soon Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center"
        >
          <div className="inline-block px-6 py-3 bg-cocis-accent rounded-lg text-white">
            <span className="text-cocis-gold font-semibold">📝 Notes Section - Coming Soon!</span>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

export default CoursesPage
