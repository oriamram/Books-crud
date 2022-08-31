import { useRef, useState } from "react";
import CreateSection from "./CreateSection";
import "../../styles/create.scss";

const Create = (props) => {
	const [selectedOption, setSelectedOption] = useState("");
	const booksRef = useRef(null);
	const authorsRef = useRef(null);
	const usersRef = useRef(null);

	const onChoose = (ref) => {
		setSelectedOption(ref.current.id);
	};

	return (
		<div className="Create">
			<div className="createOptions">
				<button ref={booksRef} id="books" className="options" onClick={() => onChoose(booksRef)}>
					Books
				</button>
				<button ref={authorsRef} id="authors" className="options" onClick={() => onChoose(authorsRef)}>
					Authors
				</button>
				<button ref={usersRef} id="users" className="options" onClick={() => onChoose(usersRef)}>
					Users
				</button>
			</div>
			<CreateSection option={selectedOption} />
		</div>
	);
};
export default Create;
