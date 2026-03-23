# 🚀 Hướng dẫn cài đặt và chạy ứng dụng

## 📋 Prerequisites (Điều kiện tiên quyết)

1. **Node.js**: Cài đặt từ https://nodejs.org/ (LTS version)
2. **MongoDB**:
   - Option A: Cài đặt MongoDB local từ https://www.mongodb.com/try/download/community
   - Option B: Sử dụng MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas
3. **MailHop** (để test email): https://mailtrap.io/ hoặc localhost

---

## 1️⃣ Cài đặt Dependencies

```bash
npm install
```

---

## 2️⃣ Cấu hình .env file

File `.env` đã được tạo sẵn. Hãy cập nhật thông tin sau:

### Nếu dùng MongoDB Local:

```env
MONGODB_URI=mongodb://localhost:27017/nnptud-s2
```

### Nếu dùng MongoDB Atlas (Cloud):

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/<database-name>?retryWrites=true&w=majority
```

### Cấu hình Email (MailHop hoặc SMTP khác):

```env
# Nếu dùng MailHop Local (localhost):
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=user
SMTP_PASS=pass

# Hoặc nếu dùng Mailtrap.io:
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=your_mailtrap_username
SMTP_PASS=your_mailtrap_password
```

---

## 3️⃣ Khởi động ứng dụng

```bash
npm start
```

Server sẽ chạy tại: **http://localhost:3000**

---

## 4️⃣ Tạo Role mặc định trong Database

Trước khi upload file users, bạn cần tạo role "user" trong MongoDB:

```javascript
db.roles.insertOne({
  name: "user",
  isDeleted: false,
});

// Lấy _id của role để dùng trong /auth/register:
db.roles.findOne({ name: "user" });
```

---

## 📝 API Endpoints chính

### 1. Tạo tài khoản từ file Excel

**POST** `/upload/excel/v2`

- Upload file Excel với 2 cột: username, email
- Hệ thống sẽ tự động tạo password và gửi email

### 2. Đăng nhập

**POST** `/auth/login`

```json
{
  "username": "user01",
  "password": "random_password"
}
```

### 3. Quên mật khẩu

**POST** `/auth/forgotpassword`

```json
{
  "email": "user@example.com"
}
```

### 4. Reset mật khẩu

**POST** `/auth/resetpassword/:token`

```json
{
  "password": "new_password"
}
```

---

## 🐛 Troubleshooting

### Error: "MONGODB_URI is not defined"

→ Kiểm tra file `.env` và restart ứng dụng

### Error: "Cannot send mail"

→ Kiểm tra cấu hình SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS

### Error: "Role not found"

→ Bạn cần tạo role "user" trong MongoDB trước (xem bên trên)

---

## ✅ Kiểm tra setup thành công

1. ✅ Server chạy tại http://localhost:3000
2. ✅ Kết nối MongoDB thành công (xem console: "da connect")
3. ✅ Có thể upload file Excel và tạo users
4. ✅ Email được gửi (xem MailHop/Mailtrap inbox)

---

## 📧 Ví dụ file Excel để upload

| username | email            |
| -------- | ---------------- |
| user01   | user01@gmail.com |
| user02   | user02@gmail.com |
| user03   | user03@gmail.com |

Lưu file dưới dạng `.xlsx` và upload qua API `/upload/excel/v2`
