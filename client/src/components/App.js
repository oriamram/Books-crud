import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Nav from "./Nav";
import Table from "./tablePage/Table";
import Create from "./createPage/Create";
import Info from "./Info";
import "../styles/main.scss";

export const dltContext = React.createContext();
export const searchContext = React.createContext();

const App = () => {
	const [books, setBooks] = useState([]);
	const [authors, setAuthors] = useState([]);
	const [users, setUsers] = useState([]);
	const [search, setSearch] = useState("");

	//sets the state of name with obj (should be used from Table)
	const setStateOfApp = async (type, obj) => {
		switch (type) {
			case "books":
				if (obj.books.length !== books.length) {
					setBooks(obj.books);
					setAuthors(obj.authors);
				}
				break;
			case "authors":
				if (obj.authors.length !== authors.length) {
					setAuthors(obj.authors);
				}
				break;
			case "users":
				if (obj.users.length !== users.length) {
					setUsers(obj.users);
				}
				break;
		}
	};
	return (
		<div className="App">
			<searchContext.Provider value={search}>
				<dltContext.Provider value={{ setStateOfApp }}>
					<Routes>
						<Route path="/" element={<Nav setSearch={setSearch} search={search} />}>
							<Route index element={<Table values={books} type="books" />} />
							<Route path="create" element={<Create />} />
							<Route path="authors" element={<Table values={authors} type="authors" />} />
							<Route path="users" element={<Table values={users} type="users" />} />
							<Route path="info/:type/:id" element={<Info values={{ books, authors, users }} />}></Route>
							<Route path="edit/:type/:id" element={<Info values={{ books, authors, users }} />}></Route>
						</Route>
						<Route path="*" element={<h1>Error 404: No Such Page</h1>} />
					</Routes>
				</dltContext.Provider>
			</searchContext.Provider>
		</div>
	);
};

export default App;
