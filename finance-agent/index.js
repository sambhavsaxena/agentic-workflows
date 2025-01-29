import dotenv from "dotenv";
import OpenAI from "openai";
import express from "express";
import DEVELOPER_PROMPT from "./prompt.js";

dotenv.config();
const API_KEY = process.env.API_KEY;
const API_HOST = process.env.API_HOST;
const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ENDPOINT = process.env.ENDPOINT;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const get_stock_information = async (stock_ticker) => {
    const url = `${ENDPOINT}/stock-overview?symbol=${stock_ticker}&language=en`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': API_KEY,
            'x-rapidapi-host': API_HOST,
        },
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        return result;
    } catch (error) {
        return { error: 'Error fetching stock data' };
    }
}

const tools = {
    get_stock_information: get_stock_information
}

const log_message = (message) => {
    console.log(`${new Date().toLocaleTimeString()} -> ${message}`);
}

const app = express();
app.use(express.json());

const messages = [{ role: "developer", content: DEVELOPER_PROMPT }];

app.post('/chat', async (req, res) => {
    const { prompt } = req.body;
    const query = {
        state: "START",
        prompt: prompt
    }
    log_message(JSON.stringify(query));
    messages.push({ role: "user", content: JSON.stringify(query) });
    while (1) {
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
