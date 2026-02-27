package com.cocis.examhub.repository;

import com.cocis.examhub.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findBySlug(String slug);
    Optional<Course> findByName(String name);
    boolean existsBySlug(String slug);
}
