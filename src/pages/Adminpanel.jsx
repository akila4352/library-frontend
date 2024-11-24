import React, { useState, useEffect } from "react";
import "./admin.css";

function AdminPanel() {
  const [books, setBooks] = useState([]);
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [bookData, setBookData] = useState({
    title: "",
    description: "",
    is_available: true,
    imgsrc: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [view, setView] = useState("upload"); // Manage views: 'upload' or 'borrowed'

  // Fetch Books
  const fetchBooks = async () => {
    try {
      const response = await fetch(
        "https://test2app-e9c794ac2195.herokuapp.com/api/books"
      );
      const data = await response.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch books:", err);
      setError("Error fetching book data. Please try again.");
    }
  };

  // Fetch Borrowed Books
  const fetchBorrowedBooks = async () => {
    try {
      const response = await fetch(
        "https://test2app-e9c794ac2195.herokuapp.com/api/borrowedbooks"
      );
      const data = await response.json();
      setBorrowedBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch borrowed books:", err);
      setError("Error fetching borrowed book data. Please try again.");
    }
  };

  // Initial data load and refresh interval
  useEffect(() => {
    fetchBooks();
    fetchBorrowedBooks();
    const intervalId = setInterval(() => {
      fetchBooks();
      fetchBorrowedBooks();
    }, 5000);
    return () => clearInterval(intervalId); // Cleanup interval
  }, []);

  // Input Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData((prev) => ({
      ...prev,
      [name]: name === "is_available" ? e.target.checked : value,
    }));
    setError("");
    setSuccess("");
  };

  // Add Book
  const addBook = async () => {
    if (!bookData.title || !bookData.description || !bookData.imgsrc) {
      setError("All fields are required.");
      setSuccess("");
      return;
    }
    try {
      const response = await fetch(
        "https://test2app-e9c794ac2195.herokuapp.com/api/books",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bookData),
        }
      );
      if (response.ok) {
        setBookData({ title: "", description: "", is_available: true, imgsrc: "" });
        setSuccess("Book added successfully!");
        fetchBooks(); // Refresh books list
      } else {
        setError("Failed to add book.");
      }
    } catch (err) {
      console.error("Error adding book:", err);
      setError("An error occurred. Please try again.");
    }
  };

  // Delete Book
  const deleteBook = async (id) => {
    try {
      const response = await fetch(
        `https://test2app-e9c794ac2195.herokuapp.com/api/books/${id}`,
        { method: "DELETE" }
      );
      if (response.ok) {
        setBooks(books.filter((book) => book.id !== id));
        setSuccess("Book deleted successfully.");
      } else {
        setError("Failed to delete book.");
      }
    } catch (err) {
      console.error("Error deleting book:", err);
      setError("An error occurred. Please try again.");
    }
  };

  // Update Borrowed Book Status
  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `https://test2app-e9c794ac2195.herokuapp.com/api/borrowedbooks/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );
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
    } catch (err) {
      console.error("Error updating status:", err);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Admin Panel</h2>

      <div className="mb-4">
        <div className="dropdown">
          <button
            className="btn btn-secondary dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            {view === "upload" ? "Upload Books" : "Borrowed Books"}
          </button>
          <ul className="dropdown-menu">
            <li>
              <button className="dropdown-item" onClick={() => setView("upload")}>
                Upload Books
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => setView("borrowed")}>
                Borrowed Books
              </button>
            </li>
          </ul>
        </div>
      </div>

      {view === "upload" ? (
        <div>
          <input
            type="text"
            name="title"
            placeholder="Title"
            className="form-control mb-2"
            value={bookData.title}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            className="form-control mb-2"
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
            placeholder="Image URL"
            className="form-control mb-2"
            value={bookData.imgsrc}
            onChange={handleInputChange}
          />
          <button className="btn btn-primary" onClick={addBook}>
            Add Book
          </button>
          {error && <p className="text-danger mt-2">{error}</p>}
          {success && <p className="text-success mt-2">{success}</p>}

          <div>
            <h3>Book List</h3>
            {books.map((book) => (
              <div key={book.id} className="list-group-item">
                <h5>{book.title}</h5>
                <p>{book.description}</p>
                <p>Available: {book.is_available ? "Yes" : "No"}</p>
                <img src={book.imgsrc} alt={book.title} className="img-thumbnail" />
                <button
                  className="btn btn-danger btn-sm float-end"
                  onClick={() => deleteBook(book.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h3>Borrowed Books</h3>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
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
                      value={borrowedBook.status ? "1" : "0"}
                      onChange={(e) =>
                        updateStatus(borrowedBook.id, e.target.value === "1")
                      }
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
