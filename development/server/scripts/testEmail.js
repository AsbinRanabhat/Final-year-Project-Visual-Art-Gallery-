require("dotenv").config();

const sendEmail = require("../services/nodeMailer");

const recipient = process.argv[2] || process.env.EMAIL_USER;

if (!recipient) {
    console.error("Usage: node scripts/testEmail.js <toEmail>");
    process.exit(1);
}

sendEmail({
    email: recipient,
    subject: "Visual Art Gallery SMTP Test",
    message:
        "If you received this message, your SMTP email configuration is working.",
})
    .then(() => {
        console.log(`OK: Sent test email to ${recipient}`);
        process.exit(0);
    })
    .catch((error) => {
        console.error("FAIL:", error?.response || error?.message || error);
        process.exit(1);
    });

