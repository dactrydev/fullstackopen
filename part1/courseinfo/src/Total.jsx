const Total = ({ course }) => <p>Number of exercises - {course.parts.reduce((sum, p) => sum + p.exercises, 0)}</p>;

export default Total;
