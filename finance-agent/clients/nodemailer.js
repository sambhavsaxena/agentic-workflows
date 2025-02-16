import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_SERVICE, EMAIL_PASSWORD } from "../core/constants.js";

const nodemailer_client = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    secure: true,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
    }
});

export default nodemailer_client;
