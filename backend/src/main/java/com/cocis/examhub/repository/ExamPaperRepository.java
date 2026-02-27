package com.cocis.examhub.repository;

import com.cocis.examhub.entity.ExamPaper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamPaperRepository extends JpaRepository<ExamPaper, Long> {
    
    List<ExamPaper> findByCourseUnitId(Long courseUnitId);
    
    Page<ExamPaper> findByCourseUnitCourseId(Long courseId, Pageable pageable);
    
    @Query("SELECT ep FROM ExamPaper ep WHERE ep.courseUnit.course.id = :courseId AND " +
           "(:year IS NULL OR ep.courseUnit.year = :year) AND " +
           "(:semester IS NULL OR ep.courseUnit.semester = :semester) AND " +
           "(:examType IS NULL OR ep.examType = :examType) AND " +
           "(:academicYear IS NULL OR ep.academicYear = :academicYear) AND " +
           "(:courseUnitName IS NULL OR LOWER(ep.courseUnit.name) LIKE LOWER(CONCAT('%', :courseUnitName, '%')) OR LOWER(ep.courseUnit.code) LIKE LOWER(CONCAT('%', :courseUnitName, '%')))")
    Page<ExamPaper> findByFilters(@Param("courseId") Long courseId,
                                  @Param("year") Integer year,
                                  @Param("semester") Integer semester,
                                  @Param("examType") ExamPaper.ExamType examType,
                                  @Param("academicYear") String academicYear,
                                  @Param("courseUnitName") String courseUnitName,
                                  Pageable pageable);
    
    @Query("SELECT DISTINCT ep.academicYear FROM ExamPaper ep WHERE ep.courseUnit.course.id = :courseId ORDER BY ep.academicYear DESC")
    List<String> findDistinctAcademicYearsByCourseId(@Param("courseId") Long courseId);
    
    Optional<ExamPaper> findByCourseUnitIdAndExamTypeAndAcademicYear(Long courseUnitId, ExamPaper.ExamType examType, String academicYear);
}
