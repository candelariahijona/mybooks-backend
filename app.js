require("dotenv").config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");


//CONFIG
//Database
mongoose.connect(process.env.DB);

const booksSchema = new mongoose.Schema({
    cover: String, 
    audio: String,
    name: String,
    year: String,
    author: String,
    description: String,
    is_bestseller: Boolean,
    is_saved: Boolean
});

booksSchema.index({name: "text"});

const Book = new mongoose.model("Book", booksSchema);


//API
// Get books
app.route("/api/books")
    .get((req, res) => {
        Book.find((error, booksFound) => {
            res.send(booksFound);
        });
    });

// Get & Update single book
app.route("/api/:bookId")
    .get((req, res) => {
        const bookId = req.params.bookId;

        Book.findOne({_id: bookId}, (error, bookFound) => {
            res.send(bookFound);
        });
    })
    .put((req, res) => {
        const bookId = req.params.bookId;

        Book.findOne({_id: bookId}, (error, bookFound) => {
            bookFound.is_saved = !bookFound.is_saved;

            bookFound.save(() => {
                res.send(bookFound);
            });
        });
    });

// Search books
app.route("/api/search/:keyword")
    .get((req, res) => {
        const keyword = req.params.keyword;
        
        Book.find({$text: {$search: keyword}}, (error, booksFound) => {
            res.send(booksFound);
        });
    });


//RUN 
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));