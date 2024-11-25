import React from 'react';
import './book.css';
import supabase from '../../../helper/superbaseClient';

const Bookitem = ({ imgSrc, title, description, bookId }) => {
  const userId = 1; // Replace with the actual user ID if available

  const handleBorrow = async () => {
    try {
      // Insert a new borrowed book entry into the database
      const { data, error } = await supabase
        .from('borrowedbooks')
        .insert([
          {
            book_id: bookId,
            user_id: 1, // Replace with the actual user ID
            status: false, // Mark as not returned
          },
        ]);
  
      if (error) {
        console.error("Error borrowing book:", error);
        alert("Failed to borrow book.");
      } else {
        alert(`Book borrowed successfully! Return within 7 days.`);
      }
    } catch (error) {
      console.error("Error in borrowing book:", error);
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
