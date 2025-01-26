import dotenv from "dotenv";
import OpenAI from "openai";
import express from "express";

dotenv.config();
const BEARER_TOKEN = process.env.BEARER_TOKEN;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generate_article = async (prompt) => {
    console.log("Executing generate_article with prompt:", prompt);
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{
            role: "user",
            content: `The response to this prompt must start with a suitable title as the first line, but must not explicitly contain the word "title", and category of the write-up as the last word. Prompt: ${prompt}`
        }],
    });
    const title = response.choices[0].message.content.split("\n")[0].replace(/[^a-zA-Z0-9\s]/g, '');
    const content = response.choices[0].message.content.split("\n").slice(1).join("\n");
    const category = content.split(" ").slice(-1)[0].replace(/[^a-zA-Z0-9\s]/g, '');
    return { title, content, category };
}

const post_article = async (title, content, category) => {
    console.log("Executing post_article with title:", title, "some content and ", "category:", category);
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
        const data = await response.json();
        console.log("Article posted successfully!");
        return data;
    }
    catch (error) {
        console.log("Error posting article:", error);
    }
}

const tools = {
    generate_article: generate_article,
    post_article: post_article
}

const app = express();
app.use(express.json());

app.post('/generate-and-post-article', async (req, res) => {
    const { prompt } = req.body;

    try {
        const article = await tools.generate_article(prompt);
        const { title, content, category } = article;
        const postedArticle = await tools.post_article(title, content, category);
        res.json({
            message: "The article has been successfully created and posted.",
            article: postedArticle
        });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while generating or posting the article." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
