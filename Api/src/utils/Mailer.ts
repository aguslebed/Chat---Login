import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.EMAIL_API_KEY);

interface MailerOptions {
    from: string;
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
}

export const sendEmail = async (options: MailerOptions) => {
    const { from, to, subject, html, text } = options;

    // Validate that at least one content type is provided
    if (!html && !text) {
        throw new Error('You must provide either html or text content.');
    }

    const payload: any = {
        from,
        to,
        subject,
    };

    if (html) payload.html = html;
    if (text) payload.text = text;

    try {
        const response = await resend.emails.send(payload);

        if (response.error) {
            console.error('Resend API Error:', response.error);
            throw new Error(`Resend Error: ${response.error.message}`);
        }


        return response.data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
