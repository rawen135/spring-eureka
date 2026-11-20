package org.example.job;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private static final Logger log = LoggerFactory.getLogger(JobController.class);

    @GetMapping
    public List<Map<String, String>> list() {
        return List.of();
    }

    @GetMapping("/hello")
    public Map<String, String> hello() {
        log.debug("Endpoint GET /api/jobs/hello appele");
        return Map.of("service", "job", "status", "UP");
    }
}
