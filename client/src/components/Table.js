import React from "react";
import axios from "axios";
import Row from "./Row";
import "../styles/table.scss";

class Table extends React.Component {
	state = { rst: {} };

	//get users from server
	getAllUsers = async () => {
		return (await axios.get("/all_users")).data;
	};
	//get authors from server
	getAllAuthors = async () => {
		return (await axios.get("/all_authors")).data;
	};

	//get books from server
	getAllBooks = async () => {
		return (await axios.get(`/all_books`)).data;
	};
	//////////////////////////////////////////////////////////////////////server requests ^^^

	// books page required data
	setBooksAuthorsState = async () => {
		const authors = await this.getAllAuthors();
		const books = await this.getAllBooks();
		books.forEach((book) => {
			book.author = authors.find((author) => book.author === author.id);
		});
		return { books, authors };
	};

	//create new books from books to handle with the table requests
	booksAdapter = () => {
		return this.props.values.map((book) => {
			let newBook = {};
			for (let key of Object.keys(book)) {
				if (key !== "ratings" && key !== "borrow_history") newBook[key] = book[key];
			}
			return newBook;
		});
	};

	//insert data to state for a specific table type
	setDataByType = async () => {
		if (this.props.type === "books") {
			this.props.setStateOfApp("books", await this.setBooksAuthorsState());
		} else if (this.props.type === "authors") {
			const authors = await this.getAllAuthors();
			this.props.setStateOfApp("authors", { authors });
		} else if (this.props.type === "users") {
			const users = await this.getAllUsers();
			this.props.setStateOfApp("users", { users });
		}
	};

	componentDidMount() {
		this.setDataByType();
	}

	componentDidUpdate() {
		this.setDataByType();
	}

	//////////////////////////////////////////////////////////////////////////////////////////DATA^^^ HTML>>>>

	//create a row for every book
	createRows = (iterable) => {
		return iterable.map((value) => {
			return <Row key={value.id} isHeader={false} values={Object.values(value)} onDlt={this.dltClick} dltMode={this.props.dltMode} />;
		});
	};

	//header for type
	createHeader = (values) => {
		try {
			return <Row isHeader={true} values={Object.keys(values[0])} />;
		} catch (e) {}
	};

	//values sould be:  this.state.. / bookHandler
	createTableRowsAndHeader = (values) => {
		return (
			<table className="table">
				{this.createHeader(values)}
				<tbody>{this.createRows(values)}</tbody>
			</table>
		);
	};

	//render createTableRowsAndHeader while insert values by table type
	typeRender = () => {
		if (this.props.type === "books") {
			return this.createTableRowsAndHeader(this.booksAdapter());
		} else return this.createTableRowsAndHeader(this.props.values);
	};

	//on dlt click
	dltClick = async (id) => {
		if (this.props.dltMode) {
			const urlName = window.location.href.split("/").slice(-1)[0];
			await axios.post(`/delete_${urlName.slice(0, -1)}`, null, {
				params: {
					id: id,
				},
			});
			this.setState({ rst: {} });
		}
	};

	render() {
		return <div className="Table">{this.typeRender()}</div>;
	}
}

export default Table;

//in the specific book card :
// ratings
// borrow history

//loader
//dlt change to red
