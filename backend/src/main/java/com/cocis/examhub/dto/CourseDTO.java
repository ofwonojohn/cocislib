package com.cocis.examhub.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDTO {
    private Long id;
    private String name;
    private String slug;
    private Integer durationYears;
    private String description;
}
