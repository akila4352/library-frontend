import React, { useEffect, useState } from 'react';
import supabase from '../../../helper/superbaseClient';
import './book.css';
import Bookitem from '../BookList/bookitem';

const Book = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state/

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const { data, error } = await supabase.from('books').select('*');
        if (error) throw error;
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
