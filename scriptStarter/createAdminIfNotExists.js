const bcrypt = require('bcrypt');
const { connectToDb } = require('../db.js');

async function createAdminIfNotExists() {
    try {
        const db = await connectToDb();
        const { ADMIN_PASSWORD, ADMIN_EMAIL } = process.env;

        // Vérification des variables d'environnement
        if (!ADMIN_PASSWORD || !ADMIN_EMAIL) {
            console.warn('Les informations d\'administrateur ne sont pas correctement configurées dans .env');
            process.exit(1); // Arrêter le script si les infos sont manquantes
        }

        const sql = 'SELECT * FROM admin WHERE email = ?';
        const [users] = await db.query(sql, [ADMIN_EMAIL]);

        // Vérifier si un compte admin existe déjà
        if (users.length > 0) {
            const user = users[0];
            if (user.role === 'admin') {
                console.log('✅ Compte admin déjà existant.');
                return;
            } else {
                console.log('Utilisateur trouvé mais le rôle n\'est pas admin. Mise à jour du rôle.');
                const updateRoleSql = 'UPDATE admin SET role = ? WHERE email = ?';
                await db.query(updateRoleSql, ['admin', ADMIN_EMAIL]);
                return;
            }
        }

        // Si l'admin n'existe pas, création du compte
        const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
        const insertSql = 'INSERT INTO admin (email, password, role) VALUES (?, ?, ?)';
        
        await db.query(insertSql, [ADMIN_EMAIL, hashedPassword, 'admin']);
        console.log('✅ Compte admin créé avec succès !');

    } catch (error) {
        console.error('Erreur lors de la création du compte admin:', error);
    }
}
module.exports = {
    createAdminIfNotExists,
  };
