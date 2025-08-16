const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

/**
 * Email service for sending summaries to recipients
 */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  /**
   * Send a summary to specified recipients
   * 
   * @param {Array<string>} recipients - List of email addresses
   * @param {string} subject - Email subject
   * @param {string} summary - The meeting summary content
   * @returns {Promise<object>} Email send result
   */
  async sendSummary(recipients, subject, summary) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipients.join(', '),
        subject: subject || 'Meeting Summary',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Meeting Summary</h2>
            <div style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 5px;">
              ${summary.replace(/\n/g, '<br>')}
            </div>
            <p style="color: #666; margin-top: 20px; font-size: 12px;">
              This summary was generated and shared via Meeting Notes Summarizer
            </p>
          </div>
        `,
      };

      const result = await this.transporter.sendMail(mailOptions);
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email: ' + error.message);
    }
  }
}

module.exports = new EmailService();
