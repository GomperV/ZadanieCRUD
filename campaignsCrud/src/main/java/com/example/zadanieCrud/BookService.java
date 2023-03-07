package com.example.zadanieCrud;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BookService {

    @Autowired
    private ZadanieRepository bookRepository;

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
}