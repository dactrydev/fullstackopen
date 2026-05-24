import { useEffect, useState } from "react";
import Filter from "./components/Filter";
import Form from "./components/Form";
import Notification from "./components/Notification";
import Persons from "./components/Persons";
import servicePerson from "./service/persons";
const App = () => {
	const [persons, setPersons] = useState([]);
	const [search, setSearch] = useState("");
	const [notification, setNotification] = useState({ message: "", status: "" });

	const message = (message, status = "success") => {
		setNotification({ message, status });
		setTimeout(() => setNotification({ message: "", status: "" }), 3000);
	};

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

		// change Person if exists
		if (existPerson) {
			if (window.confirm(`${existPerson.name} is already added to Phonebook, replace ${existPerson.number} with ${person.number}?`)) {
				return servicePerson
					.putData(person, existPerson.id)
					.then((res) => {
						setPersons((prev) => prev.map((p) => (p.id === existPerson.id ? res : p)));
					})
					.catch(() => false);
			}
			return false;
		}

		// add new Person
		return servicePerson
			.postData(person)
			.then((res) => {
				setPersons((prev) => prev.concat(res));
				message(`Added ${person.name}`);
				return true;
			})
			.catch((e) => {
				message(`Someting went wrong: ${e.message}`, "error");
				return false;
			});
	};

	const deletePerson = (id) => {
		servicePerson
			.deleteData(id)
			.then((res) => {
				setPersons(persons.filter((p) => p.id !== res.id));
				message(`Deleted ${res.name}`);
			})
			.catch((e) => {
				message(`Someting went wrong: ${e.message}`, "error");
			});
	};

	const variablePersons = search ? persons.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())) : persons;

	return (
		<div>
			<h1>Phonebook</h1>
			<h2>Search</h2>

			<Notification
				message={notification.message}
				status={notification.status}
			/>
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
