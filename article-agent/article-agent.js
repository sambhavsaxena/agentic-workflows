import dotenv from "dotenv";
import OpenAI from "openai";
import express from "express";
import DEVELOPER_PROMPT from "./prompt.js";

dotenv.config();

const BEARER_TOKEN = process.env.BEARER_TOKEN;
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const post_article = async ({ title, content, category }) => {
    try {
        const response = await fetch('https://ikigai-p9nl.onrender.com/api/articles/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BEARER_TOKEN}`
            },
            body: JSON.stringify({
                title: title,
                content: content,
                category: category
            })
        });
        const database_output = await response.json();
        return database_output;
    }
    catch (error) {
        console.log("Error posting article:", error);
    }
}

const tools = {
    post_article: post_article
}

const log_message = (message) => {
	console.log(`${new Date().toLocaleTimeString()} -> ${message}`);
}

const app = express();
app.use(express.json());

const messages = [{ role: "developer", content: DEVELOPER_PROMPT }];

app.post('/generate-and-post-article', async (req, res) => {
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
			response_format: { type: "json_object" },
            temperature: 1.2
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
			const observation = { state: "OBSERVATION", value: function_output };
			messages.push({ role: "developer", content: JSON.stringify(observation) });
		}
	}
});

app.get('/', (req, res) => {
	res.send("GET is working!");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
