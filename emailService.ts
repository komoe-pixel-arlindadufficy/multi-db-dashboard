import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendReportEmail(reportData: any) {
  const recipient = process.env.REPORT_RECIPIENT;
  if (!recipient) throw new Error('REPORT_RECIPIENT not configured');

  const html = `
    <div style="font-family: sans-serif; color: #333;">
      <h1 style="color: #4f46e5;">Enterprise Reporting Dashboard - Manual Report</h1>
      <p>Generated on: ${new Date().toLocaleString()}</p>
      
      <div style="margin-top: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h2 style="font-size: 18px; margin-bottom: 10px;">Database Health Summary</h2>
        <ul>
          <li>MSSQL: ${reportData.health.mssql.connected ? '✅ Connected' : '❌ Disconnected'}</li>
          <li>MySQL: ${reportData.health.mysql.connected ? '✅ Connected' : '❌ Disconnected'}</li>
          <li>PostgreSQL: ${reportData.health.pg.connected ? '✅ Connected' : '❌ Disconnected'}</li>
        </ul>
      </div>

      <div style="margin-top: 20px;">
        <h2 style="font-size: 18px; margin-bottom: 10px;">Report Highlights</h2>
        <p>Total Records Merged: ${reportData.reports.length}</p>
      </div>

      <p style="margin-top: 30px; font-size: 12px; color: #6b7280;">
        This is an automated report from your Enterprise Dashboard.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Enterprise Dashboard" <${process.env.SMTP_USER}>`,
    to: recipient,
    subject: 'Enterprise Reporting Dashboard - Manual Report',
    html: html,
  });
}
