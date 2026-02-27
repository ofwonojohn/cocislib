import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { getCourseBySlug, getCourseYears, getCourseSemesters } from '../services/api'
import { getExamPapers } from '../services/api'

function CoursePage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [years, setYears] = useState([])
  const [semesters, setSemesters] = useState([])
  const [examPapers, setExamPapers] = useState([])
  const [pagination, setPagination] = useState({ page: 0, totalPages: 0, totalElements: 0 })
  const [loadingExams, setLoadingExams] = useState(false)
  
  // Filters
  const [selectedYear, setSelectedYear] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('')
  const [selectedExamType, setSelectedExamType] = useState('')
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  // Fetch course and initial data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const courseResponse = await getCourseBySlug(slug)
        setCourse(courseResponse.data)
        
        const yearsResponse = await getCourseYears(courseResponse.data.id)
        setYears(yearsResponse.data)
      } catch (error) {
        console.error('Error fetching course:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCourseData()
  }, [slug])

  // Fetch semesters when year changes
  useEffect(() => {
    const fetchSemesters = async () => {
      if (course && selectedYear) {
        try {
          const response = await getCourseSemesters(course.id, selectedYear)
          setSemesters(response.data)
        } catch (error) {
          console.error('Error fetching semesters:', error)
        }
      } else {
        setSemesters([])
      }
      setSelectedSemester('')
    }
    fetchSemesters()
  }, [course, selectedYear])

  // Fetch exam papers with filters
  const fetchExamPapers = useCallback(async (page = 0) => {
    if (!course) return
    
    setLoadingExams(true)
    try {
      const params = {
        course: course.id,
        year: selectedYear || null,
        semester: selectedSemester || null,
        type: selectedExamType || null,
        academicYear: selectedAcademicYear || null,
        courseUnitName: searchQuery || null,
        page,
        size: 20,
      }
      
      const response = await getExamPapers(params)
      setExamPapers(response.data.content)
      setPagination({
        page: response.data.page,
        totalPages: response.data.totalPages,
        totalElements: response.data.totalElements,
      })
    } catch (error) {
      console.error('Error fetching exam papers:', error)
    } finally {
      setLoadingExams(false)
    }
  }, [course, selectedYear, selectedSemester, selectedExamType, selectedAcademicYear, searchQuery])

  // Fetch exam papers when filters change
  useEffect(() => {
    fetchExamPapers(0)
  }, [fetchExamPapers])

  const handlePageChange = (newPage) => {
    fetchExamPapers(newPage)
  }

  const handleDownload = (fileUrl) => {
    window.open(`http://localhost:8080${fileUrl}`, '_blank')
  }

  const clearFilters = () => {
    setSelectedYear('')
    setSelectedSemester('')
    setSelectedExamType('')
    setSelectedAcademicYear('')
    setSearchQuery('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cocis-dark flex items-center justify-center">
        <div className="text-white text-2xl">Loading course...</div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-cocis-dark flex items-center justify-center">
        <div className="text-white text-2xl">Course not found</div>
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
            onClick={() => navigate('/courses')}
            className="text-white text-lg hover:text-cocis-gold transition-colors"
          >
            ← Back to Courses
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-white">{course.name}</h1>
          <div className="w-24" />
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto py-8 px-4">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-cocis-primary rounded-xl p-6 mb-8 shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Year Filter */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="w-full bg-cocis-dark text-white px-4 py-2 rounded-lg border border-cocis-accent focus:border-cocis-gold focus:outline-none"
              >
                <option value="">All Years</option>
                {years.map((year) => (
                  <option key={year} value={year}>Year {year}</option>
                ))}
              </select>
            </div>

            {/* Semester Filter */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                disabled={!selectedYear}
                className="w-full bg-cocis-dark text-white px-4 py-2 rounded-lg border border-cocis-accent focus:border-cocis-gold focus:outline-none disabled:opacity-50"
              >
                <option value="">All Semesters</option>
                {semesters.map((semester) => (
                  <option key={semester} value={semester}>Semester {semester}</option>
                ))}
              </select>
            </div>

            {/* Exam Type Filter */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Exam Type</label>
              <select
                value={selectedExamType}
                onChange={(e) => setSelectedExamType(e.target.value)}
                className="w-full bg-cocis-dark text-white px-4 py-2 rounded-lg border border-cocis-accent focus:border-cocis-gold focus:outline-none"
              >
                <option value="">All Types</option>
                <option value="MIDTERM">Midterm</option>
                <option value="FINAL">Final</option>
              </select>
            </div>

            {/* Academic Year Filter */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Academic Year</label>
              <select
                value={selectedAcademicYear}
                onChange={(e) => setSelectedAcademicYear(e.target.value)}
                className="w-full bg-cocis-dark text-white px-4 py-2 rounded-lg border border-cocis-accent focus:border-cocis-gold focus:outline-none"
              >
                <option value="">All Years</option>
                <option value="2024/2025">2024/2025</option>
                <option value="2023/2024">2023/2024</option>
                <option value="2022/2023">2022/2023</option>
                <option value="2021/2022">2021/2022</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-white/70 text-sm mb-2">Course Unit</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search course unit..."
                className="w-full bg-cocis-dark text-white px-4 py-2 rounded-lg border border-cocis-accent focus:border-cocis-gold focus:outline-none"
              />
            </div>
          </div>

          {/* Clear Filters */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="text-cocis-gold hover:text-white transition-colors text-sm"
            >
              Clear Filters
            </button>
          </div>
        </motion.div>

        {/* Results */}
        <div className="mb-4 text-white/70">
          {pagination.totalElements > 0 ? (
            <span>Found {pagination.totalElements} exam papers</span>
          ) : (
            <span>No exam papers found</span>
          )}
        </div>

        {/* Exam Papers Grid */}
        <AnimatePresence mode="wait">
          {loadingExams ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <div className="text-white text-xl">Loading exam papers...</div>
            </motion.div>
          ) : examPapers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-cocis-primary rounded-xl p-12 text-center"
            >
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl text-white mb-2">No Exam Papers Found</h3>
              <p className="text-white/60">Try adjusting your filters or check back later</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {examPapers.map((exam, index) => (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-cocis-primary rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{exam.courseUnitName}</h3>
                      <p className="text-white/60 text-sm">{exam.courseUnitCode}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      exam.examType === 'FINAL' 
                        ? 'bg-green-600/30 text-green-400' 
                        : 'bg-yellow-600/30 text-yellow-400'
                    }`}>
                      {exam.examType === 'FINAL' ? 'Final' : 'Midterm'}
                    </span>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-white/70">
                      <span className="w-24">Year:</span>
                      <span className="text-white">Year {exam.courseUnitYear}, Sem {exam.courseUnitSemester}</span>
                    </div>
                    <div className="flex items-center text-sm text-white/70">
                      <span className="w-24">Academic:</span>
                      <span className="text-white">{exam.academicYear}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleDownload(exam.fileUrl)}
                    className="w-full bg-cocis-gold hover:bg-cocis-gold/80 text-white py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Download PDF
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 0}
              className="px-4 py-2 bg-cocis-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cocis-accent transition-colors"
            >
              Previous
            </button>
            <span className="text-white">
              Page {pagination.page + 1} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages - 1}
              className="px-4 py-2 bg-cocis-primary text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-cocis-accent transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  )
}

export default CoursePage
