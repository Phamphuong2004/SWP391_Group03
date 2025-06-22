package com.swp.adnV2.AdnV2.controller;

import com.swp.adnV2.AdnV2.entity.Users;
import com.swp.adnV2.AdnV2.service.ManagerAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/manager/accounts")
@PreAuthorize("hasRole('MANAGER')")
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
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
}