import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  constructor(private configService: ConfigService) {
    this.createTransporter();
  }

  private createTransporter() {
    // Configuration for Mailpit SMTP
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST', 'localhost'),
      port: parseInt(this.configService.get<string>('SMTP_PORT', '1025'), 10),
      secure: false, // Mailpit doesn't use SSL/TLS
      auth: this.configService.get<string>('SMTP_USER')
        ? {
            user: this.configService.get<string>('SMTP_USER'),
            pass: this.configService.get<string>('SMTP_PASS'),
          }
        : undefined,
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify connection configuration
    this.transporter.verify(error => {
      if (error) {
        this.logger.error('Email configuration error:', error);
      } else {
        this.logger.log('Email server is ready to take our messages');
      }
    });
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    const resetUrl = `${this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000')}/auth/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM', 'noreply@imbasubvault.com'),
      to: email,
      subject: 'Password Reset Request - ImbaSubVault',
      html: this.getPasswordResetEmailTemplate(resetUrl),
      text: `You have requested a password reset. Please visit the following link to reset your password: ${resetUrl}. If you did not request this, please ignore this email.`,
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const result: any = await this.transporter.sendMail(mailOptions);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.log(`Password reset email sent to ${email}. Message ID: ${result.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}:`, error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendWelcomeEmail(email: string, firstName: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get<string>('EMAIL_FROM', 'noreply@imbasubvault.com'),
      to: email,
      subject: 'Welcome to ImbaSubVault!',
      html: this.getWelcomeEmailTemplate(firstName),
      text: `Welcome to ImbaSubVault, ${firstName}! We're excited to have you on board. Start managing your subscriptions today!`,
    };

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const result: any = await this.transporter.sendMail(mailOptions);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.logger.log(`Welcome email sent to ${email}. Message ID: ${result.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}:`, error);
      // Don't throw error for welcome email as it's not critical for registration
    }
  }

  private getPasswordResetEmailTemplate(resetUrl: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset - ImbaSubVault</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>You have requested to reset your password for your ImbaSubVault account. Click the button below to reset your password:</p>
            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </p>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background-color: #e5e7eb; padding: 10px; border-radius: 4px;">${resetUrl}</p>
            <p><strong>This link will expire in 1 hour for security reasons.</strong></p>
            <p>If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The ImbaSubVault Team</p>
            <p>This is an automated email. Please do not reply to this email.</p>
          </div>
        </body>
      </html>
    `;
  }

  private getWelcomeEmailTemplate(firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ImbaSubVault</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #16a34a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background-color: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Welcome to ImbaSubVault!</h1>
          </div>
          <div class="content">
            <p>Hello ${firstName},</p>
            <p>Welcome to ImbaSubVault! We're excited to have you join our community of smart subscription managers.</p>
            <p>With ImbaSubVault, you can:</p>
            <ul>
              <li>Track all your subscriptions in one place</li>
              <li>Set reminders for renewal dates</li>
              <li>Monitor your spending across different services</li>
              <li>Categorize and organize your subscriptions</li>
            </ul>
            <p>Ready to get started? Click the button below to access your dashboard:</p>
            <p style="text-align: center;">
              <a href="${this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000')}/dashboard" class="button">Go to Dashboard</a>
            </p>
            <p>If you have any questions or need help getting started, don't hesitate to reach out to our support team.</p>
          </div>
          <div class="footer">
            <p>Best regards,<br>The ImbaSubVault Team</p>
            <p>This is an automated email. Please do not reply to this email.</p>
          </div>
        </body>
      </html>
    `;
  }
}
