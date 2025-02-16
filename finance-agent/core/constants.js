import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const NODE_ENV = process.env.NODE_ENV;
const API_HOST = process.env.API_HOST;
const ENDPOINT = process.env.ENDPOINT;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const EMAIL_USER = process.env.EMAIL_USER;
const APPROVING_EMAIL = process.env.APPROVING_EMAIL;
const EMAIL_SERVICE = process.env.EMAIL_SERVICE;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

export { PORT, API_KEY, NODE_ENV, API_HOST, ENDPOINT, OPENAI_API_KEY, EMAIL_USER, EMAIL_PASSWORD, APPROVING_EMAIL, EMAIL_SERVICE };
