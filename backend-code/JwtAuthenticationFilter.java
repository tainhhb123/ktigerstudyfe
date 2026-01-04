package org.example.ktigerstudybe.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * JWT Authentication Filter
 * 
 * Filter này chạy TRƯỚC MỌI REQUEST để:
 * 1. Extract JWT token từ Authorization header
 * 2. Validate token
 * 3. Extract user info (userId, role)
 * 4. Lưu vào SecurityContext để các @PreAuthorize check được
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtTokenProvider tokenProvider;

    /**
     * Main filter method - chạy cho mỗi HTTP request
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        try {
            // 1. Lấy JWT token từ request header
            String jwt = getJwtFromRequest(request);

            // 2. Validate token và extract thông tin
            if (StringUtils.hasText(jwt) && tokenProvider.validateToken(jwt)) {
                
                // 3. Extract user info từ token
                Long userId = tokenProvider.getUserIdFromToken(jwt);
                String email = tokenProvider.getEmailFromToken(jwt);
                String role = tokenProvider.getRoleFromToken(jwt);

                // Debug log
                System.out.println("🔐 JWT Auth: userId=" + userId + ", email=" + email + ", role=" + role);

                // 4. Tạo authorities (ROLE_USER hoặc ROLE_ADMIN)
                List<GrantedAuthority> authorities = new ArrayList<>();
                authorities.add(new SimpleGrantedAuthority("ROLE_" + role)); // ROLE_USER / ROLE_ADMIN

                // 5. Tạo Authentication object
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(userId, null, authorities);
                
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 6. Lưu vào SecurityContext (cho Spring Security check)
                SecurityContextHolder.getContext().setAuthentication(authentication);
                
                System.out.println("✅ JWT Auth successful for user: " + userId);
            } else {
                System.out.println("⚠️ No valid JWT token found");
            }

        } catch (Exception ex) {
            System.err.println("❌ JWT Auth failed: " + ex.getMessage());
            ex.printStackTrace();
        }

        // 7. Continue filter chain
        filterChain.doFilter(request, response);
    }

    /**
     * Extract JWT token từ Authorization header
     * Expected format: "Authorization: Bearer <token>"
     * 
     * @param request - HTTP request
     * @return JWT token string (hoặc null nếu không có)
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        
        // Debug log
        if (bearerToken != null) {
            System.out.println("📨 Authorization header: " + bearerToken.substring(0, Math.min(20, bearerToken.length())) + "...");
        } else {
            System.out.println("📭 No Authorization header found");
        }

        // Check format: "Bearer <token>"
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Remove "Bearer " prefix
        }
        
        return null;
    }
}
