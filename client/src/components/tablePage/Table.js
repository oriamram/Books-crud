import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Row from "./Row";
import { dltContext, searchContext } from "../App";
import "../../styles/table.scss";

const Table = (props) => {
	const { setStateOfApp } = useContext(dltContext);
	const searchTerm = useContext(searchContext);
	const [rst, setRst] = useState({});
	const path = useLocation().pathname.slice(1, -1);

	//get authors from server
	const getAllAuthors = async () => {
		return (await axios.get("/all_authors")).data;
	};

	//handle the search bar searching
	const searchItemByTerm = async () => {
		switch (props.type) {
			case "books":
				return (
					await axios.get("/search_books", {
						params: {
							searchTerm,
						},
					})
				).data;
			case "authors":
				return (
					await axios.get("/search_authors", {
						params: {
							searchTerm,
						},
					})
				).data;
			case "users":
				return (
					await axios.get("/search_users", {
						params: {
							searchTerm,
						},
					})
				).data;
		}
	};
	//////////////////////////////////////////////////////////////////////server requests ^^^
	// books page required data
	const setBooksAuthorsState = async () => {
		const authors = await getAllAuthors();
		const books = await searchItemByTerm();
		books.forEach((book) => {
			book.author = authors.find((author) => book.author === author.id);
		});
		return { books, authors };
	};

	//create new books from books to handle with the table requests
	const booksAdapter = () => {
		return props.values.map((book) => {
			let newBook = {};
			for (let key of Object.keys(book)) {
				if (key !== "ratings" && key !== "borrow_history") newBook[key] = book[key];
			}
			return newBook;
		});
	};

	//insert data to state for a specific table type
	const setDataByType = async () => {
		if (props.type === "books") {
			setStateOfApp("books", await setBooksAuthorsState());
		} else if (props.type === "authors") {
			const authors = await searchItemByTerm();
			setStateOfApp("authors", { authors });
		} else if (props.type === "users") {
			const users = await searchItemByTerm();
			setStateOfApp("users", { users });
		}
	};

	useEffect(() => {
		const timerId = setTimeout(() => setDataByType(), 500);
		return () => clearTimeout(timerId);
	});

	//////////////////////////////////////////////////////////////////////////////////////////DATA^^^ HTML>>>>

	//create a row for every item
	const createRows = (values) => {
		return values.map((value) => {
			return <Row key={value.id} isHeader={false} values={Object.values(value)} onDlt={dltClick} />;
		});
	};

	//header for type
	const createHeader = (values) => {
		try {
			return <Row isHeader={true} values={Object.keys(values[0])} />;
		} catch (e) {}
	};

	//values sould be: values from props / booksAdapter
	const createTableRowsAndHeader = (values) => {
		return (
			<table className="table">
				{createHeader(values)}
				<tbody>{createRows(values)}</tbody>
			</table>
		);
	};

	//render createTableRowsAndHeader while insert values by table type
	const typeRender = () => {
		return props.type === "books" ? createTableRowsAndHeader(booksAdapter()) : createTableRowsAndHeader(props.values);
	};

	//on dlt click
	const dltClick = async (id) => {
		let urlName = path === "" ? "book" : path;
		await axios.post(`/delete_${urlName}`, null, {
			params: {
				id: id,
			},
		});
		setRst({});
	};

	return <div className="Table">{typeRender()}</div>;
};

export default Table;
