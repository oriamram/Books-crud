// import dotenv from "dotenv";
// import { uniqueNamesGenerator, names } from "unique-names-generator";
// import createMobilePhoneNumber from "random-mobile-numbers";
// import axios from "axios";
// import { Database } from "./Database.js";
const dotenv = require("dotenv");
const { uniqueNamesGenerator, names } = require("unique-names-generator");
const createMobilePhoneNumber = require("random-mobile-numbers");
const axios = require("axios");
const Database = require("./Database.js");

dotenv.config({ path: "../.env" });
const db = new Database();
onStart();

async function onStart() {
	db.connect();
	console.time();
	console.log("connected");
	////////////////////////////
	// for (let i = 0; i < 10; i++) {
	// 	await db.insertUser(UserGenerator());
	// }
	// const books = await booksGenerator();
	// for (let book of await booksGenerator()) {
	// 	await db.insertBook(book);
	// }
	// for (let book of books) {
	// 	await db.insertBook(book);
	// }
	// await db.updateBookBorrowHistory(123, 44);
	// await db.updateUserCurrentBook(44, "If It Bleeds");
	// console.log(await db.checkForValidInsert({ borrow_history: [32] }));
	// await db.insertBook({ id: "11121", title: "4bbb", subtitle: "afcegrws", pages: 412, publish: "1010-10-27", ratings: { avg: 5, count: 124 }, borrow_history: [2, 6, 1], author: 2 });
	// await db.updateUserCurrentBook(5, null);
	// await db.insertAuthor({ name: "oria", number_of_books: 123 });
	////////////////////////////
	db.client.end();
	console.log("disconnected");
	console.timeEnd();
}

//create table books
async function createTableBooks() {
	const sql = `CREATE TABLE IF NOT EXISTS books(
		id TEXT PRIMARY KEY,
		title VARCHAR(50) NOT NULL UNIQUE,
		subtitle VARCHAR(50) NOT NULL,
		pages INT NOT NULL,
		publish DATE NOT NULL DEFAULT CURRENT_DATE,
		ratings JSONB,
		borrow_history INT[], 
		author INT NOT NULL, 
		FOREIGN KEY(author) REFERENCES authors(id))`;
	await db.client.query(sql);
}
//create table authors
async function createTableUsers() {
	const sql = ` CREATE TABLE IF NOT EXISTS users(
		id SERIAL PRIMARY KEY,
		username VARCHAR(20) NOT NULL,
		phone VARCHAR(13) NOT NULL,
		current_book VARCHAR(50),
		borrow_history VARCHAR(50)[] 
	)`;
	await db.client.query(sql);
}
//create table users
async function createTableAuthors() {
	const sql = ` CREATE TABLE IF NOT EXISTS authors(
		id SERIAL PRIMARY KEY,
		name VARCHAR(30) NOT NULL,
		number_of_books VARCHAR(4)
	)`;
	await db.client.query(sql);
}
//generate user
function UserGenerator() {
	const nameConfig = {
		dictionaries: [names],
	};
	const username = uniqueNamesGenerator(nameConfig);
	const phone = createMobilePhoneNumber("USA");
	return { username, phone, current_book: null, last_book_date: null };
}
//generate author
async function authorGenerator() {
	const name = "william shakespeare";
	const data = (
		await axios.get("https://www.googleapis.com/books/v1/volumes", {
			params: {
				q: "inauthor:" + name,
				key: process.env.API_KEY,
				maxResults: "40",
			},
		})
	).data.items;
	const number_of_books = data.length === 40 ? "40+" : data.length;
	return { name, number_of_books };
}
//generate books
async function booksGenerator() {
	const authors = await db.getAllAuthors();
	let booksList = [];
	for (let author of authors) {
		const books = (
			await axios.get("https://www.googleapis.com/books/v1/volumes", {
				params: {
					q: "inauthor:" + author.name,
					key: process.env.API_KEY,
					maxResults: Math.floor(Math.random() * 5 + 1),
				},
			})
		).data.items;
		for (let book of books) {
			let id;
			let title;
			let subtitle;
			let pages;
			let publish;
			let ratings;
			const borrow_history = null;
			[id, title, subtitle, pages, publish, ratings] = [
				book.id,
				book.volumeInfo.title,
				book.volumeInfo.subtitle,
				book.volumeInfo.pageCount,
				book.volumeInfo.publishedDate,
				{ avg: book.volumeInfo.averageRating || "", count: book.volumeInfo.ratingsCount || "" },
			];
			booksList.push({ id, title, subtitle: subtitle || "", pages, publish: publish || null, ratings, borrow_history, author: author.id });
		}
	}
	return booksList;
}
