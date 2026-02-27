import axios from 'axios'

const API_BASE_URL = 'http://localhost:8080/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Course APIs
export const getAllCourses = () => api.get('/courses')
export const getCourseById = (id) => api.get(`/courses/${id}`)
export const getCourseBySlug = (slug) => api.get(`/courses/slug/${slug}`)
export const getCourseUnits = (id) => api.get(`/courses/${id}/course-units`)
export const getCourseYears = (id) => api.get(`/courses/${id}/years`)
export const getCourseSemesters = (id, year) => api.get(`/courses/${id}/semesters?year=${year}`)

// Exam APIs
export const getExamPapers = (params) => {
  const { course, year, semester, type, academicYear, courseUnitName, page = 0, size = 20 } = params
  return api.get('/exams', {
    params: {
      course,
      year,
      semester,
      type,
      academicYear,
      courseUnitName,
      page,
      size,
    },
  })
}

export const uploadExamPaper = (formData) => {
  return api.post('/exams', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const deleteExamPaper = (id) => api.delete(`/exams/${id}`)

export const getAcademicYears = (courseId) => api.get(`/exams/academicYears?course=${courseId}`)

export default api
