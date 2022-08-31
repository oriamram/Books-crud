import React from "react";
import axios from "axios";
const keys = { books: ["id", "title", "subtitle", "pages", "publish", "ratings", "author"], authors: ["name", "number_of_books"], users: ["username", "phone", "current_book", "borrow_history"] };

class CreateSection extends React.Component {
	state = { books: {}, authors: {}, users: {}, authorsNames: [] };

	//get authors from server
	getAllAuthors = async () => {
		return (await axios.get("/all_authors")).data;
	};

	//create a new state
	UpdateStateByType = (type, key, value) => {
		let newState = { ...this.state[type] };
		newState[key] = value;
		this.setState({ [type]: newState });
	};
	//creates the authorNames state from authors {id,name} and set initial author for books
	createAuthorsNamesList = async () => {
		const authors = await this.getAllAuthors();
		if (this.state.authorsNames.length !== authors.length) {
			this.setState({
				authorsNames: authors.map((author) => ({ id: author.id, name: author.name })),
				books: { author: authors[0].id },
			});
		}
	};

	componentDidUpdate(prev) {
		if ((prev.option === "authors" || prev.option === "users") && this.state.authorsNames.length > 0) {
			this.setState({ authorsNames: [] });
		}
		if (this.props.option === "books" && this.state.authorsNames.length === 0) {
			this.createAuthorsNamesList();
		}
	}

	//creates controlled inputs
	inputsGenerator = () => {
		try {
			return keys[this.props.option].map((key) => {
				if (key !== "ratings" && key !== "author" && key !== "borrow_history") {
					return (
						<div key={key} className="inputs">
							<label htmlFor={key}>{key}: </label>
							<input
								required
								type={key === "pages" || key === "number_of_books" ? "number" : key === "publish" ? "date" : "text"}
								id={key}
								value={this.state[this.props.option][key] || ""}
								onChange={(e) => this.UpdateStateByType(this.props.option, key, e.target.value)}
							/>
						</div>
					);
				} else if (key === "author") {
					// create the authors dropdown
					return (
						<div key={key} className="inputs">
							<label htmlFor={key}>{key}: </label>
							<select
								id={key}
								onChange={(e) => {
									this.setState((state) => {
										return { books: { ...state.books, author: e.target.value } };
									});
								}}
							>
								{this.state.authorsNames.map((author) => (
									<option key={author.id} value={author.id}>
										{author.name}
									</option>
								))}
							</select>
						</div>
					);
				} else if (key !== "borrow_history") {
					return (
						// ratings rates field
						<div key={key}>
							<div className="inputs">
								<label htmlFor="rating">Rating: </label>
								<input
									required
									type="number"
									step={0.1}
									max={5}
									min={0}
									id="rating"
									value={this.state[this.props.option]["rating"] || ""}
									onChange={(e) => this.UpdateStateByType(this.props.option, "rating", e.currentTarget.value)}
								/>
							</div>
							{/* ratings count field */}
							<div className="inputs">
								<label htmlFor="count">Count: </label>
								<input
									required
									type="number"
									id="count"
									value={this.state[this.props.option]["count"] || ""}
									onChange={(e) => this.UpdateStateByType(this.props.option, "count", e.currentTarget.value)}
								/>
							</div>
						</div>
					);
				}
			});
		} catch (e) {}
	};

	//create ratings field that the server knows gow to handle with, inside books
	createRatings = async () => {
		await this.setState((state) => {
			return { books: { ...state.books, ratings: { avg: state.books.rating, count: state.books.count } } };
		});
	};
	//send the request and alert if pass or failed
	onSubmit = async (e) => {
		//check for types (dates,numbers,id...)
		e.preventDefault();
		await this.createRatings();
		axios
			.post(`/insert_${this.props.option.slice(0, -1)}`, this.state[this.props.option], {})
			.then((res) => alert("CREATED!"))
			.catch((res) =>
				this.props.option === "books"
					? alert("you cant use that id/title")
					: this.props.option === "users"
					? alert("check for existing book title or change name")
					: this.props.option === "authors" && alert("change author name")
			);
	};

	render() {
		return (
			<form className="CreateSection" onSubmit={(e) => this.onSubmit(e)}>
				{this.inputsGenerator() || <p className="defaultCreate">Select An Option</p>}
				{this.inputsGenerator() && <button id="submit">send</button>}
			</form>
		);
	}
}

export default CreateSection;
