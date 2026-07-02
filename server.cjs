const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
app.use(cors());
app.use(express.json());

// Real Gmail SMTP Configuration
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '2300031854cse3@gmail.com',
    pass: 'nygw pjqj vuty xuva' 
  }
});
console.log('Mail Server configured for Gmail! (Requires valid App Password)');

app.post('/api/send-email', async (req, res) => {
  const { email, patient, dept, doc, date, time } = req.body;
  
  if (!transporter) {
    return res.status(500).json({ error: 'Mail server not ready yet.' });
  }

  const mailOptions = {
    from: '"VisionCare Eye Hospital" <2300031854cse3@gmail.com>',
    to: email, // Patient's email from the form
    subject: `Appointment Confirmed - ${doc}`,
    html: `
      <div style="font-family: sans-serif; max-w: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #18E0FF; background-color: #0B1120; padding: 20px; border-radius: 10px; text-align: center;">VisionCare Eye Hospital</h2>
        <h3>Appointment Confirmed!</h3>
        <p>Dear <strong>${patient}</strong>,</p>
        <p>We are pleased to inform you that your appointment request for <strong>${dept}</strong> has been successfully accepted by <strong>${doc}</strong>.</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-left: 4px solid #22c55e; border-radius: 8px; margin: 25px 0;">
          <p style="margin: 5px 0;"><strong>📅 Date:</strong> ${date}</p>
          <p style="margin: 5px 0;"><strong>⏰ Time:</strong> ${time}</p>
          <p style="margin: 5px 0;"><strong>🏥 Location:</strong> Main Campus, 123 Vision Avenue</p>
        </div>
        
        <p>Please arrive 15 minutes before your scheduled time to complete any necessary registration forms.</p>
        <p>Best Regards,<br><strong>VisionCare Administration</strong></p>
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
