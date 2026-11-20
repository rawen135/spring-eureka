package org.example.candidature;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/candidatures")
public class CandidatureController {

    @GetMapping
    public List<Map<String, String>> list() {
        return List.of();
    }

    @GetMapping("/hello")
    public Map<String, String> hello() {
        return Map.of("service", "candidature", "status", "UP");
    }
}
