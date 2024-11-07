import React, { useState, useEffect } from 'react';
import './admin.css';

function AdminPanel() {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [bookData, setBookData] = useState({
    title: '',
    description: '',
    is_available: true,
    imgsrc: ''
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [view, setView] = useState('upload'); // State to manage which view to show

  // Define fetchBooks and fetchBorrowedBooks outside useEffect so they can be used elsewhere
  const fetchBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/books');
      const data = await response.json();
      setBooks(Array.isArray(data) ? data : []); // Ensure data is an array
    } catch (error) {
      console.error("Failed to fetch books:", error);
    }
  };

  const fetchBorrowedBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/borrowedbooks');
      const data = await response.json();
      setBorrowedBooks(Array.isArray(data) ? data : []); // Ensure data is an array
    } catch (error) {
      console.error("Failed to fetch borrowed books:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchBorrowedBooks();

    const intervalId = setInterval(() => {
      fetchBooks();
      fetchBorrowedBooks();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prevData) => ({
      ...prevData,
      [name]: name === 'is_available' ? e.target.checked : value,
    }));
    setError("");
    setSuccess("");
  };

  const addBook = async () => {
    if (!bookData.title || !bookData.description || !bookData.imgsrc) {
      setError("All fields are required.");
      setSuccess("");
      return;
    }

    const { title, description, is_available, imgsrc } = bookData;

    try {
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, is_available, imgsrc }),
      });

      if (response.ok) {
        setBookData({
          title: '',
          description: '',
          is_available: true,
          imgsrc: ''
        });
        setSuccess("Book added successfully!");
        fetchBooks(); // Refresh the book list
      } else {
        setError("Failed to add book.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const deleteBook = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setBooks(books.filter((book) => book.id !== id));
      } else {
        setError("Failed to delete book.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/api/borrowedbooks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        setBorrowedBooks(
          borrowedBooks.map((book) =>
            book.id === id ? { ...book, status } : book
          )
        );
        setSuccess("Status updated successfully!");
      } else {
        setError("Failed to update status.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center">Admin Panel</h2>
      <div className="mb-4">
        <div className="dropdown">
          <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
            {view === 'upload' ? 'Upload Books' : 'Borrowed Books'}
          </button>
          <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
            <li>
              <button className="dropdown-item" onClick={() => setView('upload')}>Upload Books</button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => setView('borrowed')}>Borrowed Books</button>
            </li>
          </ul>
        </div>
      </div>

      {view === 'upload' && (
        <>
          <div className="mb-4">
            <input
              type="text"
              name="title"
              className="form-control mb-2"
              placeholder="Title"
              value={bookData.title}
              onChange={handleInputChange}
            />
            <textarea
              name="description"
              className="form-control mb-2"
              placeholder="Description"
              value={bookData.description}
              onChange={handleInputChange}
            />
            <div className="form-check mb-2">
              <input
                type="checkbox"
                name="is_available"
                className="form-check-input"
                checked={bookData.is_available}
                onChange={handleInputChange}
              />
              <label className="form-check-label">Available</label>
            </div>
            <input
              type="text"
              name="imgsrc"
              className="form-control mb-2"
              placeholder="Image URL"
              value={bookData.imgsrc}
              onChange={handleInputChange}
            />
            <button className="btn btn-primary" onClick={addBook}>Add Book</button>
            {error && <p className="text-danger mt-2">{error}</p>}
            {success && <p className="text-success mt-2">{success}</p>}
          </div>

          <div>
            <h3>Book List</h3>
            <div className="list-group">
              {books.map((book) => (
                <div key={book.id} className="list-group-item">
                  <h5>{book.title}</h5>
                  <p>{book.description}</p>
                  <p>Available: {book.is_available ? 'Yes' : 'No'}</p>
                  <img src={book.imgsrc} alt={book.title} className="img-thumbnail custom-thumbnail" />
                  <button className="btn btn-danger btn-sm float-end" onClick={() => deleteBook(book.id)}>Delete</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

{view === 'borrowed' && (
  <div>
    <h3>Borrowed Books</h3>
    <table className="table table-striped">
      <thead>
        <tr>
          <th>Book Title</th>
          <th>Image</th>
          <th>Borrower ID</th>
          <th>Status</th>
         
        </tr>
      </thead>
      <tbody>
        {borrowedBooks.map((borrowedBook) => (
          <tr key={borrowedBook.id}>
            <td>{borrowedBook.books?.title}</td>
            <td>
              <img
                src={borrowedBook.books?.imgsrc}
                alt={borrowedBook.books?.title}
                className="img-thumbnail"
                style={{ width: "50px", height: "50px" }}
              />
            </td>
            <td>{borrowedBook.user_id}</td>
            <td>
              <select
                className="form-select"
                value={borrowedBook.status ? '1' : '0'}
                onChange={(e) => updateStatus(borrowedBook.id, e.target.value === '1')}
              >
                <option value="0">Not Returned</option>
                <option value="1">Returned</option>
              </select>
            </td>
          
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


    </div>
  );
}

export default AdminPanel;
