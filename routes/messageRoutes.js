const { connectToDb } = require('../db.js');
const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { sendMail } = require('../utils/mailer.js');
function messageRoutes() {
    const router = express.Router();

    // 🔵 READ - Obtenir tous les messages
   router.get('/', authMiddleware, async (req, res) => {
    try {
        const db = await connectToDb(); // Connexion à la BDD

        if (!db) {
            return res.status(500).send('Database connection error');
        }
        // Requête d'insertion correcte (avec les bonnes parenthèses et quotes)
        const [messages] = await db.query
        ('SELECT * FROM message',);

        res.status(200).json({
            messages
        });

    } catch (error) {
        console.error('Erreur lors de la requête :', error);
        res.status(500).send('Erreur serveur');
    }
});
    router.post('/add', async (req, res) => {
        const db = await connectToDb();
        if (!db) return res.status(500).send('Database connection error');
        const { nom_expediteur, email_expediteur, numero_telephone, message, date_envoi } = req.body;
        try {
            await db.query(
                'INSERT INTO message (nom_expediteur, email_expediteur, numero_telephone, message, date_envoi, id_admin) VALUES (?, ?, ?, ?, ?, ?)',
                [nom_expediteur, email_expediteur, numero_telephone, message, date_envoi, 0]
            );
            const subject = 'Votre demande a bien été enregistrée';
            const text = 'Nous avons bien recu votre message Mr/Mme ' + nom_expediteur + ' et vous remerci de votre demande';
            const html = '<p>Nous avons bien recu votre message Mr/Mme ' + nom_expediteur + ' et vous remerci de votre demande</p>';
            sendMail(email_expediteur, subject, text, html);
            res.status(201).send('Message créé');
        } catch (error) {
            console.error('Error inserting message:', error);
            res.status(500).send('Error creating message');
        }
    });
    return router;
  }
// Exporter correctement la fonction `message`
module.exports = { messageRoutes }
