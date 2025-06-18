package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.service.ADNService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/services")
public class ServicesController {
    @Autowired
    private ADNService adnService;

    @GetMapping("/view-all-service")
    public ResponseEntity<?> viewAllServices() {
        return adnService.viewAllServices();
    }

    @GetMapping("/search-by-name")
    public ResponseEntity<?> searchByName(@RequestParam(required = false) String name) {
        return adnService.searchByName(name);
    }

//    @PostMapping("/add-service")
//    public ResponseEntity<?> addService(@RequestParam String name, @RequestParam String description) {}
}
