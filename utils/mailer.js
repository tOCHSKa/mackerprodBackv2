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


// Vérification de la configuration
transporter.verify().then(() => {
    console.log("✅ Serveur prêt pour l'envoi d'emails");
}).catch((err) => {
    console.error("Erreur de configuration du serveur mail:", err);
});

module.exports = {
    transporter
};