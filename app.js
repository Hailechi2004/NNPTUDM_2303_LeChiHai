var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
// let mongoose = require('mongoose');
require("dotenv").config();

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB disabled - Email testing only
// mongoose.connect(process.env.MONGODB_URI)
// mongoose.connection.on('connected', function () {
//   console.log("da connect");
// })

console.log("✅ Server started - Email testing mode");

// Email Test Routes
const { sendMail, sendAccountMail } = require("./utils/mailHandler");

app.post("/test/account-email", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({
        error: "Thiếu email, username hoặc password",
      });
    }
    await sendAccountMail(email, username, password);
    res.json({
      success: true,
      message: "Email tài khoản được gửi thành công",
      to: email,
      username: username,
    });
  } catch (error) {
    res.status(500).json({
      error: "Lỗi gửi email",
      message: error.message,
    });
  }
});

app.post("/test/reset-email", async (req, res) => {
  try {
    const { email, token } = req.body;
    if (!email || !token) {
      return res.status(400).json({
        error: "Thiếu email hoặc token",
      });
    }
    const resetUrl = `http://localhost:3000/auth/resetpassword/${token}`;
    await sendMail(email, resetUrl);
    res.json({
      success: true,
      message: "Email reset password được gửi thành công",
      to: email,
      resetUrl: resetUrl,
    });
  } catch (error) {
    res.status(500).json({
      error: "Lỗi gửi email",
      message: error.message,
    });
  }
});

//localhost:3000
app.use("/", require("./routes/index"));
//localhost:3000/users
app.use("/users", require("./routes/users"));
app.use("/roles", require("./routes/roles"));
app.use("/auth", require("./routes/auth"));
app.use("/carts", require("./routes/carts"));
app.use("/products", require("./routes/products"));
app.use("/upload", require("./routes/upload"));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  //res.render('error');
  res.send({
    message: err.message,
  });
});

module.exports = app;
