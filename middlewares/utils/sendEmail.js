const config = process.env;
const nodemailer = require('nodemailer');

const sendEmail = async (dataObject) => {
  try {
    const transporter = nodemailer.createTransport({
      service: config.EMAIL_SERVICE,
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: config.EMAIL_SENDER,
      to: dataObject['email'],
      subject: dataObject['subject'],
      text: `Reset password link: ${dataObject['text']}`
    });
  } catch (error) {
    console.log(error, "email not sent", error);
    resizeBy.status(500).json({ status: "FAILED", message: "Email not sent" });
  }
};

module.exports = sendEmail;