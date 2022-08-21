// import pg from "pg";
const pg = require("pg");

module.exports = class Database {
	client;

	constructor() {
		this.client = new pg.Client({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
	}
	// Connects to the database
	async connect() {
		await this.client.connect();
	}

	//get all books
	async getAllBooks() {
		const sql = `SELECT * FROM books`;
		return (await this.client.query(sql)).rows;
	}
	//get book by id
	async getBookById(id) {
		const sql = `SELECT * FROM books WHERE id = $1`;
		return (await this.client.query(sql, [id])).rows[0];
	}
	//delete book by id
	async deleteBookById(id) {
		const sql = `DELETE FROM books WHERE id = $1`;
		await this.client.query(sql, [id]);
	}
	//insert book and updates the users
	async insertBook({ id, title, subtitle, pages, publish, ratings, borrow_history, author }) {
		borrow_history = borrow_history ? borrow_history.toString().split(",") : null;
		const bookValues = { id, title, borrow_history };
		if (await this.checkForValidInsert(bookValues)) {
			try {
				const sql = `INSERT INTO books (id,title,subtitle,pages,publish,ratings,borrow_history,author) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`;
				await this.client.query(sql, [id, title, subtitle, +pages, publish, { avg: ratings.avg, count: ratings.count }, borrow_history, author]);
				if (borrow_history) {
					await this.updateUserCurrentBook(borrow_history[borrow_history.length - 1], title);
					for (let i = 0; i < borrow_history.length - 1; i++) {
						await this.updateUserBorrowHistory(+borrow_history[i], title);
					}
				}
			} catch (e) {
				console.log(e.message);
			}
		} else {
			console.log("invalid insert");
		}
	}
	//check for same id or title and check borrow history
	async checkForValidInsert(bookValues) {
		const allBooks = await this.getAllBooks();
		if (bookValues.borrow_history !== null) {
			for (let userId of bookValues.borrow_history) {
				if (+userId !== null && !(await this.getUserById(+userId))) {
					return false;
				}
			}
		}
		for (let { id, title } of allBooks) {
			if (id === bookValues.id || title === bookValues.title) {
				return false;
			}
		}
		return true;
	}
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////books ^^^
	//get all authors
	async getAllAuthors() {
		const sql = `SELECT * FROM authors`;
		return (await this.client.query(sql)).rows;
	}
	//get author by id
	async getAuthorById(id) {
		const sql = `SELECT * FROM authors WHERE id = $1`;
		return (await this.client.query(sql, [id])).rows[0];
	}
	//delete author by id
	async deleteAuthorById(id) {
		const sql = `DELETE FROM authors WHERE id = $1`;
		await this.client.query(sql, [id]);
	}
	//insert author
	async insertAuthor({ name, number_of_books }) {
		try {
			if (await this.checkForValidAuthor(name)) {
				const sql = `INSERT INTO authors (name,number_of_books) VALUES($1,$2)`;
				await this.client.query(sql, [name, number_of_books]);
			} else {
				throw { message: "not a valid name" };
			}
		} catch (e) {
			console.log(e.message);
		}
	}
	async checkForValidAuthor(name) {
		const sql = `SELECT * FROM authors WHERE name = $1`;
		const allAuthors = (await this.client.query(sql, [name])).rows;
		return allAuthors.length > 0 ? false : true;
	}
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////books ^^^

	//get all users
	async getAllUsers() {
		const sql = `SELECT * FROM users`;
		return (await this.client.query(sql)).rows;
	}
	//get user by id
	async getUserById(id) {
		const sql = `SELECT * FROM users WHERE id = $1`;
		return (await this.client.query(sql, [id])).rows[0];
	}
	//delete user by id
	async deleteUserById(id) {
		const sql = `DELETE FROM users WHERE id = $1`;
		await this.client.query(sql, [id]);
	}
	//insert user
	async insertUser({ username, phone, current_book, borrow_history }) {
		try {
			const sql = `INSERT INTO users (username,phone,current_book,borrow_history) VALUES($1,$2,$3,$4)`;
			await this.client.query(sql, [username, phone, borrow_history, current_book]);
		} catch (e) {
			console.log(e.message);
		}
	}
	//update users current book
	async updateUserCurrentBook(userId, book_name) {
		const sql = `UPDATE users SET current_book=$1 where id = $2`;
		await this.client.query(sql, [book_name, userId]);
		await this.updateUserBorrowHistory(userId, book_name);
	}
	//update users borrow history
	async updateUserBorrowHistory(userId, book_name) {
		let userHistory = (await this.getUserById(userId)).borrow_history;
		if (!userHistory && book_name) {
			userHistory = [book_name];
		} else if (book_name) {
			userHistory = [...userHistory, book_name];
		}
		const sql = `UPDATE users SET borrow_history = $1  where id = $2`;
		await this.client.query(sql, [userHistory, userId]);
	}
};
