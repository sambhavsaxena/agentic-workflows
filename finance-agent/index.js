import dotenv from "dotenv";
import path from "path";
import express from "express";
import cors from "cors";
import { login_controller, chat_controller } from "./core/controllers.js";
import { PORT, NODE_ENV } from "./core/constants.js"

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept"]
}));

app.post('/api/chat', chat_controller);
app.post('/api/login', login_controller);

if (NODE_ENV === "production") {
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
