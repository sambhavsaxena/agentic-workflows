import OpenAI from "openai";
import express from "express";
import dotenv from "dotenv";
import DEVELOPER_PROMPT from "./prompt.js";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY,
	baseUrl: OPENAI_BASE_URL
});

const log_message = (message) => {
	console.log(`${new Date().toLocaleTimeString()} -> ${message}`);
}

const get_temperature = async (location) => {
	const response = await fetch(
		`https://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${location}&aqi=yes`
	);
	const data = await response.json();
	return `${data.current.temp_c}°C`;
};

const tools = {
	get_temperature: get_temperature
};

const app = express();
app.use(express.json());

/**
 * Messages are used as direct prompts by the OpenAI SDK.
 * it has two parameters, role and content.
 * Role: https://platform.openai.com/docs/guides/text-generation#messages-and-roles
 * content is the JSON object that is passed to the OpenAI API.
 */
const messages = [{ role: "developer", content: DEVELOPER_PROMPT }];

app.post('/chat', async (req, res) => {
	const { prompt } = req.body;
	const query = {
		state: "START",
		prompt: prompt
	}
	log_message(JSON.stringify(query));
	messages.push({ role: "user", content: JSON.stringify(query) });
	while (1) {	// run the loop until the call.state is "OUTPUT"
		const chat = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: messages,
			response_format: { type: "json_object" }
		});

		const result = chat.choices[0].message.content;
		messages.push({ role: "assistant", content: result });

		log_message(result);

		const call = JSON.parse(result);
		if (call.state == "OUTPUT") {
			return res.json({ response: call.response });
		}
		else if (call.state == "ACTION") {
			const fx = tools[call.function];
			const function_output = await fx(call.input);
			const obs = { state: "OBSERVATION", value: function_output };
			messages.push({ role: "developer", content: JSON.stringify(obs) });
		}
	}
});

app.get('/', (req, res) => {
	res.send("GET is working!");
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
