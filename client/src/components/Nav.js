import React from "react";
import { Link, Outlet, NavLink, Routes } from "react-router-dom";
import "../styles/nav.scss";

class Nav extends React.Component {
	render() {
		return (
			<>
				<nav className="nav">
					<ul>
						<li className="dlt" onClick={(e) => this.props.onDltClick(e)}>
							<span>Delete</span>
							<div></div>
						</li>

						{/* //////////////////////////////////////// */}

						<NavLink
							style={({ isActive }) => {
								return isActive ? { color: "white" } : {};
							}}
							to={"/create"}
						>
							<li className="create">
								<span>Create</span>
								<div></div>
							</li>
						</NavLink>
						{/* //////////////////////////// */}
						<NavLink
							style={({ isActive }) => {
								return isActive ? { color: "white" } : {};
							}}
							to={"/"}
						>
							<li className="books">
								<span>Books</span>
								<div></div>
							</li>
						</NavLink>
						{/* /////////////////////////////////// */}
						<NavLink
							style={({ isActive }) => {
								return isActive ? { color: "white" } : {};
							}}
							to={"/authors"}
						>
							<li className="authors">
								<span>Authors</span>
								<div></div>
							</li>
						</NavLink>
						{/* ///////////////////////////////////////// */}
						<NavLink
							style={({ isActive }) => {
								return isActive ? { color: "white" } : {};
							}}
							to={"/users"}
						>
							<li className="users">
								<span>Users</span>
								<div></div>
							</li>
						</NavLink>
					</ul>
				</nav>
				<Outlet />
			</>
		);
	}
}

export default Nav;
