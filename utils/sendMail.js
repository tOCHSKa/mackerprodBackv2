const { transporter } = require('./mailer');

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

module.exports = {
    sendMail
};
