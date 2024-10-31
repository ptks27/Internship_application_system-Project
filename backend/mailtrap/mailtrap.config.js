import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

// Add error handling for missing environment variables
if (!process.env.MAILTRAP_TOKEN || !process.env.MAILTRAP_ENDPOINT) {
  throw new Error("Missing required Mailtrap environment variables");
}

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
  endpoint: process.env.MAILTRAP_ENDPOINT,
});

export const sender = {
  email: "hello@thetraineebasbee.com",
  name: "THE TRAINEE.",
};
