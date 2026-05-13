const Total = ({ parts }) => <strong>Number of exercises - {parts.reduce((sum, p) => sum + p.exercises, 0)}</strong>;

export default Total;
