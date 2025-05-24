// 📦 Importation des bibliothèques nécessaires
const { connectToDb } = require('../db.js'); // Fonction pour se connecter à la base de données
const express = require('express');          // Framework pour créer une API
const validator = require('validator');      // Librairie pour valider des données (comme les emails)
const bcrypt = require('bcrypt');            // Librairie pour sécuriser les mots de passe
const { authMiddleware } = require('../middleware/authMiddleware.js'); // Middleware pour vérifier l'authentification
const jwt = require('jsonwebtoken');         // Librairie pour créer des jetons de connexion (JWT)

// 📁 Fonction qui définit les routes pour les administrateurs
function adminRoutes() {
    const router = express.Router(); // On crée un "routeur" pour gérer les différentes routes (URLs)

    // 🔵 ROUTE : Obtenir tous les utilisateurs (admins)
    router.get('/all', authMiddleware, async (req, res) => {
        // Vérifie que l'utilisateur est un admin
        if (req.user.role !== 'admin') return res.status(403).send('Forbidden'); // Interdit si non-admin

        const db = await connectToDb(); // On se connecte à la base de données
        if (!db) {
            return res.status(500).send('Erreur de connexion à la base de données');
        }

        try {
            const [rows] = await db.query('SELECT * FROM Admin'); // Requête SQL pour récupérer tous les admins
            res.json(rows); // Renvoie les résultats en format JSON
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
            res.status(500).send('Erreur lors de la récupération des utilisateurs');
        }
    });

    // 🟢 ROUTE : Connexion (login) d'un utilisateur admin
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
            // On cherche un utilisateur admin avec cet email
            const [users] = await db.query('SELECT role, email, password FROM Admin WHERE email = ?', [email]);

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

    // 🟢 ROUTE : Enregistrement (création) d’un nouvel admin
    router.post('/register', async (req, res) => {
        const db = await connectToDb(); // Connexion à la base de données

        if (!db) {
            return res.status(500).send('Erreur de connexion à la base de données');
        }

        const { email, password, confirmedpassword, role } = req.body;

        // Vérifie que tous les champs sont bien présents
        const champsManquants = ['email', 'password', 'confirmedpassword', 'role'].filter(champ => !req.body[champ]);
        if (champsManquants.length > 0) {
            return res.status(400).json({ message: `Les champs suivants sont manquants : ${champsManquants.join(', ')}` });
        }

        // Vérifie que les champs sont bien des chaînes de texte
        if (typeof email !== 'string' || typeof password !== 'string' || typeof confirmedpassword !== 'string') {
            return res.status(400).json({ message: "Tous les champs doivent être des chaînes de caractères." });
        }

        // Vérifie que le mot de passe et sa confirmation sont identiques
        if (password !== confirmedpassword) {
            return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
        }

        // Vérifie que l'email est valide
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Le format de l'email est invalide." });
        }

        // Vérifie que le mot de passe est suffisamment long
        if (!validator.isLength(password, { min: 10 })) {
            return res.status(400).json({ message: "Le mot de passe doit contenir au moins 10 caractères." });
        }

        // Vérifie la complexité du mot de passe
        const hasUpperCase = /[A-Z]/.test(password);         // Contient une majuscule
        const hasLowerCase = /[a-z]/.test(password);         // Contient une minuscule
        const hasNumber = /\d/.test(password);               // Contient un chiffre
        const hasSpecialChar = /[^\w\s]/.test(password);     // Contient un caractère spécial

        if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
            return res.status(400).json({ message: "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial." });
        }

        try {
            // Vérifie que l’email n’est pas déjà utilisé
            const [users] = await db.query('SELECT id_admin FROM Admin WHERE email = ?', [email]);

            if (Array.isArray(users) && users.length > 0) {
                return res.status(400).json({ message: "Cet email est déjà utilisé." });
            }

            // Chiffre (hash) le mot de passe avant de le stocker pour plus de sécurité
            const hashedpassword = await bcrypt.hash(password, 10);

            // Enregistre le nouvel admin dans la base de données
            await db.query('INSERT INTO Admin (email, password, role) VALUES (?, ?, ?)', [email, hashedpassword, role]);

            res.status(201).json({ message: 'Admin créé avec succès.' });
        } catch (error) {
            console.error('Erreur lors de la création de l\'admin:', error);
            res.status(500).send('Erreur interne du serveur.');
        }
    });

    return router; // Retourne toutes les routes définies
}

// Exporte les routes pour qu'elles puissent être utilisées ailleurs dans l'application
module.exports = { adminRoutes };
