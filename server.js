import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
app.use(cors());
app.use(express.json());

// Set up Nodemailer with Ethereal (Free testing SMTP)
// This will work immediately without requiring Gmail passwords.
// It generates a link where you can view the actual sent email in your browser!
let transporter;
nodemailer.createTestAccount().then(account => {
  transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: {
      user: account.user,
      pass: account.pass
    }
  });
  console.log('Mail Server Ready! Using Ethereal Test Account.');
});

app.post('/api/send-email', async (req, res) => {
  const { email, patient, dept, doc, date, time, phone } = req.body;
  
  if (!transporter) {
    return res.status(500).json({ error: 'Mail server not ready yet.' });
  }

  const mailOptions = {
    from: '"VisionCare Eye Hospital" <appointments@visioncare.com>',
    to: email, // Patient's email from the form
    subject: `Your Appointment is Confirmed! - ${doc}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-w: 600px; margin: 0 auto; color: #334155; line-height: 1.6;">
        <div style="background-color: #0B1120; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #18E0FF; margin: 0; font-size: 24px; letter-spacing: 1px;">VisionCare Eye Hospital</h1>
        </div>
        
        <div style="background-color: #ffffff; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
          <h2 style="color: #0f172a; margin-top: 0;">Appointment Confirmed</h2>
          <p>Dear <strong>${patient}</strong>,</p>
          <p>We hope this email finds you well. We are writing to formally confirm that your outpatient consultation request has been approved and scheduled by your designated specialist.</p>
          
          <div style="background-color: #f8fafc; padding: 25px; border-left: 5px solid #22c55e; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin-top: 0; color: #0f172a; font-size: 16px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Schedule Details</h3>
            <p style="margin: 8px 0;"><strong>Doctor:</strong> ${doc}</p>
            <p style="margin: 8px 0;"><strong>Department:</strong> ${dept}</p>
            <p style="margin: 8px 0;"><strong>Date:</strong> ${date}</p>
            <p style="margin: 8px 0;"><strong>Time:</strong> ${time}</p>
            <p style="margin: 8px 0;"><strong>Registered Mobile:</strong> ${phone || 'Not provided'}</p>
          </div>
          
          <p><strong>Important Instructions:</strong></p>
          <ul style="color: #475569; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Please arrive at least <strong>15 minutes prior</strong> to your scheduled time.</li>
            <li style="margin-bottom: 8px;">Bring any previous medical records, prescriptions, or relevant test reports.</li>
            <li style="margin-bottom: 8px;">If you need to reschedule, please contact our reception immediately.</li>
          </ul>

          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          
          <p style="margin-bottom: 5px;">We look forward to providing you with the best eye care experience.</p>
          <p style="margin-top: 5px;">Warm regards,<br>
          <strong style="color: #0f172a;">VisionCare Administration Team</strong><br>
          <span style="font-size: 14px; color: #64748b;">Phone: +91 98000 12345 | Email: support@visioncare.com</span></p>
        </div>
      </div>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('----------------------------------------');
    console.log('Email sent to:', email);
    console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    console.log('----------------------------------------');
    res.json({ success: true, previewUrl: nodemailer.getTestMessageUrl(info) });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});
