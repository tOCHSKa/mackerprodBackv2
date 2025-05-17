const { createAdminIfNotExists } = require('./createAdminIfNotExists.js');
const { createTables } = require('./createTable.js');
const { createDatabase } = require('./createDatabase.js');

async function setupApp() {
    try {
        await createDatabase(); // Étape 1
        // console.log('✅ Base de données créée');
    } catch (error) {
        console.error('❌ Erreur pendant la création de la base de données :', error);
        return;
    }

    try {
        await createTables(); // Étape 2
        // console.log('✅ Tables créées');
    } catch (error) {
        console.error('❌ Erreur pendant la création des tables :', error);
        return;
    }

    try {
        await createAdminIfNotExists(); // Étape 3
        // console.log('✅ Admin initial créé');
    } catch (error) {
        console.error('❌ Erreur pendant la création de l\'admin :', error);
        return;
    }

    console.log('🎉 Initialisation terminée avec succès !');
}

module.exports = {
    setupApp,
}   