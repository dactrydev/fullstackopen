const Persons = ({ persons }) => {
	return persons.map((person) => (
		<p key={person.id}>
			{person.name} - {person.phone}
		</p>
	));
};

export default Persons;
