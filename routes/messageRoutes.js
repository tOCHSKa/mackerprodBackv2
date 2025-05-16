const { connectToDb } = require('../db.js');
const express = require('express');-


function messageRoutes() {
    const router = express.Router();

    // 🔵 READ - Obtenir tous les messages
   router.get('/', async (req, res) => {
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
    // // 🟢 CREATE - Ajouter un message
    // router.post('/register', async (req, res) => {
    //   try {
    //      const db = await connectToDb(); // Connexion à la BDD

    //     if (!db) {
    //         return res.status(500).send('Database connection error');
    //     }

    //     const { email_expediteur, nom_expediteur, date_envoi } = req.body;

    //     if(!email_expediteur || !nom_expediteur, !date_envoi) {
    //       return res.status(400).json ({ message: 'champs requis manquants'});
    //     }

    //     await db.query (
    //       'INSERT INTO message (email_expediteur, nom_expediteur, date_envoi) VALUES ( ?, ?, ?)',
    //       [email_expediteur, nom_expediteur, date_envoi]
    //     );

    //     const [rows] = await db.query('SELECT * FROM message');
    //     res.status(201).json({
    //       message: 'Message crée avec succés',
    //       messages: rows
    //     });
    //   } catch (error) {
    //     console.error('Erreur lors de la requête :', error);
    //     res.status(500).send('Erreur serveur');
    //   }
    // });
    return router;
  }
// Exporter correctement la fonction `message`
module.exports = { messageRoutes }
