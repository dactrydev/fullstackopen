import { useEffect, useState } from "react";
import data from "../services/countries";
const useCountries = () => {
	const [error, setError] = useState(null);
	const [countries, setCountries] = useState([]);
	useEffect(() => {
		data.getData()
			.then((res) => setCountries(res))
			.catch((err) => setError("Failed to load: " + err.message));
	}, []);
	return [countries, error];
};
export default useCountries;
