import React from "react";
import Nav from "./Nav";
import Table from "./Table";
import { Routes, Route } from "react-router-dom";
import "../styles/main.scss";

class App extends React.Component {
	state = { dltMode: false, books: [], authors: [], users: [] };

	onDltClick = (e) => {
		if (!this.state.dltMode) {
			this.setState({ dltMode: true });
		} else {
			this.setState({ dltMode: false });
		}
		e.target.classList.toggle("active");
	};

	//sets the state of name with obj (should be used from Table)
	setStateOfApp = async (name, obj) => {
		if (this.state[name].length === 0 || obj[name].length !== this.state[name].length) {
			this.setState(await obj);
		}
	};

	//////not in use yet
	loader() {
		return (
			<div className="lds-ring">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</div>
		);
	}

	render() {
		return (
			<div className="App">
				<Routes>
					<Route path="/" element={<Nav onDltClick={this.onDltClick} />}>
						<Route index element={<Table dltMode={this.state.dltMode} setStateOfApp={this.setStateOfApp} setLoaderFalse={this.setLoaderFalse} values={this.state.books} type="books" />} />
						<Route path="create" />
						<Route path="authors" element={<Table dltMode={this.state.dltMode} setStateOfApp={this.setStateOfApp} values={this.state.authors} type="authors" />} />
						<Route path="users" element={<Table dltMode={this.state.dltMode} setStateOfApp={this.setStateOfApp} values={this.state.users} type="users" />} />
					</Route>
					<Route path="*" element={<h1>Error 404: No Such Page</h1>} />
				</Routes>
			</div>
		);
	}
}

export default App;
