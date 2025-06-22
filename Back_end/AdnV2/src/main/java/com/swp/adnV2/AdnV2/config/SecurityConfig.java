package com.swp.adnV2.AdnV2.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(auth -> auth
                        // Cho phép truy cập Swagger UI và API Docs
                        .requestMatchers("/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/api/create/guest-appointment/**").permitAll()

                        // Đường dẫn công khai - ai cũng có thể truy cập
                        .requestMatchers("/api/auth/**", "/api/auth/register", "/api/auth/signup").permitAll()
                        .requestMatchers("/api/register", "/api/signup", "/api/user/register").permitAll()

                        // Cho phép truy cập các controller liên quan đến đăng ký người dùng
                        .requestMatchers("/user-controller/**", "/api/user-controller/**").permitAll()

                        // API dành cho Guest - không cần xác thực
                        .requestMatchers("/api/view-appointment-guest").permitAll()

                        // API dành cho Customer - yêu cầu role CUSTOMER
                        .requestMatchers("/api/create-appointment").hasAnyRole("CUSTOMER", "STAFF", "MANAGER")
                        .requestMatchers("/api/user/*/get-appointments-by-status").hasAnyRole("CUSTOMER", "STAFF", "MANAGER")
                        .requestMatchers("/api/user/profile").hasAnyRole("CUSTOMER", "STAFF", "MANAGER")
                        .requestMatchers("/api/view-appointments-user").hasAnyRole("CUSTOMER", "STAFF", "MANAGER")

                        // API dành cho Staff - yêu cầu role STAFF
                        .requestMatchers("/api/update-status/**").hasAnyRole("STAFF", "MANAGER")
                        .requestMatchers("/api/view-appointment-detail/**").hasAnyRole("STAFF", "MANAGER")

                        // API dành cho Manager - chỉ MANAGER mới có quyền
                        .requestMatchers("/api/admin/**").hasRole("MANAGER")

                        // API dành cho người dùng đã xác thực (đã đăng nhập)
                        .requestMatchers("/api/user/profile/update").authenticated()
                        .requestMatchers("/api/user/reset-password").authenticated()

                        // Mặc định, mọi request khác đều yêu cầu xác thực
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // Thêm filter ghi log để debug
        http.addFilterBefore(new OncePerRequestFilter() {
            @Override
            protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
                    throws ServletException, IOException {
                System.out.println("REQUEST URI: " + request.getRequestURI());
                System.out.println("REQUEST METHOD: " + request.getMethod());
                chain.doFilter(request, response);
            }
        }, UsernamePasswordAuthenticationFilter.class);

        http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // Nếu chưa có phương thức này, hãy thêm vào
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("authorization", "content-type", "x-auth-token"));
        configuration.setExposedHeaders(Arrays.asList("x-auth-token"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return org.springframework.security.crypto.password.NoOpPasswordEncoder.getInstance();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
}