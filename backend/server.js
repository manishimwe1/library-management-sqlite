import express from "express";
import { db } from "./config/sqlite.js";
// import { connectToDb } from './config/db.js';
import cors from "cors";

const PORT = 3000;
const app = express();

app.use(cors({
  origin:["http://127.0.0.1:5500"],
  methods:["GET","POST","PUT","DELETE"],
  allowedHeaders:["Content-Type"]
}))
app.use(express.json());
// connectToDb()

app.post("/api/books", (req, res) => {
  console.log(req.body);
  
  const { name, description, author, price, imageSrc } = req.body;
  if (!name || !description || !author || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const query = `INSERT INTO books (name, description, author, price,imageSrc) VALUES (?, ?, ?, ?,?)`;
  db.run(query, [name, description, author, price, imageSrc || ""], (err) => {
    if (err) {
      return console.log("error in creating books", err);
    }
    console.log("inserted books in db successfully.");
    return res.status(201).json({ message: "Created successfully" })
  });
});

app.get("/api/books", (req, res) => {
  const query = `SELECT * FROM books`;
  db.all(query, [], (err, rows) => {
    if (err) {
      return console.log("error in fetching books", err);
    }
    return res.status(200).json(rows);
  });
});

app.delete("/api/books/:id", (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM books WHERE id = ?`;
  db.run(query, [id], (err) => {
    if (err) {
      return res.status(500).json({ message: "Error deleting book", error: err });
    }
    return res.status(200).json({ message: "Book deleted successfully" });
  });
});

app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});
