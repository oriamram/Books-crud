const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const bp = require("body-parser");
const Database = require("./Database");
dotenv.config({ path: "../.env" });

const PORT = process.env.PORT || 5000;
const app = express();
const db = new Database();
app.use(cors());
app.use(bp.json());
db.connect().then(() => {
	app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
});

//get all books
app.get("/all_books", async (req, res) => {
	res.send(await db.getAllBooks());
});
//get book
app.get("/get_book", async (req, res) => {
	res.send(await db.getBookById(req.query.id));
});
//delete book
app.post("/delete_book", async (req, res) => {
	res.send(await db.deleteBookById(req.query.id));
});
//insert book
app.post("/insert_book", async (req, res) => {
	const response = await db.insertBook(req.body);
	res.sendStatus(response);
});

//change all values
app.put("/update_book", async (req, res) => {
	const response = await db.updateBookById(req.body);
	res.sendStatus(response);
});

//return all the books according to the query
app.get("/search_books", async (req, res) => {
	res.send(await db.searchBooks(req.query.searchTerm));
});
////////////////////////////////////////////////////////////////////books ^^^

//get all authors
app.get("/all_authors", async (req, res) => {
	res.send(await db.getAllAuthors());
});
//get author
app.get("/get_author", async (req, res) => {
	res.send(await db.getAuthorById(req.query.id));
});
//delete author
app.post("/delete_author", async (req, res) => {
	res.send(await db.deleteAuthorById(req.query.id));
});
//insert author
app.post("/insert_author", async (req, res) => {
	const response = await db.insertAuthor(req.body);
	res.sendStatus(response);
});

//change all values
app.put("/update_author", async (req, res) => {
	const response = await db.updateAuthorById(req.body);
	res.sendStatus(response);
});

//return all the authors according to the query
app.get("/search_authors", async (req, res) => {
	res.send(await db.searchAuthors(req.query.searchTerm));
});
///////////////////////////////////////////////////////////////////////authors ^^^

//get all users
app.get("/all_users", async (req, res) => {
	res.send(await db.getAllUsers());
});
//get user
app.get("/get_user", async (req, res) => {
	res.send(await db.getUserById(req.query.id));
});
//delete user
app.post("/delete_user", async (req, res) => {
	res.send(await db.deleteUserById(req.query.id));
});
//insert user
app.post("/insert_user", async (req, res) => {
	const response = await db.insertUser(req.body);
	res.sendStatus(response);
});

//change all values
app.put("/update_user", async (req, res) => {
	const response = await db.updateUserById(req.body);
	res.sendStatus(response);
});

//return all the users according to the query
app.get("/search_users", async (req, res) => {
	res.send(await db.searchUsers(req.query.searchTerm));
});
////////////////////////////////////////////////////////////////////users ^^^

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "build")));
	app.get("*", function (req, res) {
		res.sendFile(path.join(__dirname, "build/index.html"));
	});
}
