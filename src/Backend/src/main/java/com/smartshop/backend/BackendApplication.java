package com.smartshop.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.beans.factory.annotation.Value;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.smartshop.backend.models.Product;
import com.smartshop.backend.repositories.ProductRepository;

import java.util.List;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	CommandLineRunner seedDatabase(
			ProductRepository productRepository,
			@Value("${smartshop.seed.products.mode:if-empty}") String seedMode
	) {
		return args -> {
			try {
				ObjectMapper mapper = new ObjectMapper();
				mapper.registerModule(new JavaTimeModule());
				ClassPathResource resource = new ClassPathResource("data/product-seed.json");
				TypeReference<List<Product>> typeReference = new TypeReference<List<Product>>() {};
				List<Product> products = mapper.readValue(resource.getInputStream(), typeReference);

				if ("replace".equalsIgnoreCase(seedMode)) {
					productRepository.deleteAll();
					productRepository.saveAll(products);
					System.out.println("✓ Replaced products with seed data (" + products.size() + ")");
					return;
				}

				long count = productRepository.count();
				if (count == 0) {
					productRepository.saveAll(products);
					System.out.println("✓ Seeded " + products.size() + " products into MongoDB Atlas.");
				} else {
					System.out.println("✓ Database already has " + count + " products, skipping seed.");
				}
			} catch (Exception e) {
				System.err.println("✗ Failed to seed product data: " + e.getMessage());
				e.printStackTrace();
			}
		};
	}
}


