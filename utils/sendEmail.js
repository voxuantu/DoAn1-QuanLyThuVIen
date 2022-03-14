const nodemailer = require('nodemailer');

module.exports = (email, subject, text) => {
    var transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
            user: process.env.USER, // generated ethereal user
            pass: process.env.PASS, // generated ethereal password
        },
    });

    var mailOptions = {
        from: process.env.USER,
        to: email,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            res.json(error);
        } else {
            res.json('Email sent: ' + info.response);
        }
    });
}