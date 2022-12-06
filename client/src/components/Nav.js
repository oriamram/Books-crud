import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import "../styles/nav.scss";

const Nav = (props) => {
	return (
		<>
			<nav className="nav">
				<ul>
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
					{/* //////////////////////////////////////////// */}

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
					{/* ///////////////////////////////////////// */}
					<form
						onSubmit={(e) => {
							e.preventDefault();
							console.log("submited");
						}}
					>
						<input type="text" placeholder="Search" value={props.search} onChange={(e) => props.setSearch(e.target.value)} />
					</form>
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
};

export default Nav;
