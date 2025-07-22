package com.swp.adnV2.AdnV2.service;

import com.swp.adnV2.AdnV2.dto.RegisterRequest;
import com.swp.adnV2.AdnV2.entity.Users;
import com.swp.adnV2.AdnV2.repository.AccountRepository;
import com.swp.adnV2.AdnV2.repository.AppointmentRepository;
import com.swp.adnV2.AdnV2.repository.LoginHistoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;
@Service
public class ManagerAccountService {
    @Autowired
    private LoginHistoryRepository loginHistoryRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

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

    public Users createAccount(RegisterRequest newAccount) {

        if (accountRepo.existsByEmail(newAccount.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (accountRepo.existsByUsername(newAccount.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (newAccount.getPassword() == null || newAccount.getPassword().isEmpty()) {
            throw new RuntimeException("Password cannot be null or empty");
        }
        if (newAccount.getEmail() == null || newAccount.getEmail().isEmpty()) {
            throw new RuntimeException("Email cannot be null or empty");
        }

        Users user = new Users();
        user.setEmail(newAccount.getEmail());
        user.setPassword(passwordEncoder.encode(newAccount.getPassword()));
        user.setRole("MANAGER");

        if (newAccount.getFullName() != null && !newAccount.getFullName().isEmpty()) {
            user.setFullName(newAccount.getFullName());
        } else {
            throw new RuntimeException("Full name cannot be null or empty");
        }

        if (newAccount.getPhone() != null && !newAccount.getPhone().isEmpty()) {
            if (!newAccount.getPhone().matches("^\\+?[0-9]{10,15}$")) {
                throw new RuntimeException("Invalid phone number format");
            }
            user.setPhone(newAccount.getPhone());
        } else {
            throw new RuntimeException("Phone number cannot be null or empty");
        }

        if (newAccount.getAddress() != null && !newAccount.getAddress().isEmpty()) {
            user.setAddress(newAccount.getAddress());
        } else {
            throw new RuntimeException("Address cannot be null or empty");
        }

        if (newAccount.getUsername() != null && !newAccount.getUsername().isEmpty()) {
            user.setUsername(newAccount.getUsername());
        } else {
            throw new RuntimeException("Username cannot be null or empty");
        }

        if (newAccount.getConfirmPassword() == null || newAccount.getConfirmPassword().isEmpty()) {
            throw new RuntimeException("Confirm password cannot be null or empty");
        }

        if (!newAccount.getPassword().equals(newAccount.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }


        return accountRepo.save(user);
    }

    public Users updateAccount(Long id, Users updated) {
        Users acc = getAccountById(id);

        acc.setEmail(updated.getEmail());
        acc.setRole(updated.getRole());

        if (updated.getPassword() != null && !updated.getPassword().isEmpty()) {
            acc.setPassword(passwordEncoder.encode(updated.getPassword()));
        }

        if (updated.getFullName() != null && !updated.getFullName().isEmpty()) {
            acc.setFullName(updated.getFullName());
        } else {
            throw new RuntimeException("Full name cannot be null or empty");
        }

        if (updated.getPhone() != null && !updated.getPhone().isEmpty()) {
            if (!updated.getPhone().matches("^\\+?[0-9]{10,15}$")) {
                throw new RuntimeException("Invalid phone number format");
            }
            acc.setPhone(updated.getPhone());
        } else {
            throw new RuntimeException("Phone number cannot be null or empty");
        }

        if (updated.getAddress() != null && !updated.getAddress().isEmpty()) {
            acc.setAddress(updated.getAddress());
        } else {
            throw new RuntimeException("Address cannot be null or empty");
        }
        if (updated.getEmail() != null && !updated.getEmail().isEmpty()) {
            acc.setEmail(updated.getEmail());
        } else {
            throw new RuntimeException("Email cannot be null or empty");
        }

        if (updated.getUsername() != null && !updated.getUsername().isEmpty()) {
            acc.setUsername(updated.getUsername());
        } else {
            throw new RuntimeException("Username cannot be null or empty");
        }

//        if (updated.getConfirmPassword() == null || updated.getConfirmPassword().isEmpty()) {
//            throw new RuntimeException("Confirm password cannot be null or empty");
//        }

//        if (!updated.getPassword().equals(updated.getConfirmPassword())) {
//            throw new RuntimeException("Passwords do not match");
//        }

        if (accountRepo.existsByEmail(updated.getEmail()) && !acc.getEmail().equals(updated.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (accountRepo.existsByUsername(updated.getUsername()) && !acc.getUsername().equals(updated.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (updated.getPassword() != null && !updated.getPassword().isEmpty()) {
            acc.setPassword(passwordEncoder.encode(updated.getPassword()));
        }

        if (updated.getRole() != null && !updated.getRole().isEmpty()) {
            acc.setRole(updated.getRole());
        } else {
            throw new RuntimeException("Role cannot be null or empty");
        }

        if (!acc.getRole().equals("MANAGER") && !acc.getRole().equals("CUSTOMER") && !acc.getRole().equals("STAFF")) {
            throw new RuntimeException("Invalid role. Must be either 'MANAGER' or 'CUSTOMER' or 'STAFF'");
        }

        if (updated.getDateOfBirth() != null) {
            acc.setDateOfBirth(updated.getDateOfBirth());
        } else {
            throw new RuntimeException("Date of birth cannot be null");
        }

        if (updated.getGender() != null && !updated.getGender().isEmpty()) {
            acc.setGender(updated.getGender());
        } else {
            throw new RuntimeException("Gender cannot be null or empty");
        }

        if (!acc.getGender().equals("male") && !acc.getGender().equals("female") && !acc.getGender().equals("other")) {
            throw new RuntimeException("Gender must be either '");
        }
        acc.setAvatar(updated.getAvatar());


        return accountRepo.save(acc);
    }

    @Transactional
    public void deleteAccount(Long id) {
        // Xóa login_history
        loginHistoryRepository.deleteByUsers_UserId(id);

        // Nếu muốn xóa luôn appointment, mở comment dòng dưới
        appointmentRepository.deleteByUsers_UserId(id);

        // Nếu vẫn muốn kiểm tra còn appointment không thì giữ lại kiểm tra này
        if (appointmentRepository.existsByUsers_UserId(id)) {
            throw new RuntimeException("Không thể xóa tài khoản vì còn lịch hẹn liên quan.");
        }

        // Xóa user
        accountRepo.deleteById(id);
    }
}

