"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }
    async sendPasswordResetEmail(email, resetToken) {
        const logoUrl = "https://i.imgur.com/awWR2CW.png";
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset Code - MetaCV",
            html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - MetaCV</title>
        </head>
        <body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: 'Montserrat', Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header with Logo -->
          <div style="background: #FFF9EC; padding: 30px 20px; text-align: center; border-radius: 12px 12px 0 0;">
            <!-- MetaCV Logo -->
             <div style="margin-bottom: 20px;">
            <img src="${logoUrl}" alt="MetaCV Logo" style="display: block; margin: 0 auto; border-radius: 8px;">
          </div>
            <h1 style="color: #000000; margin: 0; font-size: 24px; font-weight: 600;">Password Reset</h1>
            <p style="color: #000000; margin: 5px 0 0 0; font-size: 14px;">MetaCV</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Hello! We received a request to reset your password for your MetaCV account.
            </p>
            
            <p style="color: #333333; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              Use the following verification code to reset your password:
            </p>
            
            <!-- Verification Code Box -->
            <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 2px solid #2C003E; border-radius: 8px; padding: 25px; text-align: center; margin: 30px 0;">
              <p style="color: #666666; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
              <h2 style="color: #2C003E; margin: 0; font-size: 32px; font-weight: 700; letter-spacing: 4px; font-family: 'Courier New', monospace;">${resetToken}</h2>
            </div>
            
            <p style="color: #dc3545; font-size: 14px; font-weight: 600; text-align: center; margin-bottom: 30px;">
              ⏰ This code will expire in 10 minutes
            </p>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; font-size: 14px; margin: 0; text-align: center;">
                <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email and ensure your account is secure.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
            <p style="color: #6c757d; font-size: 12px; margin: 0 0 10px 0;">
              This is an automated message from MetaCV
            </p>
            <p style="color: #6c757d; font-size: 12px; margin: 0;">
              Please do not reply to this email
            </p>
          </div>
        </div>
        </body>
        </html>
      `,
        };
        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Password reset email sent to ${email}`);
        }
        catch (error) {
            console.error("Error sending email:", error);
            console.error("Error details:", JSON.stringify(error, null, 2));
            throw new Error("Failed to send password reset email");
        }
    }
}
exports.emailService = new EmailService();
//# sourceMappingURL=email.service.js.map