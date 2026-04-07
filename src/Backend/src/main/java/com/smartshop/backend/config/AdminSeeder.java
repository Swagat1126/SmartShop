package com.smartshop.backend.config;

import com.smartshop.backend.models.User;
import com.smartshop.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

@Component
@Profile("local")
public class AdminSeeder implements ApplicationRunner {

    private final UserRepository userRepository;

    @Value("${smartshop.seed.admin.enabled:true}")
    private boolean enabled;

    @Value("${smartshop.seed.admin.name:Admin}")
    private String adminName;

    @Value("${smartshop.seed.admin.email:admin@smartshop.com}")
    private String adminEmail;

    @Value("${smartshop.seed.admin.password:admin123}")
    private String adminPassword;

    public AdminSeeder(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (!enabled) {
            return;
        }

        if (userRepository.existsByEmail(adminEmail)) {
            // Admin already exists; do nothing.
        } else {
            User admin = new User();
            admin.setName(adminName);
            admin.setEmail(adminEmail);
            admin.setPassword(adminPassword);
            admin.setRole("ADMIN");
            userRepository.save(admin);

            System.out.println("Seeded admin user: " + adminEmail);
        }
    }
}
