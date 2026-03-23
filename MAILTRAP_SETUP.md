# 📧 Hướng dẫn Test Email với Mailtrap

## 🚀 Bước 1: Tạo tài khoản Mailtrap

1. Truy cập: https://mailtrap.io/
2. Đăng ký tài khoản miễn phí
3. Tạo **Inbox** mới
4. Vào **Integrations** → chọn **Nodemailer**

## 🔑 Bước 2: Lấy Credentials

Trong Mailtrap, tab **SMTP Settings**, bạn sẽ thấy:

```
Host: smtp.mailtrap.io
Port: 2525 (hoặc 465/587)
Username: abc123xyz...
Password: def456uvw...
```

## 📝 Bước 3: Cập nhật .env

Mở file `.env` và thay thế:

```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=your_username_from_mailtrap
SMTP_PASS=your_password_from_mailtrap

PORT=3000
```

**Ví dụ thực tế:**

```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=abc123def456@mailtrap.io
SMTP_PASS=xyz789uvw012tqr

PORT=3000
```

## ▶️ Bước 4: Chạy Server

```bash
npm start
```

Bạn sẽ thấy:

```
✅ Server started - Email testing mode
listening on port 3000
```

## 📧 Bước 5: Test Gửi Email

### Cách 1: Dùng Postman

**Request 1: Tài khoản mới**

```
POST http://localhost:3000/test/account-email
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "user01",
  "password": "password123abc"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Email tài khoản được gửi thành công",
  "to": "user@example.com",
  "username": "user01"
}
```

**Request 2: Reset password**

```
POST http://localhost:3000/test/reset-email
Content-Type: application/json

{
  "email": "user@example.com",
  "token": "abc123def456xyz789"
}
```

### Cách 2: Dùng curl

```bash
# Test account email
curl -X POST http://localhost:3000/test/account-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "username": "user01",
    "password": "password123"
  }'

# Test reset email
curl -X POST http://localhost:3000/test/reset-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "token": "abc123def456"
  }'
```

### Cách 3: Dùng Node.js Script

```bash
node test-email.js
```

(Trước tiên, cập nhật file `test-email.js` với email của bạn)

## ✅ Bước 6: Kiểm tra Email trong Mailtrap

1. Mở Mailtrap → **Inbox** của bạn
2. Bạn sẽ thấy email đã nhận:
   - Subject: "Tai khoan moi" (Tài khoản mới)
   - Subject: "Reset Password email" (Reset mật khẩu)
3. Click vào email để xem nội dung chi tiết

## 📸 Email Nhận được

**Email Tài khoản mới:**

```
Tiêu đề: Tai khoan moi
Từ: admin@heha.com
Nội dung:
  Tai khoan cua ban da duoc tao
  Username: user01
  Password: password123abc
  Vui long dang nhap va doi mat khau.
```

**Email Reset Password:**

```
Tiêu đề: Reset Password email
Từ: admin@heha.com
Nội dung:
  click vao <a href="http://localhost:3000/auth/resetpassword/abc123">day</a> de reset password
```

## 🐛 Troubleshooting

| Lỗi                         | Giải pháp                           |
| --------------------------- | ----------------------------------- |
| `Error: Invalid login`      | Kiểm tra SMTP_USER và SMTP_PASS     |
| `ECONNREFUSED`              | Kiểm tra SMTP_HOST và SMTP_PORT     |
| `403 Authentication failed` | Credentials sai, check lại Mailtrap |
| Email không nhận được       | Kiểm tra spam folder                |

## 💡 Tips

- Mỗi inbox test của Mailtrap có email test riêng
- Bạn có thể tạo nhiều inbox để test khác nhau
- Email test của Mailtrap có format: `anything@sink.mailtrap.io`
- Retention policy thường 7 ngày (xoá email cũ)

## 🎯 Tiếp theo

Sau khi test email thành công:

1. ✅ Cấu hình SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
2. ✅ Test 2 endpoints `/test/account-email` và `/test/reset-email`
3. ✅ Xem email trong Mailtrap
4. ✅ Sẵn sàng integrate vào application chính

**Done! 🎉**
