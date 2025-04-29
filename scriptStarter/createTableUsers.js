import { connectToDb } from '../db.js';

export async function createTableUsers() {
    try {
        const db = await connectToDb();

        // Vérifie si la table 'users' existe
        const [results] = await db.query(
            `SELECT COUNT(*) AS count 
             FROM information_schema.tables 
             WHERE table_schema = ? AND table_name = 'users'`, 
            [process.env.DB_NAME]
        );

        if (results[0].count > 0) {
            console.log('✅ Table `users` existe déjà.');
            return;
        }

        // Création de la table si elle n'existe pas
        const sql = `CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('admin', 'user') DEFAULT 'user',
            devis BOOLEAN DEFAULT FALSE,
            etat_devis ENUM('aucun', 'en_attente', 'confirme', 'annule', 'termine') DEFAULT 'aucun',
            url VARCHAR(500),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );`;

        await db.query(sql);

        console.log('✅ Table `users` créée avec succès.');
    } catch (error) {
        console.error('❌ Erreur lors de la vérification ou création de la table `users`:', error);
    }
}
