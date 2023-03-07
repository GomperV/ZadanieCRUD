package com.example.zadanieCrud;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ZadanieRepository extends JpaRepository<Zadanie, Long> {
    List<Zadanie> findByPublished(boolean published);

    List<Zadanie> findByTitleContaining(String title);
}