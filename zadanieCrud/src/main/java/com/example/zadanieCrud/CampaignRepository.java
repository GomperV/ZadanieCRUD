package com.example.zadanieCrud;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:3001")
public interface CampaignRepository extends JpaRepository<Campaigns, Long> {
    List<Campaigns> findByPublished(boolean published);

    List<Campaigns> findByNameContaining(String name);
}