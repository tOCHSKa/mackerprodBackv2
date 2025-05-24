const { connectToDb } = require('../db.js');
const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { sendMail } = require('../utils/sendMail.js');
function messageRoutes() {
    const router = express.Router();

    // 🔵 READ - Obtenir tous les messages
   router.get('/', authMiddleware, async (req, res) => {
    try {
        const db = await connectToDb(); // Connexion à la BDD
        if(req.user.role !== 'admin') return res.status(403).send('Forbidden');
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
                [nom_expediteur, email_expediteur, numero_telephone, message, date_envoi, 1]
            );
            const subject = 'Votre demande a bien été enregistrée';
            const text = `Bonjour ${nom_expediteur},

                        Je vous remercie pour votre message.
                        
                        Je l’ai bien reçu et ne manquerai pas de vous répondre dans les plus brefs délais.
                        
                        Cordialement,  
                        Macker  
                        Vidéaste professionnel`;
                        const html = `
                        <div style="
                          font-family: 'Montserrat', Arial, sans-serif;
                          color: #1a2026;
                          font-size: 16px;
                          line-height: 1.5;
                          padding: 20px;
                          background-color: #f9f9f9;
                          border-radius: 8px;
                          max-width: 600px;
                          margin: auto;
                        ">
                            <div style="text-align: center; margin-bottom: 30px;">
                                <img src="https://www.mackerprod.com/img/mackerprod.3afd6702.png" alt="Logo MackerProd" style="max-width: 150px; height: auto;">
                            </div>
                          <p style="margin-bottom: 20px;">Bonjour <span style="font-weight: bold; color: #1a2026;">${nom_expediteur}</span>,</p>
                          <p style="margin-bottom: 20px;">
                            Je vous remercie pour votre message.<br>
                            Je l’ai bien reçu et ne manquerai pas de vous répondre dans les plus brefs délais.
                          </p>
                          <p style="margin-top: 40px; border-top: 1px solid #ddd; padding-top: 20px; font-size: 14px; color: #555;">
                            Cordialement,
                          </p>
                          <p style="margin: 0; font-weight: bold; font-size: 18px; color: #941e20;">Macker<span style="color: #1a2026;">Prod</span></p>
                          <p style="margin: 0; font-style: italic; color: #1a2026;">Vidéaste professionnel</p>
                        </div>
                      `;
                      
            sendMail(email_expediteur, subject, text, html);
            res.status(201).send('Message créé');
        } catch (error) {
            console.error('Error inserting message:', error);
            res.status(500).send('Error creating message');
        }
    });

    router.get('/count', authMiddleware, async (req, res) => {
      const db = await connectToDb();
      if (!db) return res.status(500).send('Database connection error');
      if(req.user.role !== 'admin') return res.status(403).send('Forbidden');
      try {
          const [rows] = await db.query('SELECT COUNT(*) as count FROM message');
          res.status(200).json({
              count: rows[0].count
          });
      } catch (error) {
          console.error('Erreur lors de la requête :', error);
          res.status(500).send('Erreur serveur');
      }
    });
    return router;
  }

module.exports = { messageRoutes }
