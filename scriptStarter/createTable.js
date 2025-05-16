const { connectToDb } = require('../db.js');

async function createTables() {
  try {
    const db = await connectToDb();

    const sql = `
CREATE TABLE IF NOT EXISTS Albums (
   id_albums VARCHAR(50) PRIMARY KEY,
   description VARCHAR(150),
   titre VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS Photo (
   id_photo VARCHAR(50) PRIMARY KEY,
   titre VARCHAR(50),
   date_ajout DATETIME
);

CREATE TABLE IF NOT EXISTS Video (
   id_video VARCHAR(50) PRIMARY KEY,
   titre VARCHAR(150),
   description VARCHAR(255),
   chemin_lien VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS devis (
   id_devis VARCHAR(50) PRIMARY KEY,
   etat_devis ENUM('aucun', 'en_attente', 'confirme', 'annule', 'termine') DEFAULT 'aucun',
   created_at DATETIME,
   updated_at DATETIME,
   url VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS Utilisateur (
   id_Utilisateur VARCHAR(50) PRIMARY KEY,
   email VARCHAR(50),
   password VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS Admin (
   id_admin VARCHAR(50) PRIMARY KEY,
   email VARCHAR(50),
   password VARCHAR(50),
   devis BOOLEAN DEFAULT FALSE,
   role ENUM('admin', 'user'),
   id_devis VARCHAR(50) NOT NULL,
   id_Utilisateur VARCHAR(50) NOT NULL,
   id_video VARCHAR(50) NOT NULL,
   id_albums VARCHAR(50),
   FOREIGN KEY (id_devis) REFERENCES devis(id_devis),
   FOREIGN KEY (id_Utilisateur) REFERENCES Utilisateur(id_Utilisateur),
   FOREIGN KEY (id_video) REFERENCES Video(id_video),
   FOREIGN KEY (id_albums) REFERENCES Albums(id_albums)
);

CREATE TABLE IF NOT EXISTS message (
   id_message VARCHAR(255) PRIMARY KEY,
   nom_expediteur VARCHAR(50),
   email_expediteur VARCHAR(50),
   date_envoi DATETIME,
   id_admin VARCHAR(50) NOT NULL,
   FOREIGN KEY (id_admin) REFERENCES Admin(id_admin)
);

CREATE TABLE IF NOT EXISTS contient (
   id_albums VARCHAR(50),
   id_photo VARCHAR(50),
   PRIMARY KEY (id_albums, id_photo),
   FOREIGN KEY (id_albums) REFERENCES Albums(id_albums),
   FOREIGN KEY (id_photo) REFERENCES Photo(id_photo)
);

CREATE TABLE IF NOT EXISTS avoir (
   id_devis VARCHAR(50),
   id_Utilisateur VARCHAR(50),
   PRIMARY KEY (id_devis, id_Utilisateur),
   FOREIGN KEY (id_devis) REFERENCES devis(id_devis),
   FOREIGN KEY (id_Utilisateur) REFERENCES Utilisateur(id_Utilisateur)
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
