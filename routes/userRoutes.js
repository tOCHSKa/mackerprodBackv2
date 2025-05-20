// 📦 Importation des bibliothèques nécessaires
const { connectToDb } = require('../db.js'); // Fonction pour se connecter à la base de données
const express = require('express');          // Framework pour créer une API
const validator = require('validator');      // Librairie pour valider des données (comme les emails)
const bcrypt = require('bcrypt');            // Librairie pour sécuriser les mots de passe
const { authMiddleware } = require('../middleware/authMiddleware.js'); // Middleware pour vérifier l'authentification
const jwt = require('jsonwebtoken');         // Librairie pour créer des jetons de connexion (JWT)

// 📁 Fonction qui définit les routes pour les utilisateur
function utilisateurRoutes() {
    const router = express.Router(); // On crée un "routeur" pour gérer les différentes routes (URLs)

    // 🟢 ROUTE : Connexion (login) d'un utilisateur 
    router.post('/login', async (req, res) => {
        const db = await connectToDb(); // Connexion à la base

        if (!db) {
            return res.status(500).send('Erreur de connexion à la base de données');
        }

        const { email, password } = req.body; // On récupère les données envoyées par l'utilisateur

        // Vérifie que les champs sont bien remplis
        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe sont obligatoires.' });
        }

        // Vérifie que les champs sont des textes (chaînes de caractères)
        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({ message: "Les champs doivent être des chaînes de caractères." });
        }

        try {
            // On cherche un utilisateur avec cet email
            const [users] = await db.query('SELECT role, email, password FROM utilisateur WHERE email = ?', [email]);

            if (!Array.isArray(users) || users.length === 0) {
                // Aucun utilisateur trouvé
                return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
            }

            const user = users[0];

            // Vérifie que le mot de passe correspond
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
            }

            // Crée un token (clé de connexion temporaire)
            const token = jwt.sign(
                { role: user.role, email: user.email }, 
                process.env.JWT_SECRET, // Clé secrète stockée dans les variables d’environnement
                { expiresIn: '2h' } // Le token est valide pendant 2 heures
            );

            // Envoie le token au client
            res.status(200).json({
                message: 'Connexion réussie.',
                token
            });
        } catch (error) {
            console.error('Erreur lors de la connexion:', error);
            res.status(500).send('Erreur interne du serveur.');
        }
    });
    return router; // Retourne toutes les routes définies
}

// Exporte les routes pour qu'elles puissent être utilisées ailleurs dans l'application
module.exports = { utilisateurRoutes };
