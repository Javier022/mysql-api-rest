const nodemailer = require("nodemailer");
const template = require("../lib/templateEmail");

const createTransporter = () => {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMIAL,
      pass: process.env.EMAILER_KEY,
    },
  });

  return transport;
};

const sendMail = async (user, randomValue) => {
  try {
    const transporter = createTransporter();

    const info = await transporter.sendMail({
      from: `"TodoApp ✔" <${process.env.EMAIL}>`, // sender address
      to: user.email, // list of receivers
      subject: `Email confirmation`,
      html: template(
        user.username,
        `${process.env.CLIENT}/confirm/${randomValue}`
      ),
    });

    return info;
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = sendMail;
