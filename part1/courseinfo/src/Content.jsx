import Part from "./Part";

export default function Content({ course }) {
	return (
		<>
			{course.parts.map((part) => (
				<Part
					key={part.name}
					part={part.name}
					exercises={part.exercises}></Part>
			))}
		</>
	);
}
