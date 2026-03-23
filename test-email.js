/**
 * Email Test Script - Test Mailtrap Integration
 * Chạy: node test-email.js
 */

require("dotenv").config();
const { sendMail, sendAccountMail } = require("./utils/mailHandler");

console.log("🧪 Email Testing Script\n");
console.log("📧 SMTP Configuration:");
console.log(`   Host: ${process.env.SMTP_HOST}`);
console.log(`   Port: ${process.env.SMTP_PORT}`);
console.log(`   User: ${process.env.SMTP_USER}`);
console.log("");

// Test 1: Test account creation email
async function testAccountEmail() {
  try {
    console.log("📨 Test 1: Sending Account Creation Email...");
    await sendAccountMail(
      "your-mailtrap-inbox@sink.mailtrap.io", // Replace with your Mailtrap test email
      "user01",
      "password123abc",
    );
    console.log("✅ Email gửi thành công!\n");
  } catch (error) {
    console.error("❌ Lỗi:", error.message, "\n");
  }
}

// Test 2: Test reset password email
async function testResetEmail() {
  try {
    console.log("📨 Test 2: Sending Password Reset Email...");
    await sendMail(
      "your-mailtrap-inbox@sink.mailtrap.io", // Replace with your Mailtrap test email
      "http://localhost:3000/auth/resetpassword/abc123def456",
    );
    console.log("✅ Email gửi thành công!\n");
  } catch (error) {
    console.error("❌ Lỗi:", error.message, "\n");
  }
}

// Run tests
async function runTests() {
  console.log("=".repeat(50));
  await testAccountEmail();
  await testResetEmail();
  console.log("=".repeat(50));
  console.log("✨ Test hoàn thành!\n");
  console.log("📝 Kiểm tra email tại: https://mailtrap.io/inboxes\n");
}

runTests().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
