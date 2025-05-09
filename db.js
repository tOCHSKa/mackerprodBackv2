import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

let db = null;

export async function connectToDb() {
    const timeStamp = new Date();
    const timeOnly = timeStamp.toLocaleTimeString();
  
    if (db) {
      console.log(timeOnly, 'Already connected to the database');
      return db;
    }
  
    try {
      db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
      });
  
      console.log(timeOnly, 'Connected to database.');
      return db;
    } catch (error) {
      console.error(timeOnly, 'Database connection failed:', error);
      db = null;
      return null;
    }
}

export async function keepAlive() {
    const timeStamp = new Date();
    const timeOnly = timeStamp.toLocaleTimeString();
    try {
        if (!db) {
            console.log(timeOnly, 'Reconnecting to database...');
            await connectToDb();
        }
        await db.query('SELECT 1');
        console.log(timeOnly, 'Connexion DB maintenue');
    } catch (err) {
        console.error(timeOnly, 'Erreur Keep-Alive:', err);
        db = null;
    }
}

// Exécuter KeepAlive toutes les 30s
setInterval(keepAlive, 30000);
