import com.swp.adnV2.AdnV2.entity.ManageAccount;
import com.swp.adnV2.AdnV2.repository.ManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;
@Service
public class ManagerAccountService {

    @Autowired
    private AccountRepository accountRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<ManageAccount> getAllAccounts() {
        return accountRepo.findAll();
    }

    public User getAccountById(Long id) {
        return accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    public User updateAccount(Long id, User updated) {
        User acc = getAccountById(id);

        acc.setEmail(updated.getEmail());
        acc.setActive(updated.isActive());
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

