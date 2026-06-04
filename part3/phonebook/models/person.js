require("dotenv").config();
const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;
console.log("Connecting to", url);

mongoose
	.connect(url, { family: 4 })
	.then((r) => console.log("Connected to MongoDB"))
	.catch((e) => console.log("error connecting to MongoDB: ", e.message));

const personSchema = new mongoose.Schema({
	name: {
		type: String,
		minLength: 2,
		required: true,
	},
	number: {
		type: String,
		minLength: 8,
		required: true,
		validate: {
			validator: function (v) {
				return /^\d{2,3}-\d+$/.test(v);
			},
			message: (props) => `${props.value} is not a valid phone number!`,
		},
	},
});

personSchema.set("toJSON", {
	transform: (document, r) => {
		r.id = r._id.toString();
		delete r._id;
		delete r.__v;
	},
});

module.exports = mongoose.model("Person", personSchema);
