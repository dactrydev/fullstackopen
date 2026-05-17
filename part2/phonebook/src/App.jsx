import { useState } from "react";
import Filter from "./components/Filter";
import Form from "./components/Form";
import Persons from "./components/Persons";

const App = ({ data }) => {
	const [persons, setPersons] = useState(data);
	const [search, setSearch] = useState("");

	const onAdd = (person) => {
		if (person.name === "") {
			alert("Please enter a valid name");
			return false;
		}
		if (persons.some((p) => p.name === person.name)) {
			alert(`Name ${person.name} already exists`);
			return false;
		}
		if (person.phone === "") {
			alert("Please enter a valid phone");
			return false;
		}
		if (persons.some((p) => p.phone === person.phone)) {
			alert(`Phone ${person.phone} already exists`);
			return false;
		}
		setPersons(persons.concat(person));
		return true;
	};

	const variablePersons = search ? persons.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())) : persons;

	return (
		<div>
			<h1>Phonebook</h1>
			<h2>Search</h2>
			<Filter
				inputSearch={setSearch}
				search={search}
			/>
			<br />
			<h2>Add a new</h2>
			<Form
				onAdd={onAdd}
				persons={persons}
			/>
			<h2>Numbers</h2>
			<Persons persons={variablePersons} />
		</div>
	);
};

export default App;
