package com.bookfair.backend.config;

import com.paypal.core.PayPalEnvironment;
import com.paypal.core.PayPalHttpClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PayPalConfig {
    @Value("${paypal.client.id}")
    private String clientId;

    @Value("${paypal.client.secret}")
    private String clientSecret;

    @Value("${paypal.mode}")
    private String mode;

    @Bean
    public PayPalEnvironment payPalEnvironment() {
        if (mode.equalsIgnoreCase("sandbox")) {
            return new PayPalEnvironment.Sandbox(clientId, clientSecret);
        } else {
            return new PayPalEnvironment.Live(clientId, clientSecret);
        }
    }

    @Bean
    public PayPalHttpClient payPalHttpClient(PayPalEnvironment environment) {
        return new PayPalHttpClient(environment);
    }

}
