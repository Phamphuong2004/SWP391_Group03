package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.ResultCreationRequest;
import com.swp.adnV2.AdnV2.dto.ResultUpdateRequest;
import com.swp.adnV2.AdnV2.entity.Result;
import com.swp.adnV2.AdnV2.service.ResultService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RequestMapping("/api/results")
public class ResultController {
@Autowired
    private ResultService resultService;

    @PostMapping("/create")
    Result createRequest(@RequestBody ResultCreationRequest request) {
        return resultService.createResult(request);
    }

    @GetMapping("/getList")
    public List<Result> getAllResults() {
        return resultService.getAllResults();
    }

    @GetMapping("/{result_id}")
    public Result getResultById(@PathVariable("result_id") Long resultId) {
        return resultService.getResultById(resultId);
    }

    @PutMapping("/{result_id}")
    public Result updateResult(@PathVariable Long result_id, @RequestBody ResultUpdateRequest request) {
        return resultService.updateResult(result_id, request);
    }

    @DeleteMapping("/{result_id}")
    public String deleteResult(@PathVariable Long result_id) {
        resultService.deleteResult(result_id);
        return "Result has been deleted successfully";
    }
}
