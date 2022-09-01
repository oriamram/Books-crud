import React from "react";
import { useNavigate } from "react-router-dom";
const Row = (props) => {
	const navigator = useNavigate();

	//create all the "th"s
	const createHeader = () => {
		return props.values.map((value) => {
			return <th key={value}>{value}</th>;
		});
	};
	//create all the "td"s, handle all kind of rows
	const createRow = () => {
		let counter = 0;
		return props.values.map((value) => {
			if (!value) {
				counter++;
				return <td key={value === null ? counter : value}></td>;
			}
			if (!isNaN(new Date(value).getDate()) && value.toString().slice(-1) === "Z") return <td key={value}>{value.slice(0, 10)}</td>;
			counter++;
			return <td key={counter}>{typeof value === "object" ? value.name || "[ " + value.join(", ") + " ] >>>" : value}</td>;
		});
	};

	//check for header and return accordingly
	const rowByType = () => {
		return props.isHeader ? (
			<tr>
				{createHeader()}
				<th></th>
			</tr>
		) : (
			<>
				{createRow()}
				<td className="dltBtn" onClick={async () => await props.onDlt(props.values[0])}>
					<span className="material-symbols-outlined dltBtn">delete</span>
				</td>
			</>
		);
	};

	//navigate to the info page
	const handleRowClick = () => {
		const pathName = window.location.pathname;
		navigator(`/info${pathName === "/" ? "/books" : pathName}/${props.values[0]}`);
	};

	return props.isHeader ? (
		<thead className="tableHead">{rowByType()}</thead>
	) : (
		<tr
			className="tableRow"
			onClick={(e) => {
				!e.target.classList.contains("dltBtn") && handleRowClick();
			}}
		>
			{rowByType()}
		</tr>
	);
};

export default Row;
