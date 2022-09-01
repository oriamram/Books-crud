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
		const valuesToCheck = { borrow_history };
		if (await this.checkForValidInsert(valuesToCheck)) {
			try {
				const sql = `INSERT INTO books (id,title,subtitle,pages,publish,ratings,borrow_history,author) VALUES($1,$2,$3,$4,$5,$6,$7,$8)`;
				await this.client.query(sql, [id, title, subtitle, +pages, publish, { avg: ratings.avg, count: ratings.count }, borrow_history, author]);
				if (borrow_history) {
					await this.updateUserCurrentBook(borrow_history[borrow_history.length - 1], title);
					for (let i = 0; i < borrow_history.length - 1; i++) {
						await this.updateUserBorrowHistory(+borrow_history[i], title);
					}
				}
				return 200;
			} catch (e) {
				console.log(e.message);
				return 404;
			}
		} else {
			return 404;
		}
	}
	//check the borrow history
	async checkForValidInsert({ borrow_history }) {
		const users = (await this.getAllUsers()).map((user) => user.id);
		if (borrow_history !== null) {
			for (let userId of borrow_history) {
				if (userId !== null && !users.includes(userId)) {
					return false;
				}
			}
		}
		return true;
	}
	//updates the book history
	async updateBookBorrowHistory(bookId, userId) {
		const book = await this.getBookById(bookId);
		let history;
		if (book.borrow_history) {
			history = book.borrow_history;
			history.push(userId);
		} else history = [userId];
		const sql = `UPDATE books SET borrow_history = $1 WHERE id = $2`;
		await this.client.query(sql, [history, bookId]);
	}
	//return book from title
	async getBookByTitle(title) {
		const sql = `SELECT * FROM books WHERE title = $1`;
		return (await this.client.query(sql, [title])).rows[0];
	}
	//updates a book
	async updateBookById(values) {
		if (values.ratings.avg > 5) {
			return 404;
		}
		try {
			const sql = `UPDATE books SET subtitle=$1, pages=$2,ratings=$3 WHERE id=$4 `;
			await this.client.query(sql, [values.subtitle, values.pages, values.ratings, values.id]);
			return 200;
		} catch (e) {
			return 404;
		}
	}
	//search a book with id/title
	async searchBooks(searchTerm) {
		const sql = `SELECT * from books WHERE id LIKE $1 OR title LIKE $1`;
		return (await this.client.query(sql, [`%${searchTerm}%`])).rows;
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
				return 200;
			} else {
				return 404;
			}
		} catch (e) {
			return 404;
		}
	}
	//checks for another author with the same name in the database
	async checkForValidAuthor(name) {
		const sql = `SELECT * FROM authors WHERE name = $1`;
		const allAuthors = (await this.client.query(sql, [name])).rows;
		return allAuthors.length > 0 ? false : true;
	}
	//update author
	async updateAuthorById(values) {
		try {
			const sql = `UPDATE authors SET number_of_books=$1 WHERE id=$2 `;
			await this.client.query(sql, [values.number_of_books, values.id]);
			return 200;
		} catch (e) {
			return 404;
		}
	}

	//search an author with id/name
	async searchAuthors(searchTerm) {
		const sql = `SELECT * from authors WHERE id = $1 OR name LIKE $2`;
		return (await this.client.query(sql, [isNaN(+searchTerm) ? 0 : +searchTerm, `%${searchTerm}%`])).rows;
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
	//get user by his username
	async getUserByUsername(username) {
		const sql = `SELECT * FROM users WHERE username = $1`;
		return (await this.client.query(sql, [username])).rows[0];
	}
	//insert user
	async insertUser({ username, phone, current_book, borrow_history }) {
		try {
			if (await this.checkForValidUser(username, current_book)) {
				const sql = `INSERT INTO users (username,phone,current_book,borrow_history) VALUES($1,$2,$3,$4)`;
				await this.client.query(sql, borrow_history !== undefined ? [username, phone, current_book, borrow_history] : [username, phone, current_book, [current_book]]);
				await this.updateBookBorrowHistory((await this.getBookByTitle(current_book)).id, (await this.getUserByUsername(username)).id);
				return 200;
			} else return 404;
		} catch (e) {
			return 404;
		}
	}
	//checks if username exists and if current book exists
	async checkForValidUser(username, current_book) {
		const users = await (await this.getAllUsers()).map((user) => user.username);
		const books = await (await this.getAllBooks()).map((book) => book.title);
		if ((books.includes(current_book) && !users.includes(username)) || (!current_book && !users.includes(username))) {
			return true;
		} else return false;
	}
	//update users current book
	async updateUserCurrentBook(userId, book_name) {
		const sql = `UPDATE users SET current_book=$1 where id = $2`;
		await this.client.query(sql, [book_name, userId]);
		await this.updateUserBorrowHistory(userId, book_name);
		await this.updateBookBorrowHistory((await this.getBookByTitle(book_name)).id, userId);
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
	//updates a user
	async updateUserById(values) {
		try {
			const sql = `UPDATE users SET username=$1, phone=$2 WHERE id=$3 `;
			await this.client.query(sql, [values.username, values.phone, values.id]);
			const lastCurrentBook = (await this.getUserById(values.id)).current_book;
			if (lastCurrentBook !== values.current_book) {
				await this.updateUserCurrentBook(values.id, values.current_book);
			}
			return 200;
		} catch (e) {
			return 404;
		}
	}

	//search an user with id/name
	async searchUsers(searchTerm) {
		const sql = `SELECT * from users WHERE id = $1 OR username LIKE $2`;
		return (await this.client.query(sql, [isNaN(+searchTerm) ? 0 : +searchTerm, `%${searchTerm}%`])).rows;
	}
};
