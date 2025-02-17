import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import dotenv from "dotenv"
import express from "express"
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"]
}));

dotenv.config();

const tools = [new TavilySearchResults({ maxResults: 3 })];
const openai = new ChatOpenAI({ temperature: 0.1, model: process.env.AI_MODEL });

const memory = new MemorySaver();
const agent = createReactAgent({
  llm: openai,
  tools: tools,
  checkpointSaver: memory,
});

const get_response = async (message) => {
  const agentState = await agent.invoke(
    { messages: [new HumanMessage(message)] },
    { configurable: { thread_id: 1 } },
  );
  return agentState.messages[agentState.messages.length - 1].content;
}

app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  const response = await get_response(prompt);
  res.json({ "response": response });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
