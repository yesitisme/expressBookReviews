const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    let username = req.body.username;
    let password = req.body.password;
    let user = users.find(user => user.username === username);

    if (username && password) {
        if (user) {
            res.json("sorry the user already exists");
        } else {
            users.push({ username: username, password: password });
                res.json({message: "user " + username + " has been registerd! congrats."});
        }

    }
    return res.status(403).json({ message: "please provide username and password" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    res.send(JSON.stringify(books, null, 4));
    //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.params.isbn;

    let book = books[isbn];
    if (book) {
        res.send(book)
    } else {
        return res.status(403).json({ message: "Book not found" });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    let author = req.params.author;
    const booksArray = Object.values(books);

    let authorbooks = booksArray.filter((book) => { return book.author === author });
    if (authorbooks.length > 0) {
        res.send(JSON.stringify(authorbooks));
    } else {
        return res.status(404).json({ message: "No books found for this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    let title = req.params.title;
    const booksArray = Object.values(books);

    let authortitles = booksArray.filter((book) => { return book.title === title });
    if (authortitles.length > 0) {
        res.send(JSON.stringify(authortitles));
    } else {
        return res.status(404).json({ message: "No books found for this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here

    let isbn = req.params.isbn;

    let book = books[isbn];
    if (Object.keys(book.reviews).length > 0) {
        res.json(book.reviews);
    } else {
        return res.status(403).json({ message: "Book with reviews not found" });
    }

});

module.exports.general = public_users;
