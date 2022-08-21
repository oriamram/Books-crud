import React from "react";
import axios from "axios";

class Row extends React.Component {
	//create all the "th"s
	createHeader = () => {
		return this.props.values.map((value) => {
			return <th key={Math.floor(Math.random() * 100000 + 1)}>{value}</th>;
		});
	};
	//create all the "td"s
	createRow = () => {
		return this.props.values.map((value) => {
			if (!value) return <td key={Math.floor(Math.random() * 100000 + 1)}></td>;
			if (!isNaN(new Date(value).getDate()) && value.toString().slice(-1) === "Z") return <td key={Math.floor(Math.random() * 100000 + 1)}>{value.slice(0, 10)}</td>;
			return <td key={Math.floor(Math.random() * 100000 + 1)}>{typeof value === "object" ? value.name : value}</td>;
		});
	};

	//check for header and return accordingly
	rowByType = () => {
		if (this.props.isHeader) {
			return <tr>{this.createHeader()}</tr>;
		} else {
			try {
				return <>{this.createRow()}</>;
			} catch (e) {
				console.log('no "values" in props of row');
			}
		}
	};

	render() {
		return this.props.isHeader ? (
			<thead className="tableHead">{this.rowByType()}</thead>
		) : (
			<tr className={"tableRow " + (this.props.dltMode ? "dltMode" : "")} onClick={() => this.props.onDlt(this.props.values[0])}>
				{this.rowByType()}
			</tr>
		);
	}
}

export default Row;
