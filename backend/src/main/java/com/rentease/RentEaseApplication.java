package com.rentease;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RentEaseApplication {

	public static void main(String[] args) {
		SpringApplication.run(RentEaseApplication.class, args);
	}

}
