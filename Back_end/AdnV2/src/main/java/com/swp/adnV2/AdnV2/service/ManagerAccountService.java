package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.entity.Users;
import com.swp.adnV2.AdnV2.repository.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class ManagerAccountService {

    @Autowired
    private AccountRepository accountRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<Users> getAllAccounts() {
        return accountRepo.findAll();
    }

    public Users getAccountById(Long id) {
        return accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    public Users updateAccount(Long id, Users updated) {
        Users acc = getAccountById(id);

        acc.setEmail(updated.getEmail());
        acc.setRole(updated.getRole());

        if (updated.getPassword() != null && !updated.getPassword().isEmpty()) {
            acc.setPassword(passwordEncoder.encode(updated.getPassword()));
        }

        return accountRepo.save(acc);
    }

    public void deleteAccount(Long id) {
        accountRepo.deleteById(id);
    }
}

