import dotenv from "dotenv";
import path from "path";
import OpenAI from "openai";
import express from "express";
import nodemailer from "nodemailer";
import DEVELOPER_PROMPT from "./prompt.js";
import { PrismaClient } from "@prisma/client";
import cors from "cors";

const prisma = new PrismaClient();
dotenv.config();

const PORT = process.env.PORT || 3000;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const API_KEY = process.env.API_KEY;
const API_HOST = process.env.API_HOST;
const ENDPOINT = process.env.ENDPOINT;

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const get_data_from_child_ref = async (child_ref, query_params) => {
    const params = typeof query_params === 'string' ? JSON.parse(query_params) : query_params;
    const queryString = new URLSearchParams(params).toString();
    const url = `${ENDPOINT}/${child_ref}${queryString ? `?${queryString}` : ''}`;
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
        return result.data;
    } catch (error) {
        return { error: 'Error fetching stock data' };
    }
};

const tools = {
    get_data_from_child_ref: get_data_from_child_ref
};

const log_message = (message) => {
    console.log(`${new Date().toLocaleTimeString()} -> ${message}`);
};

const app = express();

app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"]
}));

app.options('*', cors());
app.use(express.json());

const messages = [{ role: "developer", content: DEVELOPER_PROMPT }];

app.post('/api/chat', async (req, res) => {
    const { email, prompt } = req.body;
    try {
        let user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            return res.status(401).json({ response: "Unauthorized" });
        }
        if (user.messagesSent >= 10) {
            return res.status(403).json({ error: "Message limit exceeded." });
        }
        const query = {
            state: "START",
            prompt: prompt
        };
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
                await prisma.user.update({
                    where: { id: user.id },
                    data: { messagesSent: { increment: 1 } }
                });
                return res.json({ response: call.response });
            } else if (call.state == "ACTION") {
                const function_output = await tools[call.function](call.child_ref, call.query_params);
                const observation = { state: "OBSERVATION", value: function_output };
                messages.push({ role: "developer", content: JSON.stringify(observation) });
            }
        }
    } catch (error) {
        console.error("Error in /chat:", error);
        res.status(500).json({ error: "An error occurred during chat." });
    }
});

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

app.post('/api/login', async (req, res) => {
    const { email } = req.body;
    let user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        try {
            user = await prisma.user.create({
                data: {
                    email,
                    status: "PENDING"
                }
            });
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.APPROVING_EMAIL,
                subject: 'Account Approval Request',
                html: `<p>A new user with the email ${email} has signed up. Please approve their account.</p>`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error sending email:", error);
                    return res.status(201).json({ user, message: "User created, but email failed to send." });
                } else {
                    console.log("Email sent: " + info.response);
                    return res.status(201).json({ user, message: "User created, approval email sent." });
                }
            });

        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(500).json({ message: "Error creating user", error });
        }
    } else if (user.status === "PENDING") {
        return res.status(401).json({ message: "User pending approval" });
    } else if (user.status === "APPROVED") {
        return res.status(200).json({ user });
    }
});

const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/ui/dist")));
    app.get("*", (req, res) =>
        res.sendFile(path.resolve(__dirname, "ui", "dist", "index.html"))
    );
} else {
    app.get('/', (req, res) => {
        res.send("GET is working!");
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
