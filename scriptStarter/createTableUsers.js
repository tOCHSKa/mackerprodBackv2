import { connectToDb } from '../db.js';

export async function createTableUsers() {
    try {
        const db = await connectToDb();

        const sql = `CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('admin', 'user') DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );`;
        await db.query(sql);

        console.log('Table users créée avec succès !');
    } catch (error) {
        console.error('Erreur lors de la création de la table users:', error);
    }
}
