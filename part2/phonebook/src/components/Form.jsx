import { useState } from "react";

const Form = ({ onAdd }) => {
	const [newName, setNewName] = useState("");
	const [newPhone, setNewPhone] = useState("");

	const handleSubmit = (e) => {
		e.preventDefault();
		const newNameFormated = newName.trim();
		const newPerson = {
			name: newNameFormated,
			number: newPhone,
		};
		onAdd(newPerson).then((ok) => {
			if (!ok) return;
			setNewName("");
			setNewPhone("");
			console.log("New person saved!");
		});
	};
	return (
		<form onSubmit={handleSubmit}>
			<div style={{ display: "flex", gap: "1rem" }}>
				<label htmlFor='name'>Name</label>
				<input
					autoComplete='given-name'
					id='name'
					name='name'
					value={newName}
					onChange={(e) => setNewName(e.target.value)}
				/>
			</div>
			<div style={{ display: "flex", gap: "1rem" }}>
				<label htmlFor='phone'>Phone</label>
				<input
					id='phone'
					name='phone'
					type='number'
					autoComplete='tel'
					value={newPhone}
					onChange={(e) => setNewPhone(e.target.value)}
				/>
			</div>
			<div>
				<button type='submit'>add</button>
			</div>
		</form>
	);
};

export default Form;
