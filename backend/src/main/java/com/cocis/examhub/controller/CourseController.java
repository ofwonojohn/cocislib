package com.cocis.examhub.controller;

import com.cocis.examhub.dto.CourseDTO;
import com.cocis.examhub.dto.CourseUnitDTO;
import com.cocis.examhub.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {
    
    private final CourseService courseService;
    
    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<CourseDTO> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }
    
    @GetMapping("/slug/{slug}")
    public ResponseEntity<CourseDTO> getCourseBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(courseService.getCourseBySlug(slug));
    }
    
    @GetMapping("/{id}/course-units")
    public ResponseEntity<List<CourseUnitDTO>> getCourseUnits(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseUnitsByCourseId(id));
    }
    
    @GetMapping("/{id}/years")
    public ResponseEntity<List<Integer>> getYears(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getYearsByCourseId(id));
    }
    
    @GetMapping("/{id}/semesters")
    public ResponseEntity<List<Integer>> getSemesters(
            @PathVariable Long id,
            @RequestParam Integer year) {
        return ResponseEntity.ok(courseService.getSemestersByCourseIdAndYear(id, year));
    }
}
