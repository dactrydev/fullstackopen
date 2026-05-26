import { useState } from "react";
import Result from "./comopnents/Result";
import useCountries from "./hooks/useCountry";
const App = () => {
	const [value, setValue] = useState("");
	const [countries, error] = useCountries();

	const featuredCountries = value
		? countries.filter((c) => {
				const name = c?.name?.common?.toLowerCase().trim();
				const target = value.toLowerCase().trim();
				return name.includes(target);
			})
		: [];

	return (
		<main>
			{error && <p style={{ color: "red" }}>{error}</p>}
			find countries
			<input
				type='text'
				onChange={(e) => setValue(e.target.value)}
				value={value}
			/>
			<Result
				countries={featuredCountries}
				setValue={setValue}
			/>
		</main>
	);
};

export default App;
