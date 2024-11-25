const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: "Access denied, token missing" });
    }
    try {
        const decoded = jwt.verify(token, "secret_key");
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

const isValid = (username) => {
    return users.some(user => user.username === username);
};


const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};


//only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
      const token = jwt.sign({ username }, "secret_key", { expiresIn: '1h' });
      return res.status(200).json({ message: "Login successful", token });
  } else {
      return res.status(401).json({ message: "Invalid credentials" });
  }
});


// Add a book review
regd_users.put('/auth/review/:isbn', authenticateJWT, (req, res) => {
    const isbn = req.params.isbn;
    const { username } = req.user; // Retrieved from JWT
    const { review } = req.body;

    if (!review) {
        return res.status(400).json({ message: "Review text is required" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    books[isbn].reviews[username] = review;
    return res.status(200).json({ message: "Review added/modified successfully" });
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const { username } = req.user;

  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found" });
  }

  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;