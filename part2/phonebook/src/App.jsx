import axios from "axios";
import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import Form from "./components/Form";
import Persons from "./components/Persons";
const App = () => {
	const [persons, setPersons] = useState([]);
	const [search, setSearch] = useState("");

	useEffect(() => {
		axios
			.get("http://localhost:3001/persons")
			.then((response) => new Promise((resolve) => setTimeout(() => resolve(response), 2000)))
			.then((response) => setPersons(response.data));
	}, []);

	const onAdd = (person) => {
		if (person.name === "") {
			alert("Please enter a valid name");
			return false;
		}
		if (persons.some((p) => p.name === person.name)) {
			alert(`Name ${person.name} already exists`);
			return false;
		}
		if (person.number === "") {
			alert("Please enter a valid phone");
			return false;
		}
		if (persons.some((p) => p.number === person.number)) {
			alert(`Phone ${person.number} already exists`);
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
			{variablePersons.length ? (
				<>
					<h2>Numbers</h2>
					<Persons persons={variablePersons} />
				</>
			) : (
				<p>Fetching data...</p>
			)}
		</div>
	);
};

export default App;
