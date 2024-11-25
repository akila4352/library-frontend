import React, { useState, useEffect } from 'react';
import NavItems from "../../atoms/Navitems";
import 'bootstrap/dist/css/bootstrap.min.css';

import './styles.css';
import logo from './logo.png';
import { useUser } from '../../../pages/User/UserContext'; 
import supabase from '../../../helper/superbaseClient'; // Correcting the spelling of 'supabase'
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { FaUserCircle, FaShoppingCart, FaSignOutAlt } from 'react-icons/fa'; // Import the Log Out icon


function Navbar2() {
  const { user, setUser } = useUser(); // Assuming setUser is provided for logging out
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  const toggleCartPopup = () => setIsCartOpen(!isCartOpen);
  const toggleProfilePopup = () => setIsProfileOpen(!isProfileOpen);

  useEffect(() => {
    if (isCartOpen) {
      fetchBorrowedBooks();
    }
  }, [isCartOpen]);
// Endpoint to fetch borrowed books
const fetchBorrowedBooks = async () => {
  try {
      const response = await fetch(`https://test2app-e9c794ac2195.herokuapp.com/borrowed-books`);
      const data = await response.json();

      if (response.ok) {
          setBorrowedBooks(data.books);
      } else {
          console.error("Error fetching borrowed books:", data.error);
      }
  } catch (error) {
      console.error("Error fetching borrowed books:", error);
  }
};


  const formatDate = (timestamp) => {
    if (timestamp) {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }
      return date.toLocaleString();
    }
    return "No date";
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut(); // Call Supabase to sign out
    if (error) {
      console.error("Logout error:", error);
    } else {
      setUser(null); // Update user context to null or handle state accordingly
      navigate('/'); // Redirect to home page
    }
  };

  const popupStyle = {
    position: 'absolute',
    top: '60px',  
    right: '10px',
    width: '10cm',
    height: '12cm',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    padding: '10px',
    zIndex: 1000,
    overflowY: 'auto'
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '5px',
    right: '10px',
    cursor: 'pointer',
    fontSize: '1.5rem',
    color: 'red'
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <img src={logo} alt="Logo" />
          </a>

          <div className="navbar-collapse justify-content-between">
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', marginLeft: 'auto' }} className="navbar-text mx-auto text-center">
              {user ? `Hi, welcome ${user}` : 'Hi, welcome Guest'}
            </div>

            <div className="d-flex align-items-center">
              <NavItems />

              {/* Cart icon with popup */}
              <div className="nav-link" onClick={toggleCartPopup}>
                <FaShoppingCart size={30} style={{ color: 'white', cursor: 'pointer', marginRight: '10px' }} />
              </div>
              {isCartOpen && (
                <div style={popupStyle}>
                  <span style={closeButtonStyle} onClick={() => setIsCartOpen(false)}>&times;</span>
                  <h5>Borrowed Books</h5>
                  <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                      <tr>
                        <th>Book</th>
                        <th>Borrow Date</th>
                        <th>Return By</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {borrowedBooks.length > 0 ? (
                        borrowedBooks.map((book) => (
                          <tr key={book.id}>
                            <td>{book.books.title}</td>
                            <td>{formatDate(book.borrowed_at)}</td>
                            <td>{formatDate(book.return_by)}</td>
                            <td>{book.status ? 'Approved' : 'Not Approved'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">No borrowed books</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Profile icon with popup */}
              <div className="nav-link" onClick={toggleProfilePopup}>
                <FaUserCircle size={30} style={{ color: 'white', cursor: 'pointer' }} />
              </div>
              {isProfileOpen && (
                <div style={popupStyle}>
                  <span style={closeButtonStyle} onClick={() => setIsProfileOpen(false)}>&times;</span>
                  <h5>Profile</h5>
                  <p><strong>User:</strong> {user || 'Guest'}</p>
                  <div style={{ marginTop: '20px', textAlign: 'center' }}>
                    <FaSignOutAlt 
                      size={20} 
                      style={{ color: 'black', cursor: 'pointer' }} 
                      onClick={handleLogout} 
                    />
                    <p onClick={handleLogout} style={{ cursor: 'pointer', color: 'black' }}>Log Out</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar2;