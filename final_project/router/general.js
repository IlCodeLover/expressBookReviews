const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}
//public_users.post("/register", (req,res) => {
  //Write your code here

  //return res.status(300).json({message: "Yet to be implemented"});
//});
// Register a new user
public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const formattedBooks = JSON.stringify(books, null, 10);
  
  return res.status(300).json({message: books});
});

// Task 10: Refactor Task 1 to use Callbacks
// Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        resolve(books); 
        })
        .then((bookList) => {
            res.status(200).json({ message: bookList });
        })
        .catch((error) => {
            res.status(500).json({ message: "Error getting books", error });
        });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  return res.status(300).json({message: books[isbn]});
 });

// Task 11: refactor task 2
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]); 
        } else {
            reject("ISBN not found"); 
        }
    })
        .then((bookDetails) => {
            res.status(200).json({message: bookDetails});
        })
        .catch((error) => {
            res.status(404).json({message: error});
        });
});
  
  
// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  
  //return res.status(300).json({message: books[author]});
  // Get the author name from the URL parameter
  const author = req.params.author.toLowerCase(); // Make it case-insensitive

  // Filter the books by the author name
  const booksByAuthor = Object.values(books).filter(book => 
    book.author.toLowerCase() === author
  );

  // If no books are found for the author
  if (booksByAuthor.length === 0) {
    return res.status(404).json({message: `No books found for author "${author}"`});
  }

  // Return the books found for the author
  return res.status(300).json({message: booksByAuthor});
});

public_users.get('/author/:author', function (req, res) {
    const author = req.params.author.toLowerCase(); // Make it case-insensitive
    
    new Promise((resolve, reject) => {
      // Select books by author name
      const booksByAuthor = Object.values(books).filter(book => 
        book.author.toLowerCase() === author
      );
  
      if (booksByAuthor.length === 0) {
        reject(`No books found for author "${author}"`); // noo books found
      } else {
        resolve(booksByAuthor); // resolved with books
      }
    })
      .then((booksByAuthor) => {
        res.status(200).json({message: booksByAuthor });
      })
      .catch((error) => {
        res.status(404).json({message: error });
      });
});
  

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase(); // Make it case-insensitive

  // Filter the books by the author name
  const booksByTitle = Object.values(books).filter(book => 
    book.title.toLowerCase() === title
  );

  // If no books are found for the author
  if (booksByTitle.length === 0) {
    return res.status(404).json({message: `No books found for title "${title}"`});
  }
  return res.status(300).json({message: booksByTitle});
});

// Task 13: refactor
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title.toLowerCase(); 
  
    new Promise((resolve, reject) => {
        // Select books by title
        const booksByTitle = Object.values(books).filter(book => 
            book.title.toLowerCase() === title
        );
    
        if (booksByTitle.length === 0) {
            reject(`No books are found with title "${title}"`); 
        } else {
            resolve(booksByTitle); 
        }
        })
        .then((booksByTitle) => {
            res.status(200).json({message: booksByTitle });
        })
        .catch((error) => {
            res.status(404).json({message: error });
        });
  });
  
//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const bookReviews = books[isbn]["reviews"];
  return res.status(300).json({message: bookReviews});
});

module.exports.general = public_users;
