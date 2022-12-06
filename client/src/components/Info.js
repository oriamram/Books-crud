import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Edit from "./Edit";
import "../styles/info.scss";
export const Info = (props) => {
	const { type, id } = useParams();
	const [values, setValues] = useState({});
	const navigator = useNavigate();
	const location = useLocation().pathname.slice(1, 5);

	//set the initial state of values, get values of specific item from the props.values
	const getValuesOfItem = () => {
		for (let specificValues of props.values[type]) {
			if (specificValues.id == id && !values.id) {
				setValues(specificValues);
				break;
			}
		}
	};

	useEffect(() => {
		getValuesOfItem();
	}, []);

	//creates the values jsx
	const renderValues = () => {
		return (
			<>
				{Object.keys(values).map((key) => {
					// console.log(key);
					return (
						<div key={key} className="value">
							<h2>{key}: </h2>
							{valueHandler(values[key])}
						</div>
					);
				})}
			</>
		);
	};

	//decides what to show to the user
	const valueHandler = (value) => {
		if (typeof value === "object") {
			// console.log(value);
			if (!value) {
				return null;
			} else if (value.avg) {
				return (
					<>
						<p>
							avarage of {value.avg} from {value.count} people
						</p>
					</>
				);
			} else if (value.id) {
				return <p>{value.name}</p>;
			} else if (value[0]) {
				return value.map((value) => <p key={value}>{value}, </p>);
			}
		} else if (!isNaN(new Date(value).getDate()) && value.toString().slice(-1) === "Z") {
			return <p>{value.slice(0, 10).split("-").reverse().join("-")}</p>;
		} else {
			return <p>{value}</p>;
		}
	};
	//when edit is clicked
	const handleEditClick = () => {
		let pathName = window.location.pathname;
		pathName = pathName.slice(5);
		navigator(`/edit${pathName}`);
	};
	//when back is clicked (from the edit page)
	const handleBackClick = () => {
		let pathName = window.location.pathname;
		pathName = pathName.slice(5);
		navigator(`/info${pathName}`);
	};
	//check in the URL for type of window and returns accordingly
	const infoOrEdit = () => {
		return location === "info" ? (
			<>
				<h1>{type.slice(0, -1) + ":"}</h1>
				{renderValues()}
				<button className="editBtn" onClick={() => handleEditClick()}>
					edit
				</button>
			</>
		) : (
			<>
				<h1>{type.slice(0, -1) + "'s Editor:"}</h1>
				<Edit valuesFromInfo={values} setUsers={props.setUsers} />
				<button className="editBtn" onClick={() => handleBackClick()}>
					back
				</button>
			</>
		);
	};
	return (
		<div className="Info">
			<div className="info">{infoOrEdit()}</div>
		</div>
	);
};
export default Info;
