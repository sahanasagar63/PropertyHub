import nodemailer from "nodemailer";

export const sendAdminEmail = async ({ subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"PropertyHub Alerts" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject,
    html,
  });
};