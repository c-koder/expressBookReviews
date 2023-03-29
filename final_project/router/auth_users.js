const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "test", password: "test" }];

const isValid = (username) => {
  return users.filter((user) => user.username === username).length > 0;
};

const authenticatedUser = (username, password) => {
  return (
    users.filter(
      (user) => user.username === username && user.password === password
    ).length > 0
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    );

    req.session.authorization = {
      accessToken,
      username,
    };
    return res.status(200).send("User successfully logged in");
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  var username = req.session.authorization.username;

  var review = books[req.params.isbn].reviews.filter(
    (r) => r.username === username
  );

  if (review.length > 0) {
    books[req.params.isbn].reviews.find(
      (r) => r.username === username
    ).content = req.query.review;
    return res.status(200).json({ message: "Review updated" });
  } else {
    books[req.params.isbn].reviews.push({
      username: username,
      content: req.query.review,
    });
    return res.status(200).json({ message: "Review added" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  var username = req.session.authorization.username;

  books[req.params.isbn].reviews = books[req.params.isbn].reviews.filter(
    (r) => r.username !== username
  );

  return res.status(200).json({ message: "Review deleted" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
