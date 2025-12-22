package com.example.ktigerstudy.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "userxp")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserXP {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "userxpid")
    private Integer userxpid;
    
    @Column(name = "current_badge")
    private String currentBadge;
    
    @Column(name = "current_title")
    private String currentTitle;
    
    @Column(name = "level_number")
    private Integer levelNumber;
    
    @Column(name = "totalxp")
    private Integer totalxp;
    
    @Column(name = "userid")
    private Integer userid;
}
