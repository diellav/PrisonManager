const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendResetEmail = async (to, resetLink) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Reset Your Password',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 hour.</p>`,
    });
    console.log(`Reset email sent to ${to}`);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};


const sendVisitRequestConfirmation = async (to, fullName) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Visit Request Received',
      html: `<p>Dear ${fullName},<br>Your visit request has been received. You will be notified once it is approved.</p>`,
    });
    console.log(`Visit request confirmation sent to ${to}`);
  } catch (error) {
    console.error('Error sending visit request email:', error);
    throw error;
  }
};

const sendVisitApprovedEmail = async (to, fullName, prisonerName, visitDate) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Visit Request Approved',
      html: `<p>Dear ${fullName},<br>Your visit request to see ${prisonerName} on ${visitDate} has been <b>approved</b>.</p>`,
    });
    console.log(`Approval email sent to ${to}`);
  } catch (error) {
    console.error('Error sending approval email:', error);
    throw error;
  }
};

const sendVisitRejectedEmail = async (to, fullName, prisonerName, visitDate) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject: 'Visit Request Rejected',
      html: `<p>Dear ${fullName},<br>Your visit request to see ${prisonerName} on ${visitDate} has been <b>rejected</b>.</p>`,
    });
    console.log(`Rejection email sent to ${to}`);
  } catch (error) {
    console.error('Error sending rejection email:', error);
    throw error;
  }
};

module.exports = {sendResetEmail,
                  sendVisitRequestConfirmation,
                  sendVisitApprovedEmail,
                  sendVisitRejectedEmail,
    };
