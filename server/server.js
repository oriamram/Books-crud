// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import bp from "body-parser";
// import { Database } from "./Database.js";

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
//insert book after check of valid input
app.get("/insert_book", async (req, res) => {
	res.send(await db.insertBook(JSON.parse(req.query.book_values)));
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

////////////////////////////////////////////////////////////////////users ^^^

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "build")));
	app.get("*", function (req, res) {
		res.sendFile(path.join(__dirname, "build/index.html"));
	});
}
