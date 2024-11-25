import React from 'react';
import './book.css';

const Bookitem = ({ imgSrc, title, description, bookId }) => {
  const userId = 1; // Replace with the actual user ID if available

  const handleBorrow = async () => {
    try {
      // Send POST request to borrow the book
      const response = await fetch('https://test2app-e9c794ac2195.herokuapp.com/borrow-book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          bookId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // Success message from the backend
      } else {
        alert(data.message); // Error message from the backend
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
      alert('Failed to borrow book.');
    }
  };

  return (
    <div className="image-container">
      <img src={imgSrc} alt={title} className="social-icon2" />
      <h3 className="footer__title1 color">{title}</h3>
      <p className="para">{description}</p>
      <button className="borrow-button" onClick={handleBorrow}>Borrow Book</button>
    </div>
  );
};

export default Bookitem;
