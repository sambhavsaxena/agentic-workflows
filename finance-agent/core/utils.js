import { nodemailer_client } from "../clients/nodemailer.js"
import { EMAIL_USER, APPROVING_EMAIL } from "./constants.js";

export const send_login_mail = async (email) => {
    const login_email_content = {
        from: EMAIL_USER,
        to: APPROVING_EMAIL,
        subject: 'Account Approval Request',
        html: `<p>A new user with the email ${email} has signed up. Please approve their account.</p>`
    };
    nodemailer_client.sendMail(login_email_content, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(201).json({ user, message: "User created, but email failed to send." });
        } else {
            console.log("Email sent: " + info.response);
            return res.status(201).json({ user, message: "User created, approval email sent." });
        }
    });
}

export const log_message = (message) => {
    console.log(`${new Date().toLocaleTimeString()} -> ${message}`);
};
