package com.cocis.examhub.repository;

import com.cocis.examhub.entity.CourseUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseUnitRepository extends JpaRepository<CourseUnit, Long> {
    
    List<CourseUnit> findByCourseId(Long courseId);
    
    List<CourseUnit> findByCourseSlug(String slug);
    
    Optional<CourseUnit> findByCourseIdAndYearAndSemesterAndCode(Long courseId, Integer year, Integer semester, String code);
    
    @Query("SELECT DISTINCT cu.year FROM CourseUnit cu WHERE cu.course.id = :courseId ORDER BY cu.year")
    List<Integer> findDistinctYearsByCourseId(@Param("courseId") Long courseId);
    
    @Query("SELECT DISTINCT cu.semester FROM CourseUnit cu WHERE cu.course.id = :courseId AND cu.year = :year ORDER BY cu.semester")
    List<Integer> findDistinctSemestersByCourseIdAndYear(@Param("courseId") Long courseId, @Param("year") Integer year);
    
    @Query("SELECT DISTINCT cu FROM CourseUnit cu WHERE cu.course.id = :courseId AND " +
           "(:year IS NULL OR cu.year = :year) AND " +
           "(:semester IS NULL OR cu.semester = :semester) AND " +
           "(:search IS NULL OR LOWER(cu.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(cu.code) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<CourseUnit> findByFilters(@Param("courseId") Long courseId,
                                   @Param("year") Integer year,
                                   @Param("semester") Integer semester,
                                   @Param("search") String search);
}
