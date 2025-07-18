package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.KitComponentRequest;
import com.swp.adnV2.AdnV2.service.KitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/kit")
public class KitController {
    @Autowired
    private KitService kitService;

    @GetMapping("/get/{serviceId}")
//    @PreAuthorize("hasAnyRole('CUSTOMER','MANAGER', 'STAFF')")
    public ResponseEntity<?> getKitByServiceId(@PathVariable("serviceId") Long serviceId) {
        return kitService.getKitByServiceId(serviceId);
    }

    @PostMapping("/create/{serviceId}")
    @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
    public ResponseEntity<?> createKit(@PathVariable("serviceId") Long serviceId,
                                        @RequestBody KitComponentRequest kitComponentRequest) {
        return kitService.createKitByServiceId(serviceId, kitComponentRequest);
    }

    @PutMapping("/update/{kitComponentId}")
    @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
    public ResponseEntity<?> updateKit(
            @PathVariable("kitComponentId") Long kitComponentId,
            @RequestBody(required = false) KitComponentRequest kitComponentRequest) {

        return kitService.updateKitComponent(kitComponentId, kitComponentRequest);
    }

    @DeleteMapping("delete/{kitComponentId}")
    @PreAuthorize("hasAnyRole('MANAGER', 'STAFF')")
    public ResponseEntity<?> deleteKit(@PathVariable("kitComponentId") Long kitComponentId) {
        return kitService.deleteKitComponent(kitComponentId);
    }
}
