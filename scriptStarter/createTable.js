const { connectToDb } = require('../db.js');
const { tables } = require('./tableSchema.js');

async function createTables() {
  try {
    const db = await connectToDb();

    for (const table of tables) {
      const [rows] = await db.query(
        `SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'mackerprod' AND TABLE_NAME = ?`,
        [table.name]
      );

      if (rows.length > 0) {
        console.log(`ℹ️ Table "${table.name}" existe déjà.`);
      } else {
        await db.query(table.sql);
        console.log(`✅ Table "${table.name}" créée avec succès.`);
      }
    }
  } catch (error) {
    console.error('❌ Erreur lors de la création des tables :', error);
  }
}

module.exports = {
  createTables,
};
