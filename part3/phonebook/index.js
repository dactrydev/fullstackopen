let data = require("./data");
const morgan = require("morgan");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3012;
const HOST = `http://localhost:${PORT}`;
const PERSON_API_PATH = "/api/persons";

morgan.token("body", (req) => JSON.stringify(req.body));

app.use(express.json()).use(morgan(":method :url :status :body")).use(express.static("dist"));

const generateId = () => {
	const id = Math.floor(Math.random() * 1000) + 1000;
	return String(id);
};

app.get("/", (req, res) => {
	res.send("<h1>Phonebook</h1>");
});

app.get(PERSON_API_PATH, (req, res) => {
	res.json(data);
});

app.get("/info", (req, res) => {
	const entriesCountLine = `<p>Phonebook has info for ${data.length} people</p>`;
	const date = Date();
	res.json(entriesCountLine + date);
});

app.get(PERSON_API_PATH + "/:id", (req, res) => {
	const person = data.find((d) => d.id === req.params.id);
	if (!person) return res.status(404).end();
	res.json(person);
});

app.delete(PERSON_API_PATH + "/:id", (req, res) => {
	const person = data.find((d) => d.id === req.params.id);
	if (!person) return res.status(404).end();

	data = data.filter((d) => d.id !== req.params.id);
	res.status(204).end();
});

app.put(PERSON_API_PATH + "/:id", (req, res) => {
	const person = data.find((d) => d.id === req.params.id);
	if (!person) return res.status(404).end();
	const personObj = { ...req.body, id: req.params.id };
	data = data.map((d) => (d.id === req.params.id ? personObj : d));
	res.status(200).json(personObj);
});

app.post(PERSON_API_PATH, (req, res) => {
	const { name, number } = req.body;
	if (!name || !number) return res.status(400).send("content missing");

	if (data.find((d) => d.name === name)) {
		return res.status(400).send("name exists");
	}
	const person = {
		id: generateId(),
		name,
		number,
	};
	data = data.concat(person);
	res.json(person);
});

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.listen(PORT, () => console.log(`start server on :${HOST}${PERSON_API_PATH}`));
