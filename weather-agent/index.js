import OpenAI from "openai";
import express from "express";
import dotenv from "dotenv";
import SYSTEM_PROMPT from "./system_prompt";

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY,
});

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

const messages = [{ role: "system", content: SYSTEM_PROMPT }]

app.post('/chat', async (req, res) => {
	const { prompt } = req.body;
	const query = {
		type: "user",
		user: prompt
	}
	messages.push({ role: "user", content: JSON.stringify(query) });
	while (1) {	// run the loop until the call.type is "output"
		const chat = await openai.chat.completions.create({
			model: "gpt-4o-mini",
			messages: messages,
			response_format: { type: "json_object" }
		});

		const result = chat.choices[0].message.content;
		messages.push({ role: "assistant", content: result });

		console.log(result);

		const call = JSON.parse(result);
		if (call.type == "output") {
			res.json({ response: call.output });
			break;
		}
		else if (call.type == "action") {
			const fx = tools[call.function];
			const observation = await fx(call.input);
			const obs = { type: "observation", observation: observation };
			messages.push({ role: "developer", content: JSON.stringify(obs) });
		}
	}
	return;
});

app.get('/', (req, res) => {
	res.send("GET is working!");
});

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
