
import { connectToDb } from '../db.js';
import express from 'express';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import bcrypt from 'bcrypt';


function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    
  if (!token) {
    return res.status(401).json({ message: 'Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next(); // Passe à la suite
  } catch (err) {
    console.error('Erreur de vérification du token:', err);
    return res.status(403).json({ message: 'Token non valide ou expiré' });
  }
}

export function userRoutes() {
    const router = express.Router()
  // 🔵 READ - Obtenir toutes les vidéos
  router.get('/', authMiddleware, async (req, res) => {

    const db = await connectToDb(); // Connexion à la BDD

    if (!db) {
      return res.status(500).send('Database connection error');
    }

    try {
      const [rows] = await db.query('SELECT * FROM users');
      res.json(rows);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).send('Error fetching users');
    }
  });

  // 🟢 CREATE - Login user
  router.post('/login', async (req, res) => {
    const db = await connectToDb(); // Connexion BDD
  
    if (!db) {
      return res.status(500).send('Database connection error');
    }
  
    const { email, password } = req.body;
  
    // 🔵 Vérification des champs obligatoires
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe sont obligatoires.' });
    }
  
    // 🔵 Vérification du type
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: "Les champs doivent être des chaînes de caractères." });
    }
  
    try {
      // 🔵 Récupération de l'utilisateur
      const [users] = await db.query('SELECT role, email, password FROM users WHERE email = ?', [email]);

      if (!Array.isArray(users) || users.length === 0) {
        return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
      }
  
      const user = users[0];
  
      // 🔵 Comparaison du mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });
      }
  
      // 🔵 Génération du token JWT
      const token = jwt.sign(
        { role: user.role, email: user.email }, 
        process.env.JWT_SECRET, 
        { expiresIn: '2h' } // Token valide 2 heures
      );
  
      // 🔵 Envoi du token au client
      res.status(200).json({
        message: 'Connexion réussie.',
        token
      });
      
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      res.status(500).send('Erreur interne du serveur.');
    }
  });

  // 🟢 CREATE - Ajouter un user
  router.post('/register', async (req, res) => {
    const db = await connectToDb(); // Connexion à la BDD

    if (!db) {
      return res.status(500).send('Database connection error');
    }

    const { email, password, confirmedpassword } = req.body;

    // 🔵 Vérification des champs requis
    const champsManquants = ['email', 'password', 'confirmedpassword'].filter(champ => !req.body[champ]);
    if (champsManquants.length > 0) {
      return res.status(400).json({ message: `Les champs suivants sont manquants : ${champsManquants.join(', ')}` });
    }

    // 🔵 Vérification des types de données
    if (typeof email !== 'string' || typeof password !== 'string' || typeof confirmedpassword !== 'string') {
      return res.status(400).json({ message: "Tous les champs doivent être des chaînes de caractères." });
    }

    // 🔵 Vérification mot de passe = confirmation
    if (password !== confirmedpassword) {
      return res.status(400).json({ message: "Les mots de passe ne correspondent pas." });
    }

    // 🔵 Vérifications du format email et de la solidité du mot de passe
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Le format de l'email est invalide." });
    }
    if (!validator.isLength(password, { min: 10 })) {
      return res.status(400).json({ message: "Le mot de passe doit contenir au moins 10 caractères." });
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[^\w\s]/.test(password);

    if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
      return res.status(400).json({ message: "Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial." });
    }

    try {
      // 🔵 Vérification de l'unicité de l'email
      const [users] = await db.query('SELECT id FROM users WHERE email = ?', [email]);

      if (Array.isArray(users) && users.length > 0) {
        return res.status(400).json({ message: "Cet email est déjà pris." });
      }

      // 🔵 Hash du mot de passe
      const hashedpassword = await bcrypt.hash(password, 10);

      // 🔵 Insertion en base
      await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedpassword]);

      res.status(201).json({ message: 'Utilisateur créé avec succès.' });

    } catch (error) {
      console.error('Erreur lors de la création de l\'utilisateur:', error);
      res.status(500).send('Erreur interne du serveur.');
    }
  });

  return router;
}
