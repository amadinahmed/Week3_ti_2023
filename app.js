const express = require("express");
const app = express();
const cors = require('cors');
const port = 3000;

// Sample initial book list
let books = [
    {
      id: 1,
      title: "Book 1",
      author: "Author 1",
    },
    {
      id: 2,
      title: "Book 2",
      author: "Author 2",
    },
    {
      id: 3,
      title: "Book 3",
      author: "Author 3",
    },
  ];

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

//app.get("/", (req, res) => res.send("Hello World!"));
  
// Get all books
app.get("/booklist", (req, res) => {
    res.json(books);
});
  
// Create a new book
app.post("/bookadd", (req, res) => {
    const { id, title, author } = req.body;
  
    // Check if required fields are provided
    if (!id || !title || !author) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
  
    const newBook = { id, title, author };
    books.push(newBook);
  
    res.status(201).json(newBook);
});
  
// Delete a book by ID
app.delete("/bookdelete", (req, res) => {
    const bookId = parseInt(req.body.id);
    const index = books.findIndex((book) => book.id === bookId);
  
    if (index !== -1) {
      books.splice(index, 1);
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Book not found" });
    }
  });

app.put("/bookedit", (req, res) => {
    const bookId = parseInt(req.body.id);
    const { title, author } = req.body;
  
    // Find the book in the array
    const bookIndex = books.findIndex((book) => book.id === bookId);
  
    // Check if the book exists
    if (bookIndex === -1) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
  
    // Update the book information
    books[bookIndex].title = title || books[bookIndex].title;
    books[bookIndex].author = author || books[bookIndex].author;
  
    res.json(books[bookIndex]);
  });
  

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
