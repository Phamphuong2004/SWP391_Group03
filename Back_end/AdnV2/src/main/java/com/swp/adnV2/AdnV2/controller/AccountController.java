package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.dto.RegisterRequest;
import com.swp.adnV2.AdnV2.entity.Users;
import com.swp.adnV2.AdnV2.service.ManagerAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/manager/accounts")

public class AccountController {
    @Autowired
    private ManagerAccountService accountService;

    @GetMapping
    public ResponseEntity<List<Users>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Users> getAccount(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Users> updateAccount(@PathVariable Long id,
                                               @RequestBody Users account) {
        return ResponseEntity.ok(accountService.updateAccount(id, account));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAccount(@PathVariable Long id) {
        try {
            accountService.deleteAccount(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            String msg = e.getMessage();
            if (msg != null && msg.contains("liên quan")) {
                return ResponseEntity.badRequest().body(msg);
            }
            return ResponseEntity.status(500).body("Lỗi hệ thống: " + msg);
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Users> createAccount(@RequestBody RegisterRequest newAccount) {
        return ResponseEntity.status(201).body(accountService.createAccount(newAccount));
    }
}