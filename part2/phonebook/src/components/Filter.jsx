const Filter = ({ inputSearch, search }) => {
	return (
		<>
			<div style={{ display: "flex", gap: "1rem" }}>
				<label htmlFor='search'>Filter</label>

				<input
					type='text'
					id='search'
					name='search'
					autoComplete='off'
					value={search}
					onChange={(e) => inputSearch(e.target.value)}
				/>
			</div>
		</>
	);
};

export default Filter;
