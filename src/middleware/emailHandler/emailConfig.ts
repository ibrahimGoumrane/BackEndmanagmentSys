import nodemailer from "nodemailer";
import env from "../../util/validateEnv";
const transporter = nodemailer.createTransport({
  port: env.EMAIL_PORT, // The door number at the post office
  host: env.EMAIL_HOST, // The address of the post office
  auth: {
    user: env.EMAIL_USER, // Your email address (so the mailman knows who is sending the letter)
    pass: env.EMAIL_PASSWORD, // Your email password (so the mailman can send the letter safely)
  },
  secure: env.EMAIL_SECURE, // This means the mailman uses a safe route to the post office
});
export default transporter;
