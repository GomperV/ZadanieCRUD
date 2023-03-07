import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';

function Published() {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8091/api/baza/published')
      .then(response => setBooks(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Books list</h1>
      <ul>
        {books.map(book => (
          <li key={book.id}>{book.title} ({book.published})</li>
        ))}
      </ul>
    </div>
  );
}

export default Published;