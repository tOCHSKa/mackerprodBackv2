const nodemailer = require("nodemailer");
require('dotenv').config();

// Configuration du transporteur SMTP pour Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,     // Votre adresse Gmail
        pass: process.env.GMAIL_APP_PASSWORD  // Votre mot de passe d'application
    }
});

// Test d'envoi d'email
// (async () => {
//     try {
//         const info = await transporter.sendMail({
//             from: "toch59200@gmail.com", // adresse de l'expéditeur
//             to: "toch59200@gmail.com", // adresse du destinataire
//             subject: "Test Email ✔", // Sujet
//             text: "Si vous voyez cet email, le test est réussi!", // version texte
//             html: "<b>Si vous voyez cet email, le test est réussi!</b>" // version HTML
//         });

//         console.log("Message envoyé: %s", info.messageId);
//     } catch (err) {
//         console.error("Erreur lors de l'envoi de l'email:", err);
//     }
// })();

const sendMail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: "toch59200@gmail.com", // adresse de l'expéditeur
            to: to, // adresse du destinataire
            subject: subject, // Sujet
            text: text, // version texte
            html: html // version HTML
        });

        console.log("Message envoyé: %s", info.messageId);
    } catch (err) {
        console.error("Erreur lors de l'envoi de l'email:", err);
    }
}

// Vérification de la configuration
transporter.verify().then(() => {
    console.log("Serveur prêt pour l'envoi d'emails");
}).catch((err) => {
    console.error("Erreur de configuration du serveur mail:", err);
});

module.exports = {
    transporter,
    sendMail
};