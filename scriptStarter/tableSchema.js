const tables = [
    {
      name: 'Albums',
      sql: `
        CREATE TABLE Albums (
          id_albums INT AUTO_INCREMENT PRIMARY KEY,
          description VARCHAR(255),
          titre VARCHAR(50) NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `
    },
    {
      name: 'Photo',
      sql: `
        CREATE TABLE Photo (
          id_photo INT AUTO_INCREMENT PRIMARY KEY,
          titre VARCHAR(50),
          date_ajout DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `
    },
    {
      name: 'Admin',
      sql: `
        CREATE TABLE Admin (
          id_admin INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255),
          password VARCHAR(255),
          role ENUM('admin') DEFAULT 'admin',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `
    },
    {
      name: 'Utilisateur',
      sql: `
        CREATE TABLE Utilisateur (
          id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
          email VARCHAR(255),
          password VARCHAR(255),
          devis BOOLEAN DEFAULT FALSE,
          role ENUM('user') DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
      `
    },
    {
      name: 'Devis',
      sql: `
        CREATE TABLE Devis (
          id_devis INT AUTO_INCREMENT PRIMARY KEY,
          id_utilisateur INT NOT NULL,
          etat_devis ENUM('aucun', 'en_attente', 'confirme', 'annule', 'termine') DEFAULT 'aucun',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          url VARCHAR(500),
          FOREIGN KEY(id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
        );
      `
    },
    {
      name: 'Video',
      sql: `
        CREATE TABLE Video (
          id_video INT AUTO_INCREMENT PRIMARY KEY,
          titre VARCHAR(255),
          description VARCHAR(255),
          chemin_lien VARCHAR(255),
          theme ENUM('event', 'corporate', 'mariage', 'publicité', 'interview', 'immobilier'),
          id_admin INT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY(id_admin) REFERENCES Admin(id_admin)
        );
      `
    },
    {
      name: 'Message',
      sql: `
        CREATE TABLE Message (
          id_message INT AUTO_INCREMENT PRIMARY KEY,
          nom_expediteur VARCHAR(255),
          email_expediteur VARCHAR(255),
          numero_telephone VARCHAR(255),
          message TEXT,
          date_envoi DATETIME,
          id_admin INT NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY(id_admin) REFERENCES Admin(id_admin)
        );
      `
    },
    {
      name: 'contient',
      sql: `
        CREATE TABLE contient (
          id_albums INT,
          id_photo INT,
          PRIMARY KEY(id_albums, id_photo),
          FOREIGN KEY(id_albums) REFERENCES Albums(id_albums),
          FOREIGN KEY(id_photo) REFERENCES Photo(id_photo)
        );
      `
    },
    {
      name: 'ajouter',
      sql: `
        CREATE TABLE ajouter (
          id_albums INT,
          id_admin INT,
          PRIMARY KEY(id_albums, id_admin),
          FOREIGN KEY(id_albums) REFERENCES Albums(id_albums),
          FOREIGN KEY(id_admin) REFERENCES Admin(id_admin)
        );
      `
    }
  ];

module.exports = {
    tables
};