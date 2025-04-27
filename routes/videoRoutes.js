
import { connectToDb } from '../db.js';
import express from 'express';
import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

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

export function videoRoutes() {
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
      console.error('Error fetching videos:', error);
      res.status(500).send('Error fetching videos');
    }
  });

  // 🟢 CREATE - Ajouter une vidéo
  router.post('/', async (req, res) => {
    const db = await connectToDb(); // Connexion à la BDD

    if (!db) {
      return res.status(500).send('Database connection error');
    }

    const { title, url, thumbnail, visible } = req.body;
    try {
      await db.query(
        'INSERT INTO videos (title, url, thumbnail, visible) VALUES (?, ?, ?, ?)',
        [title, url, thumbnail, visible ?? true]
      );
      res.status(201).send('Vidéo créée');
    } catch (error) {
      console.error('Error inserting video:', error);
      res.status(500).send('Error creating video');
    }
  });

  // 🟡 UPDATE - Modifier une vidéo
  router.put('/:id', async (req, res) => {
    const db = await connectToDb(); // Connexion à la BDD

    if (!db) {
      return res.status(500).send('Database connection error');
    }

    const { id } = req.params;
    const { title, url, thumbnail, visible } = req.body;
    try {
      await db.query(
        'UPDATE videos SET title = ?, url = ?, thumbnail = ?, visible = ? WHERE id = ?',
        [title, url, thumbnail, visible, id]
      );
      res.send('Vidéo mise à jour');
    } catch (error) {
      console.error('Error updating video:', error);
      res.status(500).send('Error updating video');
    }
  });

  // 🔴 DELETE - Supprimer une vidéo
  router.delete('/:id', async (req, res) => {
    const db = await connectToDb(); // Connexion à la BDD

    if (!db) {
      return res.status(500).send('Database connection error');
    }

    const { id } = req.params;
    try {
      await db.query('DELETE FROM videos WHERE id = ?', [id]);
      res.send('Vidéo supprimée');
    } catch (error) {
      console.error('Error deleting video:', error);
      res.status(500).send('Error deleting video');
    }
  });

  return router;
}
