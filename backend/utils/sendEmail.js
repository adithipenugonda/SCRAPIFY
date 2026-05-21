const nodemailer = require("nodemailer");


// ==========================================
// CREATE TRANSPORTER
// ==========================================
const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


// ==========================================
// SEND EMAIL FUNCTION
// ==========================================
const sendEmail = async (
  to,
  subject,
  html
) => {
  try {
    const mailOptions = {
      from: `Scrapify <${process.env.EMAIL_USER}>`,

      to,

      subject,

      html,
    };

    const info = await transporter.sendMail(
      mailOptions
    );

    console.log(
      `Email sent: ${info.response}`
    );
  } catch (error) {
    console.error(
      `Email Error: ${error.message}`
    );
  }
};

module.exports = sendEmail;