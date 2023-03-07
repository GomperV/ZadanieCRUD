package com.example.zadanieCrud;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3001")
@RestController
@RequestMapping("/api")
public class CampaignController {

    @Autowired
    CampaignRepository campaignRepository;

    @CrossOrigin(origins = "http://localhost:3001")
    @GetMapping("/baza")
    public ResponseEntity<List<Campaigns>> getAllCampaigns(@RequestParam(required = false) String name) {
        try {
            List<Campaigns> baza = new ArrayList<Campaigns>();

            if (name == null)
                campaignRepository.findAll().forEach(baza::add);
            else
                campaignRepository.findByNameContaining(name).forEach(baza::add);

            if (baza.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }

            return new ResponseEntity<>(baza, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CrossOrigin(origins = "http://localhost:3001")
    @GetMapping("/baza/{id}")
    public ResponseEntity<Campaigns> getCampaignById(@PathVariable("id") long id) {
        Optional<Campaigns> campaignData = campaignRepository.findById(id);

        if (campaignData.isPresent()) {
            return new ResponseEntity<>(campaignData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @CrossOrigin(origins = "http://localhost:3001")
    @PostMapping("/baza")
    public ResponseEntity<Campaigns> createCampaign(@RequestBody Campaigns campaigns) {
        try {
            Campaigns _campaigns = campaignRepository
                    .save(new Campaigns(campaigns.getId(),
                            campaigns.getName(),
                            campaigns.getKeywords(),
                            campaigns.getBidAmount(),
                            campaigns.getFunds(),
                            campaigns.isPublished(),
                            campaigns.getTowns(),
                            campaigns.getRadius()));
            return new ResponseEntity<>(_campaigns, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CrossOrigin(origins = "http://localhost:3001")
    @PutMapping("/baza/{id}")
    public ResponseEntity<Campaigns> updateCampaign(@PathVariable("id") long id, @RequestBody Campaigns campaigns) {
        Optional<Campaigns> campaignData = campaignRepository.findById(id);

        if (campaignData.isPresent()) {
            Campaigns _campaigns = campaignData.get();
            _campaigns.setName(campaigns.getName());
            _campaigns.setKeywords(campaigns.getKeywords());
            _campaigns.setBidAmount(campaigns.getBidAmount());
            _campaigns.setFunds(campaigns.getFunds());
            _campaigns.setPublished(campaigns.isPublished());
            _campaigns.setTowns(campaigns.getTowns());
            _campaigns.setRadius(campaigns.getRadius());

            return new ResponseEntity<>(campaignRepository.save(_campaigns), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @CrossOrigin(origins = "http://localhost:3001")
    @DeleteMapping("/baza/published/{id}")
    public ResponseEntity<HttpStatus> deleteCampaign(@PathVariable("id") long id) {
        try {

            campaignRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CrossOrigin(origins = "http://localhost:3001")
    @DeleteMapping("/baza")
    public ResponseEntity<HttpStatus> deleteAllCampaigns() {
        try {
            campaignRepository.deleteAll();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @CrossOrigin(origins = "http://localhost:3001")
    @GetMapping("/baza/published")
    public ResponseEntity<List<Campaigns>> findByPublished() {
        try {
            List<Campaigns> campaigns = campaignRepository.findByPublished(true);

            if (campaigns.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(campaigns, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}