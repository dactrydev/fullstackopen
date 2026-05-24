const Persons = ({ persons, deletePerson }) => {
	return persons.map((person) => (
		<div key={person.id}>
			<span>
				{person.name} - {person.number}
			</span>
			<button
				onClick={() => {
					if (window.confirm("Do you want to delete this note?")) {
						deletePerson(person.id);
					}
				}}>
				Delete
			</button>
		</div>
	));
};

export default Persons;
