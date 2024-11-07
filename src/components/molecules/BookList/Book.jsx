import React, { useEffect, useState } from 'react';
import './book.css';
import Bookitem from '../BookList/bookitem';

const Book = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/books');
        if (!response.ok) {
          throw new Error('Failed to load books');
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        setError("Failed to load books.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <ul className="footer__links">
        <li className='left'>
          {books.slice(0, 3).map(book => (
            <Bookitem
              key={book.id}
              imgSrc={book.imgsrc}
              title={book.title}
              description={book.description}
              bookId={book.id} // Added bookId prop
            />
          ))}
        </li>
        <li>
          {books.slice(3, 6).map(book => (
            <Bookitem
              key={book.id}
              imgSrc={book.imgsrc}
              title={book.title}
              description={book.description}
              bookId={book.id} // Added bookId prop
            />
          ))}
        </li>
      </ul>
    </div>
  );
};

export default Book;
