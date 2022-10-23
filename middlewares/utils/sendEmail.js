const nodemailer = require('nodemailer');

const sendEmail = async (dataObject) => {
  try {
    const transporter = nodemailer.createTransport({});
  } catch (error) {
    console.log(error, "email not sent");
  }
};

module.exports = sendEmail;