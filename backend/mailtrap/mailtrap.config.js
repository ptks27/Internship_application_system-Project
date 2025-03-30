import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

export const mailtrapClient = new MailtrapClient({
  token: "7c4afdc83846d8166fff15a9f19e0a15",
  endpoint: "https://send.api.mailtrap.io/",
});

export const sender = {
  email: "hello@thetraineebasbee.com",
  name: "THE TRAINEE.",
};
