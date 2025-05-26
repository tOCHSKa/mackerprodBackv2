const { connectToDb } = require('../db.js');
const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');

function videoRoutes() {
  const router = express.Router();

  router.get('/getAll', authMiddleware, async (req, res) => {
    const db = await connectToDb();
    if (!db) return res.status(500).send('Database connection error');
    if (req.user.role !== 'admin') return res.status(403).send('Forbidden');
  
    try {
      const [rows] = await db.query('SELECT * FROM Video');
  
      // Ajout de la propriété "miniature" à chaque vidéo
      const videosWithMiniature = rows.map(video => {
        // Extraire l'ID de la vidéo YouTube
        const match = video.chemin_lien.match(/embed\/([^/?]+)/);
        const videoId = match ? match[1] : null;
  
        return {
          ...video,
          miniature: videoId
        };
      });
  
      res.json(videosWithMiniature);
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).send('Error fetching videos');
    }
  });

  router.post('/add', authMiddleware, async (req, res) => {
    const db = await connectToDb();
    if (!db) return res.status(500).send('Database connection error');
    if(req.user.role !== 'admin') return res.status(403).send('Forbidden');
    const { titre, chemin_lien, description, theme } = req.body;
    if (!titre || !chemin_lien || !description || !theme) {
      return res.status(400).send({ message: 'Champs requis manquants' });
    }
    try {
      const [result] = await db.query(
        'INSERT INTO video (titre, chemin_lien, description, theme, id_admin) VALUES (?, ?, ?, ?, ?)',
        [titre, chemin_lien, description, theme, 1]
      );
      res.status(201).send({
        message: 'Vidéo créée',
        id: result.insertId
      });
    } catch (error) {
      console.error('Error inserting video:', error);
      res.status(500).send('Error creating video');
    }
  });

  router.put('/:id', authMiddleware, async (req, res) => {
    const db = await connectToDb();
    if (!db) return res.status(500).send('Database connection error');
    if(req.user.role !== 'admin') return res.status(403).send('Forbidden');
    const { id } = req.params;
    const { titre, chemin_lien, description } = req.body;
    try {
      const [result] = await db.query(
        'UPDATE video SET titre = ?, chemin_lien = ?, description = ? WHERE id_video = ?',
        [titre, chemin_lien, description, id]
      );
      res.send({
        message: 'Vidéo mise à jour',
        id: result.insertId
      });
    } catch (error) {
      console.error('Error updating video:', error);
      res.status(500).send('Error updating video');
    }
  });

  router.delete('/:id', authMiddleware, async (req, res) => {
    const db = await connectToDb();
    if (!db) return res.status(500).send('Database connection error');
    if(req.user.role !== 'admin') return res.status(403).send('Forbidden');
    const { id } = req.params;
    try {
      const [result] = await db.query('DELETE FROM video WHERE id_video = ?', [id]);
      res.send({
        message: 'Vidéo supprimée',
        id: result.insertId
      });
    } catch (error) {
      console.error('Error deleting video:', error);
      res.status(500).send('Error deleting video');
    }
  });

  return router;
}

module.exports = { videoRoutes };
