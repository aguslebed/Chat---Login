import { sendEmail } from "../utils/Mailer";
import dotenv from "dotenv";

dotenv.config();

export class EmailService {
    async sendVerificationCode(email: string, code: string): Promise<void> {
        try {
            console.log(code)
            await sendEmail({
                from: process.env.EMAIL_FROM || "onboarding@resend.dev", // Fallback to test domain if not set
                to: "agus.lebed@gmail.com",
                subject: "Your Verification Code",
                text: `Your verification code is: ${code}`,
                html: `<b>Your verification code is: ${code}</b>`,
            });
            console.log(`Verification code sent to ${email}`);
        } catch (error) {
            console.error("Error sending email:", error);
            throw new Error("Failed to send verification email");
        }
    }

    async sendPasswordResetEmail(email: string, resetLink: string): Promise<void> {
        try {
            await sendEmail({
                from: process.env.EMAIL_FROM || "onboarding@resend.dev",
                to: "agus.lebed@gmail.com", // Hardcoded as per request
                subject: "Password Reset Request",
                text: `You requested a password reset. Click the following link to reset your password: ${resetLink}`,
                html: `
                    <p>You requested a password reset.</p>
                    <p>Click the following link to reset your password:</p>
                    <a href="${resetLink}">${resetLink}</a>
                    <p>If you didn't request this, please ignore this email.</p>
                `,
            });
            console.log(`Password reset email sent to ${email} (redirected to admin)`);
        } catch (error) {
            console.error("Error sending password reset email:", error);
            throw new Error("Failed to send password reset email");
        }
    }
}
