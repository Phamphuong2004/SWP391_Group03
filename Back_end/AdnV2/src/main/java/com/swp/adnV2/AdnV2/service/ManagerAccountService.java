import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;
@Service
public class ManagerAccountService {

    @Autowired

    @Autowired
    private PasswordEncoder passwordEncoder;

        return accountRepo.findAll();
    }

        return accountRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Account not found"));
    }


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

