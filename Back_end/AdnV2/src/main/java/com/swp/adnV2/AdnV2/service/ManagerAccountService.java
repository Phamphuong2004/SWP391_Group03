import com.swp.adnV2.AdnV2.entity.User;
import com.swp.adnV2.AdnV2.repository.ManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;
@Service
public class ManagerAccountService {

    @Autowired
    private ManagerRepository accountRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllAccounts() {
        return accountRepo.findAll();
    }

    public ManageAccount getAccountById(Long id) {
        return accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }

    public ManageAccount updateAccount(Long id, ManageAccount updated) {
        ManageAccount acc = getAccountById(id);

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

