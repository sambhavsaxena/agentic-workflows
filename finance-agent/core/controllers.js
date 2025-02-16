import DEVELOPER_PROMPT from "../prompt.js";
import get_data_from_child_ref from "./tools.js";
import prisma from "../clients/prisma.js"
import openai from "../clients/openai.js"
import { send_login_mail, log_message } from "./utils.js";

const tools = {
    get_data_from_child_ref: get_data_from_child_ref
};

export const login_controller = async (req, res) => {
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
            await send_login_mail(email);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(500).json({ message: "Error creating user", error });
        }
    } else if (user.status === "PENDING") {
        return res.status(401).json({ message: "User pending approval" });
    } else if (user.status === "APPROVED") {
        return res.status(200).json({ user });
    }
}

export const chat_controller = async (req, res) => {
    const messages = [{ role: "developer", content: DEVELOPER_PROMPT }];
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
}
