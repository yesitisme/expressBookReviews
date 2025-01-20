const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
let books = require("./booksdb.js");
const regd_users = express.Router();

regd_users.use(session({ secret: "fingerpint", resave: true, saveUninitialized: true }));
const secretKey = 'MyBestProjectEver';


let users = [{ "username": "john", "password": "doe" }];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid

}

const authenticatedUser = (username, password) => { //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    let username = req.body.username;
    let password = req.body.password;
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: username
        }, secretKey, { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        //console.log(req.session);
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    let isbn = req.params.isbn;
    let review = req.query.review;
    let username = req.session.authorization.username;
    let book = books[isbn];
    //console.log(username, review)
    if (!username || !review) {
        return res.status(400).json({ message: "User Name And review is required" })
    }

    if (book) {
        if (!book.reviews) {
            book.reviews = {};
        }

        // Update or add the review
        book.reviews[username] = review;

        return res.json({ Message: "Added review by user: " + username + ", review: " + review })

    }

    return res.status(300).json({ message: "Review not Yet to be implemented" });
});

// Delete review from user

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let user = req.session.authorization?.username;
    let isbn = req.params.isbn;

    if (!user) {
        return res.status(400).json({ message: "Username is required" });
    }

    let book = books[isbn];
    if (book.reviews[user]) {
        let myreview = book.reviews[user];
        delete book.reviews[user];
        res.json({ message: "Review: " + myreview + ", from user:" + user + " has been deleted" })
    } else {
        res.json({message: "No review to delete"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
