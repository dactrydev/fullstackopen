import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import Form from "./components/Form";
import Persons from "./components/Persons";
import servicePerson from "./service/persons";
const App = () => {
	const [persons, setPersons] = useState([]);
	const [search, setSearch] = useState("");

	useEffect(() => {
		servicePerson
			.getAllData()
			.then((response) => new Promise((resolve) => setTimeout(() => resolve(response), 500)))
			.then((response) => setPersons(response))
			.catch((e) => {
				throw new Error(e);
			});
	}, []);

	const onAdd = async (person) => {
		const existPerson = persons.find((p) => p.name === person.name);
		console.log("Start validation...");
		if (person.name === "") {
			alert("Please enter a valid name");
			return false;
		}

		if (person.number === "") {
			alert("Please enter a valid phone");
			return false;
		}

		console.log("Finish validation!");

		if (existPerson) {
			if (window.confirm(`${existPerson.name} is already added to Phonebook, replace ${existPerson.number} with ${person.number}?`)) {
				return servicePerson.putData(person, existPerson.id).then((res) => {
					setPersons((prev) => prev.map((p) => (p.id === existPerson.id ? res : p)));
				});
			}
			return false;
		}
		return servicePerson
			.postData(person)
			.then((res) => {
				setPersons((prev) => prev.concat(res));
				return true;
			})
			.catch((e) => {
				console.log("Someting went wrong: ", e);
				return false;
			});
	};

	const deletePerson = (id) => {
		servicePerson.deleteData(id).then((res) => setPersons(persons.filter((p) => p.id !== res.id)));
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
					<Persons
						persons={variablePersons}
						deletePerson={deletePerson}
					/>
				</>
			) : (
				<p>Fetching data...</p>
			)}
		</div>
	);
};

export default App;
