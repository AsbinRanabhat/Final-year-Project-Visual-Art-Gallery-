const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    const emailUser = String(process.env.EMAIL_USER || "").trim();
    const emailPass = String(process.env.EMAIL_PASS || "").replace(/\s+/g, "").trim();

    if (!emailUser || !emailPass) {
        throw new Error("Missing EMAIL_USER or EMAIL_PASS in environment.");
    }

    // 1. Create a transporter
    const transporter = nodemailer.createTransport({
        service: String(process.env.EMAIL_SERVICE || "gmail").trim() || "gmail",
        auth: {
            user: emailUser, // Your email address
            pass: emailPass, // Gmail App Password (or provider password)
        },
    });

    // 2. Define email options
    const mailOptions = {
        from: `Visual Art Gallery <${emailUser}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: `<b>${options.message}</b>` // You can use HTML for better looks
    };

    // 3. Send the email
    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (err) {
        // Let caller decide how to handle
        console.error(
            "Nodemailer send failed:",
            err?.response || err?.message || err
        );
        throw err;
    }
};

module.exports = sendEmail;
