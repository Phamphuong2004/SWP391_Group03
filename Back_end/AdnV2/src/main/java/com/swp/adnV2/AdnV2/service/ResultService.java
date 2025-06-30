package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.ResultCreationRequest;
import com.swp.adnV2.AdnV2.dto.ResultUpdateRequest;
import com.swp.adnV2.AdnV2.entity.Result;
import com.swp.adnV2.AdnV2.entity.Sample;
import com.swp.adnV2.AdnV2.entity.Users;
import com.swp.adnV2.AdnV2.repository.ResultRepository;
import com.swp.adnV2.AdnV2.repository.SampleRepository;
import com.swp.adnV2.AdnV2.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ResultService {
   @Autowired
    private ResultRepository resultRepository;
    private SampleRepository sampleRepository;
    private UserRepository userRepository;


    public Result createResult(ResultCreationRequest request) {
        Result result = new Result();
        result.setResultDate(request.getResultDate());
        result.setResultData(request.getResultData());
        result.setInterpretation(request.getInterpretation());
        
        result.setStatus(request.getStatus());
        Users user = userRepository.findByUsername(request.getUsername());
        if (user == null) {
            throw new RuntimeException("User not found with username: " + request.getUsername());
        }
        result.setUser(user);
        result.setResultFile(request.getResultFile());
        return resultRepository.save(result);
    }

    public Result updateResult(Long resultId, ResultUpdateRequest request) {
        Result result = getResultById(resultId);

        result.setResultDate(request.getResultDate());
        result.setResultData(request.getResultData());
        result.setInterpretation(request.getInterpretation());

        result.setStatus(request.getStatus());
        Users user = userRepository.findByUsername(request.getUsername());
        if (user == null) {
            throw new RuntimeException("User not found with username: " + request.getUsername());
        }
        result.setUser(user);
        result.setResultFile(request.getResultFile());
        return resultRepository.save(result);
    }

    public void deleteResult(Long resultId) {
        resultRepository.deleteById(resultId);
    }

    public List<Result> getAllResults() {
        return resultRepository.findAll();
    }

    public Result getResultById(Long resultId) {
        return resultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Result not found with id: " + resultId));
    }
}
