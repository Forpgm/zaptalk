import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import * as path from 'path';
import * as fs from 'fs';
import { EMAIL_SUBJECT } from 'src/constants/messages';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
    });
  }

  async sendEmailVerify(
    emailTo: string,
    firstName: string,
    lastName: string,
    emailVerifyToken: string,
  ): Promise<void> {
    const templatePath = path.join(
      __dirname,
      '../../../src/template/email-verify.html',
    );

    let emailTemplate = fs.readFileSync(templatePath, 'utf8');
    emailTemplate = emailTemplate
      .replace('{{first_name}}', firstName)
      .replace('{{last_name}}', lastName)
      .replace('{{token}}', emailVerifyToken);

    await this.transporter.sendMail({
      from: this.configService.get<string>('EMAIL_USER'),
      to: emailTo,
      subject: EMAIL_SUBJECT.EMAIL_VERIFICATION_SUBJECT,
      html: emailTemplate,
    });
  }
}
