import Content from "./Content";
import Header from "./Header";
import Total from "./Total";

const Course = ({ course }) => {
	return (
		<section>
			<Header name={course.name} />
			<Content parts={course.parts} />
			<Total parts={course.parts} />
		</section>
	);
};

export default Course;
