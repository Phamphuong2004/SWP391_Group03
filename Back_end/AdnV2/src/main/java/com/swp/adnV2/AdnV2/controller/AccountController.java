package com.swp.adnV2.AdnV2.controller;

@RestController
@RequestMapping("/api/manager/accounts")
@PreAuthorize("hasRole('MANAGER')")
public class AccountController {
    @Autowired
    private ManagerAccountService accountService;

    @GetMapping
    public ResponseEntity<List<ManageAccount>> getAllAccounts() {
        return ResponseEntity.ok(accountService.getAllAccounts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ManageAccount> getAccount(@PathVariable Long id) {
        return ResponseEntity.ok(accountService.getAccountById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ManageAccount> updateAccount(@PathVariable Long id,
                                                       @RequestBody ManageAccount account) {
        return ResponseEntity.ok(accountService.updateAccount(id, account));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
}
