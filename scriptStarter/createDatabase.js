const { connectToServer } = require('../db.js');

async function createDatabase() {
    try {
        const db = await connectToServer();

        // Essayer de créer la base de données si elle n'existe pas
        const sql = `CREATE DATABASE IF NOT EXISTS mackerprod;`;
        await db.query(sql);

        console.log('✅ Base de données mackerprod créée avec succès !');
    } catch (error) {
        console.error('Erreur lors de la création de la base de données:', error);
    }
}
module.exports = {
    createDatabase,
};