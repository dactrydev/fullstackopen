const StatisticLine = ({ text, value }) => (
	<tr>
		<td>{text}</td>
		<td>{value}</td>
	</tr>
);

const Statistics = ({ ratings }) => {
	const all = ratings.map((r) => r.value).reduce((sum, r) => sum + r, 0);
	if (all === 0) {
		return (
			<>
				<h2>Statistics</h2>
				<p>No feedback yet</p>
			</>
		);
	}

	const goodValue = ratings.find((r) => r.title === "good").value;
	const badValue = ratings.find((r) => r.title === "bad").value;
	const average = (goodValue - badValue) / all;
	const positive = (goodValue / all) * 100;
	return (
		<>
			<h2>Statistics</h2>
			<table>
				<tbody>
					{ratings.map((r) => (
						<StatisticLine
							key={r.title}
							text={r.title}
							value={r.value}
						/>
					))}

					<StatisticLine
						text='all'
						value={all}
					/>
					<StatisticLine
						text='average'
						value={average}
					/>
					<StatisticLine
						text='positive'
						value={`${positive}%`}
					/>
				</tbody>
			</table>
		</>
	);
};

export default Statistics;
