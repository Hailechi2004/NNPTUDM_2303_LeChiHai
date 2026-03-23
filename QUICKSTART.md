# ⚡ Quick Start Guide - Gửi Email tạo tài khoản

Hướng dẫn này giúp bạn tái tạo lại kết quả như trong hình ảnh (gửi email "Tài khoản mới").

---

## 🔧 Bước 1: Chuẩn bị môi trường

### 1.1. Cài dependencies

```bash
npm install
```

### 1.2. Cấu hình MongoDB local

1. Download MongoDB Community: https://www.mongodb.com/try/download/community
2. Cài đặt và khởi động MongoDB
3. Mở terminal và kiểm tra:

```bash
mongosh
```

### 1.3. Cấu hình email service

**Option A: Dùng MailHop Local (Recommended)**

1. Download MailHop: https://mailtrap.io/
2. Chạy MailHop trên máy (nó sẽ chạy ở localhost:1025)
3. File `.env` đã sẵn cấu hình cho MailHop

**Option B: Dùng Gmail**

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password  # (Tạo app password trong Google Account)
```

**Option C: Dùng Mailtrap.io (Cloud)**

```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_SECURE=false
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass
```

---

## ▶️ Bước 2: Khởi động ứng dụng

```bash
npm start
```

✅ Bạn sẽ thấy: `da connect` (MongoDB connected)

---

## 📧 Bước 3: Tạo dữ liệu role mặc định

Mở MongoDB Compass hoặc terminal mongosh:

```javascript
// Kết nối database
use nnptud-s2

// Tạo role "user"
db.roles.insertOne({
  name: "user",
  isDeleted: false
})

// Lấy ID của role (sẽ dùng sau)
db.roles.findOne({ name: "user" })
// Result: { _id: ObjectId("..."), name: "user", isDeleted: false }
```

Lưu lại `_id` của role này!

---

## 📊 Bước 4: Chuẩn bị file Excel

Tạo file Excel với 2 cột:

| username | email             |
| -------- | ----------------- |
| user01   | user01@github.com |
| user02   | user02@github.com |
| user03   | user03@github.com |

Lưu file dưới dạng `.xlsx` (ví dụ: `users.xlsx`)

---

## 🚀 Bước 5: Upload file và gửi email

### Cách 1: Dùng Postman

1. Import file `postman-collection.json` vào Postman
2. Chọn request: **Upload → Upload Excel Users**
3. Chọn file Excel vừa tạo
4. Click **Send**

**Response (Thành công):**

```json
[
  {
    "row": 2,
    "status": "success",
    "userCreated": true,
    "mailSent": true,
    "user": {
      "username": "user01",
      "email": "user01@github.com",
      "role": "user"
    }
  },
  ...
]
```

### Cách 2: Dùng curl

```bash
curl -X POST http://localhost:3000/upload/excel/v2 \
  -F "file=@users.xlsx"
```

### Cách 3: Dùng JavaScript fetch

```javascript
const formData = new FormData();
formData.append("file", document.getElementById("fileInput").files[0]);

fetch("http://localhost:3000/upload/excel/v2", {
  method: "POST",
  body: formData,
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

---

## ✅ Bước 6: Kiểm tra Email

### Nếu dùng MailHop:

1. Mở MailHop UI (thường là http://localhost:1080)
2. Xem các email đã gửi
3. Bạn sẽ thấy email với tiêu đề: **"Tai khoan moi"** (Tài khoản mới)

### Nếu dùng Gmail/Mailtrap:

1. Kiểm tra inbox của email SMTP_USER

---

## 📝 Nội dung Email gửi đi

**Subject:** Tai khoan moi  
**From:** admin@heha.com  
**To:** user01@github.com

**HTML Content:**

```html
<h3>Tai khoan cua ban da duoc tao</h3>
<p>Username: <b>user01</b></p>
<p>Password: <b>a1b2c3d4e5f6g7h8</b></p>
<p>Vui long dang nhap va doi mat khau.</p>
```

---

## 🐛 Troubleshooting

| Lỗi                                 | Giải pháp                                   |
| ----------------------------------- | ------------------------------------------- |
| `Cannot send mail`                  | Kiểm tra SMTP settings trong `.env`         |
| `ECONNREFUSED localhost:1025`       | MailHop không chạy, khởi động lại           |
| `Khong tim thay role mac dinh user` | Bạn chưa tạo role trong MongoDB             |
| `email bi trung`                    | Email này đã tồn tại, dùng email khác       |
| `username bi trung`                 | Username này đã tồn tại, dùng username khác |

---

## 💡 Tips

- Mỗi lần chạy, password được tạo ngẫu nhiên: `crypto.randomBytes(8).toString('hex')`
- Email được hash trước khi lưu vào database
- Bạn có thể xem logs của ứng dụng trong console để debug
- Nếu muốn thay đổi nội dung email, sửa file: `utils/mailHandler.js`

---

## 🎉 Hoàn tất!

Bây giờ bạn có thể:
✅ Tạo tài khoản từ file Excel  
✅ Gửi email tự động tới người dùng  
✅ Theo dõi kết quả upload  
✅ Xem email trong MailHop/Gmail/Mailtrap

Enjoy! 🚀
