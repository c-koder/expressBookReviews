const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User successfully registered." });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

function getBooks() {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
}

function getBookBasedOnIsbn(isbn) {
  return new Promise((resolve, reject) => {
    resolve(books[isbn]);
  });
}

function getBookBasedOnAuthor(author) {
  return new Promise((resolve, reject) => {
    let book = "Not found";

    for (let b in books) {
      if (books[b].author.includes(author)) book = books[b];
    }

    resolve(book);
  });
}

function getBookBasedOnTitle(title) {
  return new Promise((resolve, reject) => {
    let book = "Not found";

    for (let b in books) {
      if (books[b].title.includes(title)) book = books[b];
    }

    resolve(book);
  });
}

public_users.get("/", async function (req, res) {
  await getBooks().then((bookRes) => {
    return res.status(200).json(bookRes);
  });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  await getBookBasedOnIsbn(req.params.isbn).then((bookRes) => {
    return res.status(200).json(bookRes);
  });
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  await getBookBasedOnAuthor(req.params.author).then((bookRes) => {
    return res.status(200).json(bookRes);
  });
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  await getBookBasedOnTitle(req.params.title).then((bookRes) => {
    return res.status(200).json(bookRes);
  });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  return res.status(200).json(books[req.params.isbn].reviews);
});

module.exports.general = public_users;
