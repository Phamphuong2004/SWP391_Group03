package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.ResultCreationRequest;
import com.swp.adnV2.AdnV2.dto.ResultReponse;
import com.swp.adnV2.AdnV2.dto.ResultUpdateRequest;
import com.swp.adnV2.AdnV2.entity.Result;
import com.swp.adnV2.AdnV2.entity.CollectedSample;
import com.swp.adnV2.AdnV2.entity.Users;
import com.swp.adnV2.AdnV2.repository.AppointmentRepository;
import com.swp.adnV2.AdnV2.repository.ResultRepository;
import com.swp.adnV2.AdnV2.repository.SampleRepository;
import com.swp.adnV2.AdnV2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;

@Service
public class ResultService {
    @Autowired
    private ResultRepository resultRepository;
    @Autowired
    private SampleRepository sampleRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;


    public ResultReponse createResult(ResultCreationRequest request) {
        Result result = new Result();
        result.setResultDate(request.getResultDate());
        result.setResultData(request.getResultData());
        result.setInterpretation(request.getInterpretation());
        List<CollectedSample> collectedSamples = sampleRepository.findAllById(request.getSampleId());
        result.setCollectedSample(collectedSamples);

        result.setStatus(request.getStatus());
        Users user = userRepository.findByUsername(request.getUsername());
        if (user == null) {
            throw new RuntimeException("User not found with username: " + request.getUsername());
        }
        result.setUser(user);
        Result existingResult = resultRepository.findByAppointment_AppointmentId(request.getAppointmentId());
        if (existingResult != null) {
            throw new RuntimeException("Result already exists for appointment with id: " + request.getAppointmentId());
        }
        if (request.getAppointmentId() != null) {
            result.setAppointment(appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + request.getAppointmentId())));
        }
        if (request.getResultFile() == null || request.getResultFile().isEmpty()) {
            throw new RuntimeException("Result file cannot be null or empty");
        }


        if (!request.getResultFile().matches("^[a-zA-Z0-9._-]+$")) {
            throw new RuntimeException("Result file name contains invalid characters");
        }
        if (!request.getResultFile().endsWith(".pdf") && !request.getResultFile().endsWith(".docx")
                && !request.getResultFile().endsWith(".doc")) {
            throw new RuntimeException("Result file must be a PDF or DOCX or DOC file");
        }

        result.setResultFile(request.getResultFile());
        resultRepository.save(result);
        ResultReponse response = new ResultReponse();
        response.setResultId(result.getResultId());
        response.setResultDate(result.getResultDate());
        response.setResultData(result.getResultData());
        response.setInterpretation(result.getInterpretation());
        response.setStatus(result.getStatus());
        response.setSampleId(collectedSamples.stream().map(CollectedSample::getSampleId).toList());
        response.setUsername(result.getUser().getUsername());
        response.setAppointmentId(request.getAppointmentId());
        response.setResultFile(result.getResultFile());// Save the uploaded file to a directory
        return response;
    }

    public ResultReponse updateResult(Long resultId, ResultUpdateRequest request) {
        Result result = resultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Result not found with id: " + resultId));

        result.setResultDate(request.getResultDate());
        result.setResultData(request.getResultData());
        result.setInterpretation(request.getInterpretation());
        List<CollectedSample> collectedSamples = sampleRepository.findAllById(request.getSampleId());
        result.setCollectedSample(collectedSamples);

        result.setStatus(request.getStatus());
        Users user = userRepository.findByUsername(request.getUsername());
        if (user == null) {
            throw new RuntimeException("User not found with username: " + request.getUsername());
        }
        result.setUser(user);
        Result existingResult = resultRepository.findByAppointment_AppointmentId(request.getAppointmentId());
        if (existingResult != null && !existingResult.getResultId().equals(resultId)) {
            throw new RuntimeException("Result already exists for appointment with id: " + request.getAppointmentId());
        }
        if (request.getAppointmentId() != null) {
            result.setAppointment(appointmentRepository.findById(request.getAppointmentId())
                    .orElseThrow(() -> new RuntimeException("Appointment not found with id: " + request.getAppointmentId())));
        }
        if (request.getResultFile() == null || request.getResultFile().isEmpty()) {
            throw new RuntimeException("Result file cannot be null or empty");
        }
        String fileName = request.getResultFile();

        if (!request.getResultFile().matches("^[a-zA-Z0-9._-]+$")) {
            throw new RuntimeException("Result file name contains invalid characters");
        }
        if (!request.getResultFile().endsWith(".pdf") && !request.getResultFile().endsWith(".docx")
                && !request.getResultFile().endsWith(".doc")) {
            throw new RuntimeException("Result file must be a PDF or DOCX or DOC file");
        }

        result.setResultFile(request.getResultFile());
        resultRepository.save(result);
        ResultReponse response = new ResultReponse();
        response.setResultId(result.getResultId());
        response.setResultDate(result.getResultDate());
        response.setResultData(result.getResultData());
        response.setInterpretation(result.getInterpretation());
        response.setStatus(result.getStatus());
        response.setSampleId(collectedSamples.stream().map(CollectedSample::getSampleId).toList());
        response.setUsername(result.getUser().getUsername());
        response.setAppointmentId(result.getAppointment() != null ? result.getAppointment().getAppointmentId() : null);
        response.setResultFile(result.getResultFile());
        return response;
    }

    public void deleteResult(Long resultId) {
        Result result = resultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Result not found with id: " + resultId));
        resultRepository.deleteById(resultId);
    }

    public List<ResultReponse> getAllResults() {
        List<Result> results = resultRepository.findAll();
        if (results.isEmpty()) {
            throw new RuntimeException("No results found");
        }
        return results.stream().map(result -> {
            ResultReponse response = new ResultReponse();
            response.setResultId(result.getResultId());
            response.setResultDate(result.getResultDate());
            response.setResultData(result.getResultData());
            response.setInterpretation(result.getInterpretation());
            response.setStatus(result.getStatus());
            response.setSampleId(result.getCollectedSample().stream().map(CollectedSample::getSampleId).toList());
            response.setUsername(result.getUser().getUsername());
            response.setAppointmentId(result.getAppointment() != null ? result.getAppointment().getAppointmentId() : null);
            response.setResultFile(result.getResultFile());
            return response;
        }).toList();
    }

    public ResultReponse getResultById(Long resultId) {
        Result result = resultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Result not found with id: " + resultId));
        if (result == null) {
            throw new RuntimeException("Result not found with id: " + resultId);
        }
        ResultReponse response = new ResultReponse();
        response.setResultId(result.getResultId());
        response.setResultDate(result.getResultDate());
        response.setResultData(result.getResultData());
        response.setInterpretation(result.getInterpretation());
        response.setStatus(result.getStatus());
        response.setSampleId(result.getCollectedSample().stream().map(CollectedSample::getSampleId).toList());
        response.setUsername(result.getUser().getUsername());
        response.setAppointmentId(result.getAppointment() != null ? result.getAppointment().getAppointmentId() : null);
        response.setResultFile(result.getResultFile());
        return response;
    }
    public ResultReponse getResultByAppointmentId(Long appointmentId) {
        Result result = resultRepository.findByAppointment_AppointmentId(appointmentId);
        if (result == null) {
            throw new RuntimeException("Result not found for appointment with id: " + appointmentId);
        }
        ResultReponse response = new ResultReponse();
        response.setResultId(result.getResultId());
        response.setResultDate(result.getResultDate());
        response.setResultData(result.getResultData());
        response.setInterpretation(result.getInterpretation());
        response.setStatus(result.getStatus());
        response.setSampleId(result.getCollectedSample().stream().map(CollectedSample::getSampleId).toList());
        response.setUsername(result.getUser().getUsername());
        response.setAppointmentId(result.getAppointment() != null ? result.getAppointment().getAppointmentId() : null);
        response.setResultFile(result.getResultFile());
        return response;
    }
}
