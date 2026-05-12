import { useState } from "react";
import Button from "./Button";
import Statistics from "./Statistics";

const App = () => {
	const [good, setGood] = useState(0);
	const [neutral, setNeutral] = useState(0);
	const [bad, setBad] = useState(0);
	const ratings = [
		{ title: "good", value: good, handleClick: setGood },
		{ title: "neutral", value: neutral, handleClick: setNeutral },
		{ title: "bad", value: bad, handleClick: setBad },
	];
	return (
		<>
			<h1>Give feedback</h1>

			{ratings.map((rating) => (
				<Button
					key={rating.title}
					onClick={() => rating.handleClick(rating.value + 1)}
					text={rating.title}
				/>
			))}

			<Statistics ratings={ratings} />
		</>
	);
};

export default App;
