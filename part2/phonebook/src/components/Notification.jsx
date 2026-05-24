const Notification = ({ message, status }) => {
	const color = status === "success" ? "green" : "red";
	return (
		message && (
			<p
				style={{
					color: color,
					padding: ".75rem 1rem",
					background: "color-mix(in srgb, transparent 90%, currentColor 10%)",
					borderRadius: ".3rem",
					border: "2px solid currentColor",
				}}>
				{message}
			</p>
		)
	);
};

export default Notification;
