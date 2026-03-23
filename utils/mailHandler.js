const nodemailer = require("nodemailer");
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

module.exports = {
    sendMail: async function (to, url) {
        await transporter.sendMail({
            from: 'admin@heha.com',
            to: to,
            subject: "Reset Password email",
            text: "click vao day de reset password",
            html: "click vao <a href=" + url + ">day</a> de reset password",
        });
    },

    sendAccountMail: async function (to, username, password) {
        await transporter.sendMail({
            from: 'admin@heha.com',
            to: to,
            subject: 'Tai khoan moi',
            text:
                'Tai khoan cua ban da duoc tao.\n' +
                'Username: ' + username + '\n' +
                'Password: ' + password + '\n' +
                'Vui long dang nhap va doi mat khau.',
            html:
                '<h3>Tai khoan cua ban da duoc tao</h3>' +
                '<p>Username: <b>' + username + '</b></p>' +
                '<p>Password: <b>' + password + '</b></p>' +
                '<p>Vui long dang nhap va doi mat khau.</p>',
        });
    }
}