import { useEffect, useState } from "react";
import data from "../services/countries";
const api_key = import.meta.env.VITE_SOME_KEY;
const Country = ({ country }) => {
	const { name, capital, area, languages, flags, latlng } = country;
	const [lat, lon] = latlng;
	const [weather, setWether] = useState(null);
	const wetherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}&units=metric`;
	useEffect(() => {
		data.getData(wetherUrl).then((d) => {
			setWether({
				temp: d.main.temp,
				icon: `https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`,
				wind: d.wind.speed,
			});
		});
	}, [wetherUrl]);

	return (
		<>
			<h1>{name.common}</h1>
			<p>Capital - {capital}</p>
			<p>Area - {area}</p>
			{languages && (
				<>
					<h2>Languages</h2>
					<ul>
						{Object.values(languages).map((l) => (
							<li key={l}>{l}</li>
						))}
					</ul>
				</>
			)}
			{flags?.svg && (
				<img
					style={{ border: "2px solid" }}
					src={flags.svg}
					width={200}
					alt=''></img>
			)}
			{weather && (
				<>
					<h2>Weather in {capital}</h2>
					<p>Temperature {weather.temp} Celsius</p>
					<img
						src={weather.icon}
						alt=''
						style={{ background: "color-mix(in srgb, currentColor 2%, white)" }}
					/>
					<p>Wind {weather.wind} m/s</p>
				</>
			)}
		</>
	);
};

export default Country;
