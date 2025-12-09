import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

export const mailtrapClient = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});
if (!process.env.MAILTRAP_TOKEN) {
  console.warn("MAILTRAP_TOKEN is not set; outgoing emails will fail.");
}

export const sender = {
  email: process.env.SENDER,
  name: process.env.SENDER,
};



