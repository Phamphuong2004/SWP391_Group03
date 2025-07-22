package com.swp.adnV2.AdnV2.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestTemplate;

@Service
public class YourTrackService {
    private static final Logger logger = LoggerFactory.getLogger(YourTrackService.class);

    private final String yourTrackUrl = "https://baoz.youtrack.cloud/api/issues";
    private final String yourTrackToken = "perm-bmd1eWVucXVvY3RhaTIwMjJudA==.NDQtMg==.F0VoEzlrY7i47CX787GnXhOdCJXwcb";
    private final String projectShortName = "DEM";

    public void createIssue(String summary, String description) {
        RestTemplate restTemplate = new RestTemplate();

        String safeSummary = summary.replace("\"", "\\\"");
        String safeDescription = description.replace("\n", "\\n").replace("\"", "\\\"");


        String jsonBody = "{"
                + "\"project\": {\"shortName\": \"" + projectShortName + "\"},"
                + "\"summary\": \"" + safeSummary + "\","
                + "\"description\": \"" + safeDescription + "\""
                + "}";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + yourTrackToken);

        HttpEntity<String> entity = new HttpEntity<>(jsonBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    yourTrackUrl,
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            if (!response.getStatusCode().is2xxSuccessful()) {
                logger.error("Failed to create issue on YouTrack: {} - {}", response.getStatusCode(), response.getBody());
                throw new RuntimeException("YouTrack API error: " + response.getStatusCode() + " - " + response.getBody());
            }
            logger.info("Created issue on YouTrack: {}", response.getBody());
        } catch (HttpClientErrorException | HttpServerErrorException e) {
            logger.error("YouTrack API error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString(), e);
            throw new RuntimeException("YouTrack API error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString(), e);
        } catch (ResourceAccessException e) {
            logger.error("Cannot connect to YouTrack API: {}", e.getMessage(), e);
            throw new RuntimeException("Cannot connect to YouTrack API: " + e.getMessage(), e);
        } catch (Exception e) {
            logger.error("Unknown error when creating issue on YouTrack", e);
            throw new RuntimeException("Unknown error when creating issue: " + e.getMessage(), e);
        }
    }
}
