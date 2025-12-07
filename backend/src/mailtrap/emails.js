import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificatioToken) => {
  const recipient = [{ email }];
  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificatioToken).replace(
        "{senderName}",
        sender.name
      ),
      category: "Email Verification",
    });
    return true;
  } catch (error) {
    console.error("Error with sendVerificationEmail in mailtrap", error);
    return false;
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Welcome to My Chat App!",
      html: WELCOME_EMAIL_TEMPLATE.replace("{fullName}", name)
                                  .replace("{senderName}", sender.name),
      category: "Welcome Email",  
    });
  } catch (error) {
    console.error("Error with sendWelcomeEmail in mailtrap");
    throw new Error(`Error sending welcome email: ${error}`);
  };
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL).replace("{senderName}", sender.name),
      category: "Password Reset",
    });
  } catch (error) {
    console.error("Error with sendPasswordResetEmail", error);
    const message = error?.message || String(error);
    throw new Error(`Error sending password reset email: ${message}`);
  }
};

export const sendResetSuccessEmail = async (email) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset Successfull"
    });
  } catch (error) {
    console.error("Error sending password reset success email", error);
    const message = error?.message || String(error);
    throw new Error(`Error sending password reset success email: ${message}`);
  }
};