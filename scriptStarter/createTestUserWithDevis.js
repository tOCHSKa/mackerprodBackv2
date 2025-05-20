const bcrypt = require('bcrypt');
const { connectToDb } = require('../db.js');

async function createTestUserWithDevis() {
  try {
    const db = await connectToDb();
    const { TEST_USER_EMAIL, TEST_USER_PASSWORD } = process.env;

    if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
      console.warn('❌ Les infos du test user ne sont pas définies dans le fichier .env');
      process.exit(1);
    }

    // Vérifie si l'utilisateur existe déjà
    const [existingUsers] = await db.query(
      'SELECT * FROM Utilisateur WHERE email = ?',
      [TEST_USER_EMAIL]
    );

    let userId;

    if (existingUsers.length > 0) {
      console.log('ℹ️ Utilisateur de test déjà existant.');
      userId = existingUsers[0].id_utilisateur;
    } else {
      const hashedPassword = await bcrypt.hash(TEST_USER_PASSWORD, 10);
      const [result] = await db.query(
        'INSERT INTO Utilisateur (email, password, role) VALUES (?, ?, ?)',
        [TEST_USER_EMAIL, hashedPassword, 'user']
      );
      userId = result.insertId;
      console.log('✅ Utilisateur de test créé avec succès !');
    }

    // Crée un devis lié à cet utilisateur
    const [devisRows] = await db.query(
      'SELECT * FROM Devis WHERE id_utilisateur = ?',
      [userId]
    );

    if (devisRows.length === 0) {
      await db.query(
        `INSERT INTO Devis (id_utilisateur, etat_devis, url) VALUES (?, ?, ?)`,
        [userId, 'en_attente', 'https://exemple.com/mon-devis']
      );
      console.log('✅ Devis de test créé et lié à l’utilisateur.');
    } else {
      console.log('ℹ️ Devis de test déjà existant pour cet utilisateur.');
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création du user + devis :', error);
  }
}

module.exports = {
  createTestUserWithDevis,
};
