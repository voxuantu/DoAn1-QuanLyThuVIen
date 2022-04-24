const nodemailer = require('nodemailer');

module.exports = (email, subject, amp) => {
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
        text : "",
        html : amp,
        
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}