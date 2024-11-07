import React from 'react';
import './App.css';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import User from './pages/User/User';
import NotFound from './pages/NotFound';
import Book from './components/molecules/BookList/Book';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './pages/User/UserContext';
import AdminPanel from './pages/Adminpanel';
function App() {
  return (
    <UserProvider> {/* Wrap the application with UserProvider for global state */}
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/user" element={<User />} />
            <Route path="/book" element={<Book />} /> {/* Route for Book component */}
            <Route path="/adminpanel" element={<AdminPanel />} />

            <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 errors */}
          </Routes>
        </Router>
      </div>
    </UserProvider>
  );
}

export default App;
