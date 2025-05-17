const { connectToDb } = require('../db.js');

async function createTables() {
  try {
    const db = await connectToDb();

    const sql = `
CREATE TABLE IF NOT EXISTS Albums (
   id_albums INT PRIMARY KEY,
   description VARCHAR(255),
   titre VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Photo (
   id_photo INT PRIMARY KEY,
   titre VARCHAR(50),
   date_ajout DATETIME
);

CREATE TABLE IF NOT EXISTS Devis (
   id_devis INT PRIMARY KEY,
   etat_devis ENUM('aucun', 'en_attente', 'confirme', 'annule', 'termine') DEFAULT 'aucun',
   created_at DATETIME,
   updated_at DATETIME,
   url VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS Admin (
   id_admin INT PRIMARY KEY,
   email VARCHAR(255),
   password VARCHAR(255),
   role ENUM('admin') DEFAULT 'admin'
);

CREATE TABLE IF NOT EXISTS Utilisateur (
   id_utilisateur INT PRIMARY KEY,
   email VARCHAR(255),
   password VARCHAR(255),
   devis BOOLEAN DEFAULT FALSE,
   role ENUM('user') DEFAULT 'user'
);

CREATE TABLE IF NOT EXISTS Video (
   id_video INT PRIMARY KEY,
   titre VARCHAR(255),
   description VARCHAR(255),
   chemin_lien VARCHAR(255),
   id_admin INT NOT NULL,
   FOREIGN KEY(id_admin) REFERENCES Admin(id_admin)
);

CREATE TABLE IF NOT EXISTS Message (
   id_message INT AUTO_INCREMENT PRIMARY KEY,
   nom_expediteur VARCHAR(255),
   email_expediteur VARCHAR(255),
   numero_telephone VARCHAR(255),
   message TEXT,
   date_envoi DATETIME,
   id_admin INT NOT NULL,
   FOREIGN KEY(id_admin) REFERENCES Admin(id_admin)
);

CREATE TABLE IF NOT EXISTS contient (
   id_albums INT,
   id_photo INT,
   PRIMARY KEY(id_albums, id_photo),
   FOREIGN KEY(id_albums) REFERENCES Albums(id_albums),
   FOREIGN KEY(id_photo) REFERENCES Photo(id_photo)
);

CREATE TABLE IF NOT EXISTS ajouter (
   id_albums INT,
   id_admin INT,
   PRIMARY KEY(id_albums, id_admin),
   FOREIGN KEY(id_albums) REFERENCES Albums(id_albums),
   FOREIGN KEY(id_admin) REFERENCES Admin(id_admin)
);

CREATE TABLE IF NOT EXISTS creer (
   id_utilisateur INT,
   id_devis INT,
   PRIMARY KEY(id_utilisateur, id_devis),
   FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur),
   FOREIGN KEY(id_devis) REFERENCES Devis(id_devis)
);
`;

    // IMPORTANT : Si tu n’as pas activé `multipleStatements` dans ta config DB, cette requête échouera.
    // Assure-toi d'avoir dans ta config MySQL : { multipleStatements: true }
    await db.query(sql);

    console.log('✅ Tables créées (si elles n\'existaient pas).');
  } catch (error) {
    console.error('❌ Erreur lors de la création des tables :', error);
  }
}

module.exports = {
  createTables,
};
