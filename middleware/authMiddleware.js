const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); // Passe à la suite
    } catch (err) {
        console.error('Erreur de vérification du token:', err);
        return res.status(403).json({ message: 'Token non valide ou expiré' });
    }
}

module.exports = {
    authMiddleware
}
