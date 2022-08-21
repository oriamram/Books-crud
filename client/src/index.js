import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./components/App";
const Index = () => {
	return (
		<div className="Index">
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</div>
	);
};

const root = ReactDOM.createRoot(document.querySelector("#root"));
root.render(<Index />);
