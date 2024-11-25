import React from 'react';
import './book.css';
import supabase from '../../../helper/superbaseClient';

const Bookitem = ({ imgSrc, title, description, bookId, userId }) => {
  const handleBorrow = async () => {
    try {
      // Check if the user has an unreturned book
      const { data: borrowedBooks, error: fetchError } = await supabase
        .from('borrowedbooks')
        .select('*')
        .eq('user_id', userId)
        .eq('status', false); // Assuming false indicates unreturned

      if (fetchError) {
        console.error("Error checking borrowed books:", fetchError);
        alert("Failed to check borrowed books.");
        return;
      }

      // Prevent borrowing if there’s an unreturned book
      if (borrowedBooks.length > 0) {
        alert("You must return your current borrowed book before borrowing another.");
        return;
      }

      // Proceed to borrow the book if no unreturned books
      const { data, error } = await supabase
        .from('borrowedbooks')
        .insert([
          {
            book_id: bookId,
            user_id: userId,
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
