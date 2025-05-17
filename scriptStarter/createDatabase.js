const { connectToServer } = require('../db.js');

async function createDatabase() {
    try {
        const db = await connectToServer();

        // Vérifier si la base existe déjà
        const [rows] = await db.query(`SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'mackerprod';`);

        if (rows.length > 0) {
            console.log('ℹ️ La base de données "mackerprod" existe déjà.');
        } else {
            await db.query(`CREATE DATABASE mackerprod;`);
            console.log('✅ Base de données "mackerprod" créée avec succès !');
        }
    } catch (error) {
        console.error('❌ Erreur lors de la vérification ou création de la base de données:', error);
    }
}

module.exports = {
    createDatabase,
};
