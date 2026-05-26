import Country from "./Country";

const Result = ({ countries, setValue }) => {
	const countriesLength = countries.length;
	if (!countriesLength) return null;
	if (countriesLength > 10) return <p>Too many matches, specify another filter</p>;
	if (countriesLength === 1) return <Country country={countries[0]} />;
	return countries.map((c) => (
		<div key={c.name.common}>
			<span>{c.name.common}</span>
			<button onClick={() => setValue(c.name.common)}>Show</button>
		</div>
	));
};

export default Result;
