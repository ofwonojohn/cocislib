package com.cocis.examhub.controller;

import com.cocis.examhub.dto.ExamPaperDTO;
import com.cocis.examhub.dto.ExamPaperRequestDTO;
import com.cocis.examhub.dto.PagedResponse;
import com.cocis.examhub.entity.ExamPaper;
import com.cocis.examhub.service.ExamPaperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamPaperController {
    
    private final ExamPaperService examPaperService;
    
    @GetMapping
    public ResponseEntity<PagedResponse<ExamPaperDTO>> getExamPapers(
            @RequestParam Long course,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer semester,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String academicYear,
            @RequestParam(required = false) String courseUnitName,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        return ResponseEntity.ok(examPaperService.getExamPapers(
                course, year, semester, type, academicYear, courseUnitName, page, size));
    }
    
    @PostMapping
    public ResponseEntity<ExamPaperDTO> uploadExamPaper(
            @RequestParam Long courseUnitId,
            @RequestParam String examType,
            @RequestParam String academicYear,
            @RequestParam MultipartFile file) {
        
        ExamPaperRequestDTO request = ExamPaperRequestDTO.builder()
                .courseUnitId(courseUnitId)
                .examType(ExamPaper.ExamType.valueOf(examType.toUpperCase()))
                .academicYear(academicYear)
                .file(file)
                .build();
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(examPaperService.uploadExamPaper(request));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExamPaper(@PathVariable Long id) {
        examPaperService.deleteExamPaper(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/academicYears")
    public ResponseEntity<List<String>> getAcademicYears(@RequestParam Long course) {
        return ResponseEntity.ok(examPaperService.getAcademicYears(course));
    }
}
