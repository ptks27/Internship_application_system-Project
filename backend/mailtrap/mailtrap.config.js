import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

export const mailtrapClient = new MailtrapClient({
  token: "",
  endpoint: "",
});

export const sender = {
  email: "",
  name: "THE TRAINEE.",
};
