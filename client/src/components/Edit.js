import React from "react";
import axios from "axios";

class Edit extends React.Component {
	state = { values: {}, booksNames: {} };
	path = window.location.pathname.split("/");
	type = this.path[2].slice(0, -1);

	getAllAvailableBooks = async () => {
		const books = (await axios.get("/all_books")).data;
		const users = await this.getAllUsers();
		let availableBooks = [];
		for (let book of books) {
			if (!users.map((user) => user.current_book).includes(book.title)) {
				availableBooks.push({ title: book.title });
			}
		}
		return availableBooks;
	};

	getAllUsers = async () => {
		return (await axios.get("/all_users")).data;
	};

	//set the initial state od values
	componentDidMount() {
		const getAllBooks = async () => {
			let booksNames = [];
			if (this.path[2] === "users") {
				booksNames = await this.getAllAvailableBooks();
				booksNames = booksNames.map((book) => {
					return { title: book.title };
				});
			}
			this.setState({ values: this.props.valuesFromInfo, booksNames });
		};
		getAllBooks();
	}
	//change the state of values from the user input
	handleInputChange = (key, value) => {
		if (key !== "avg" && key !== "count") {
			const newValuesFromInput = { ...this.state.values };
			newValuesFromInput[key] = value;
			this.setState({ values: newValuesFromInput });
		} else {
			const newValuesFromInput = { ...this.state.values };
			newValuesFromInput.ratings[key] = value;
			this.setState({ values: newValuesFromInput });
		}
	};

	//returns all items keys and values
	renderValues = () => {
		return Object.keys(this.state.values).map((key) => {
			return (
				<div key={key} className="value">
					<h2>{key}: </h2>
					{this.handleValues(key) || (
						<input
							type="text"
							value={this.changeValuesAppearance(this.state.values[key], key) || this.state.values[key]}
							onChange={(e) => {
								this.handleInputChange(key, e.target.value);
							}}
						/>
					)}
				</div>
			);
		});
	};

	//decides whether or not show an item
	handleValues = (key) => {
		switch (key) {
			case "id":
			case "borrow_history":
			case "title":
			case "author":
			case "publish":
			case "name":
				return <input type="text" readOnly value={this.changeValuesAppearance(this.state.values[key], key) || this.state.values[key]} />;
			case "pages":
				return (
					<input
						type="number"
						value={this.state.values[key]}
						onChange={(e) => {
							this.handleInputChange(key, e.target.value);
						}}
					/>
				);
			case "ratings":
				return (
					<>
						<p>rate: </p>
						<input
							type="number"
							min={0}
							max={5}
							value={this.state.values[key].avg}
							onChange={(e) => {
								this.handleInputChange("avg", e.target.value);
							}}
						/>
						<p> count: </p>
						<input
							type="number"
							value={this.state.values[key].count}
							onChange={(e) => {
								this.handleInputChange("count", e.target.value);
							}}
						/>
					</>
				);
			case "current_book":
				return (
					<select
						id={"booksSelection"}
						onChange={(e) => {
							this.setState((state) => {
								let newValues = { ...state.values };
								newValues["current_book"] = e.target.value;
								return { values: newValues };
							});
						}}
					>
						<option value="none">none</option>
						{this.state.booksNames.map((book) => (
							<option key={book.title} value={book.title}>
								{book.title}
							</option>
						))}
					</select>
				);
		}
	};
	//decides how items should be shown to the user
	changeValuesAppearance = (value, key) => {
		switch (key) {
			case "author":
				return value.name;
			case "publish":
				return value.slice(0, 10);
		}
	};
	//when save is clicked
	sendUpdatesToServer = async () => {
		await axios
			.put(`/update_${this.type}`, this.state.values)
			.then((res) => alert("EDIT SUCCEEDED!"))
			.catch((err) => alert("EDIT FAILED"));
		this.props.setUsers(await this.getAllUsers());
	};

	render() {
		return (
			<div className="Edit">
				{this.renderValues()}
				<button className="submit" onClick={() => this.sendUpdatesToServer()}>
					save
				</button>
			</div>
		);
	}
}

export default Edit;
