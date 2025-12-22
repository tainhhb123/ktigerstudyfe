package org.example.ktigerstudybe.controller;

import org.example.ktigerstudybe.model.UserXP;
import org.example.ktigerstudybe.service.UserXPService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/userxp")
@CrossOrigin(origins = "*")
public class UserXPController {

    @Autowired
    private UserXPService userXPService;

    // Lấy UserXP theo userId cho Profile page
    @GetMapping("/user/{userId}")
    public ResponseEntity<UserXP> getUserXPByUserId(@PathVariable Long userId) {
        try {
            UserXP userXP = userXPService.findByUserId(userId);
            if (userXP != null) {
                return ResponseEntity.ok(userXP);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
