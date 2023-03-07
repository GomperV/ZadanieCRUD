package com.example.zadanieCrud;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:3001")
@RestController
@RequestMapping("/api")
public class ZadanieController {

    @Autowired
    ZadanieRepository zadanieRepository;

    @CrossOrigin(origins = "http://localhost:3001")
    @GetMapping("/baza")
    public ResponseEntity<List<Zadanie>> getAllZadania(@RequestParam(required = false) String title) {
        try {
            List<Zadanie> baza = new ArrayList<Zadanie>();

            if (title == null)
                zadanieRepository.findAll().forEach(baza::add);
            else
                zadanieRepository.findByTitleContaining(title).forEach(baza::add);

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
    public ResponseEntity<Zadanie> getZadanieById(@PathVariable("id") long id) {
        Optional<Zadanie> zadanieData = zadanieRepository.findById(id);

        if (zadanieData.isPresent()) {
            return new ResponseEntity<>(zadanieData.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping("/baza")
    public ResponseEntity<Zadanie> createZadanie(@RequestBody Zadanie zadanie) {
        try {
            Zadanie _zadanie = zadanieRepository
                    .save(new Zadanie(zadanie.getTitle(), zadanie.getDescription(), false));
            return new ResponseEntity<>(_zadanie, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/baza/{id}")
    public ResponseEntity<Zadanie> updateZadanie(@PathVariable("id") long id, @RequestBody Zadanie zadanie) {
        Optional<Zadanie> zadanieData = zadanieRepository.findById(id);

        if (zadanieData.isPresent()) {
            Zadanie _zadanie = zadanieData.get();
            _zadanie.setTitle(zadanie.getTitle());
            _zadanie.setDescription(zadanie.getDescription());
            _zadanie.setPublished(zadanie.isPublished());
            return new ResponseEntity<>(zadanieRepository.save(_zadanie), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @CrossOrigin(origins = "http://localhost:3001")
    @DeleteMapping("/baza/published/{id}")
    public ResponseEntity<HttpStatus> deleteZadanie(@PathVariable("id") long id) {
        System.out.println("Deleting zadanie with id: " + id);
        try {

            zadanieRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CrossOrigin(origins = "http://localhost:3001")
    @DeleteMapping("/baza")
    public ResponseEntity<HttpStatus> deleteAllZadania() {
        try {
            zadanieRepository.deleteAll();
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @GetMapping("/baza/published")
    public ResponseEntity<List<Zadanie>> findByPublished() {
        try {
            List<Zadanie> zadania = zadanieRepository.findByPublished(true);

            if (zadania.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(zadania, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}