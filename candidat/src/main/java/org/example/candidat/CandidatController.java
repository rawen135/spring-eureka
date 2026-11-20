package org.example.candidat;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/candidats")
public class CandidatController {

    @GetMapping
    public List<Map<String, String>> list() {
        return List.of();
    }

    @GetMapping("/hello")
    public Map<String, String> hello() {
        return Map.of("service", "candidat", "status", "UP");
    }
}
