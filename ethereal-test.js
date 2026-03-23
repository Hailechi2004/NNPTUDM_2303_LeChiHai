/**
 * Test với Ethereal (Email test miễn phí - không cần credentials)
 */

const nodemailer = require("nodemailer");

async function testEmail() {
  // Tạo transporter Ethereal (test email miễn phí)
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  // Gửi email test
  let info = await transporter.sendMail({
    from: "admin@test.com",
    to: "test@example.com",
    subject: "Tai khoan moi",
    html:
      "<h3>Tai khoan cua ban da duoc tao</h3>" +
      "<p>Username: <b>user01</b></p>" +
      "<p>Password: <b>password123abc</b></p>" +
      "<p>Vui long dang nhap va doi mat khau.</p>",
  });

  console.log("✅ Email sent!");
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

testEmail().catch(console.error);
