const { connectToDb } = require('../db.js');
const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');

function videoRoutes() {
  const router = express.Router();

  router.get('/', authMiddleware, async (req, res) => {
    const db = await connectToDb();
    if (!db) return res.status(500).send('Database connection error');
    if(req.user.role !== 'admin') return res.status(403).send('Forbidden');
    try {
      const [rows] = await db.query('SELECT * FROM Video');
      res.json(rows);
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).send('Error fetching videos');
    }
  });

  router.post('/add', authMiddleware, async (req, res) => {
    const db = await connectToDb();
    if (!db) return res.status(500).send('Database connection error');
    if(req.user.role !== 'admin') return res.status(403).send('Forbidden');
    const { titre, chemin_lien, description } = req.body;
    try {
      await db.query(
        'INSERT INTO video (titre, chemin_lien, description) VALUES (?, ?, ?)',
        [titre, chemin_lien, description]
      );
      res.status(201).send('Vidéo créée');
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
      await db.query(
        'UPDATE video SET titre = ?, chemin_lien = ?, description = ? WHERE id_video = ?',
        [titre, chemin_lien, description, id]
      );
      res.send('Vidéo mise à jour');
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
      await db.query('DELETE FROM video WHERE id_video = ?', [id]);
      res.send('Vidéo supprimée');
    } catch (error) {
      console.error('Error deleting video:', error);
      res.status(500).send('Error deleting video');
    }
  });

  return router;
}

module.exports = { videoRoutes };
