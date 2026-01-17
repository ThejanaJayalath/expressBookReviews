const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    // Check if username or password is missing
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }
  
    // Check if user already exists
    if (isValid(username)) {
      return res.status(409).json({ message: "User already exists" });
    }
  
    // Register new user
    users.push({ username, password });
    return res.status(201).json({ message: "User registered successfully" });
  });
  

// Task 10: Get all books using async/await with Axios
public_users.get('/', async (req, res) => {
    try {
      // Simulate async behavior with Promise
      const getBooks = new Promise((resolve) => {
        resolve(books);
      });
  
      const result = await getBooks;
      return res.status(200).send(JSON.stringify(result, null, 4));
    } catch (error) {
      return res.status(500).json({ message: "Error retrieving books" });
    }
  });
  
  

// Task 11: Get book details by ISBN using Promises
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn = req.params.isbn;
  
    const getBookByISBN = new Promise((resolve, reject) => {
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject("Book not found");
      }
    });
  
    getBookByISBN
      .then((book) => {
        res.status(200).send(JSON.stringify(book, null, 4));
      })
      .catch((error) => {
        res.status(404).json({ message: error });
      });
  });
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let result = {};
  
    // Get all keys (ISBNs) from books object
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
        result[isbn] = books[isbn];
      }
    });
  
    if (Object.keys(result).length > 0) {
      return res.status(200).send(JSON.stringify(result, null, 4));
    } else {
      return res.status(404).json({ message: "No books found for this author" });
    }
  });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let result = {};
  
    Object.keys(books).forEach((isbn) => {
      if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
        result[isbn] = books[isbn];
      }
    });
  
    if (Object.keys(result).length > 0) {
      return res.status(200).send(JSON.stringify(result, null, 4));
    } else {
      return res.status(404).json({ message: "No books found with this title" });
    }
  });
  

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    if (books[isbn]) {
      return res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
  });

module.exports.general = public_users;
