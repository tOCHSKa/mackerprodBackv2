const request = require('supertest');
const express = require('express');
const { adminRoutes } = require('../routes/adminRoutes');

jest.mock('../db.js'); 
jest.mock('../middleware/authMiddleware.js');

const { connectToDb } = require('../db.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');

describe('Admin routes', () => {
  let app;
  let fakeDb;

  beforeEach(() => {
    fakeDb = {
      query: jest.fn(),
    };
    jest.spyOn(console, 'error').mockImplementation(() => {});
    
    connectToDb.mockResolvedValue(fakeDb);

    // Par défaut, authMiddleware injecte un user admin
    authMiddleware.mockImplementation((req, res, next) => {
      req.user = { role: 'admin' };
      next();
    });

    app = express();
    app.use(express.json());
    app.use('/api/admin', adminRoutes());
  });

  afterEach(() => {
    jest.clearAllMocks();
    console.error.mockRestore();
  });

  describe('GET /api/admin/all', () => {
    it('✅ renvoie la liste des admins si admin connecté', async () => {
      fakeDb.query.mockResolvedValue([[{ id_admin: 1, email: 'admin@example.com', role: 'admin' }]]);

      const res = await request(app).get('/api/admin/all');

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual([{ id_admin: 1, email: 'admin@example.com', role: 'admin' }]);
      expect(fakeDb.query).toHaveBeenCalledWith('SELECT * FROM Admin');
    });

    it('❌ renvoie 403 si utilisateur non admin', async () => {
      // Ici on override le middleware pour simuler un user non admin
      authMiddleware.mockImplementation((req, res, next) => {
        req.user = { role: 'user' };
        next();
      });

      const res = await request(app).get('/api/admin/all');

      expect(res.statusCode).toBe(403);
      expect(res.text).toBe('Forbidden');
    });

    it('❌ renvoie 500 si erreur DB', async () => {
      connectToDb.mockResolvedValue(null); // Simule echec connexion DB

      const res = await request(app).get('/api/admin/all');

      expect(res.statusCode).toBe(500);
      expect(res.text).toBe('Erreur de connexion à la base de données');
    });

    it('❌ renvoie 500 si erreur lors de la requête DB', async () => {
      fakeDb.query.mockRejectedValue(new Error('DB error'));

      const res = await request(app).get('/api/admin/all');

      expect(res.statusCode).toBe(500);
      expect(res.text).toBe('Erreur lors de la récupération des utilisateurs');
    });
  });

  describe('POST /api/admin/login', () => {
    it('✅ connexion réussie retourne un token', async () => {
      const bcrypt = require('bcrypt');
      const jwt = require('jsonwebtoken');

      // Mock bcrypt.compare pour renvoyer true (mot de passe valide)
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      // Mock jwt.sign pour retourner un token fixe
      jest.spyOn(jwt, 'sign').mockReturnValue('fake-jwt-token');

      const hashedPassword = 'hashedpassword';

      fakeDb.query.mockResolvedValue([[{ role: 'admin', email: 'admin@example.com', password: hashedPassword }]]);

      const res = await request(app)
        .post('/api/admin/login')
        .send({ email: 'admin@example.com', password: 'Password123!' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({
        message: 'Connexion réussie.',
        token: 'fake-jwt-token',
      });

      bcrypt.compare.mockRestore();
      jwt.sign.mockRestore();
    });

    it('❌ renvoie 400 si email ou password manquant', async () => {
      let res = await request(app).post('/api/admin/login').send({ email: 'admin@example.com' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Email et mot de passe sont obligatoires.');

      res = await request(app).post('/api/admin/login').send({ password: 'Password123!' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Email et mot de passe sont obligatoires.');
    });

    it('❌ renvoie 400 si email ou password ne sont pas des strings', async () => {
      const res = await request(app).post('/api/admin/login').send({ email: 123, password: true });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Les champs doivent être des chaînes de caractères.');
    });

    it('❌ renvoie 400 si utilisateur non trouvé ou mot de passe invalide', async () => {
      fakeDb.query.mockResolvedValue([[]]); // aucun utilisateur

      let res = await request(app).post('/api/admin/login').send({ email: 'test@test.com', password: 'Password123!' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Email ou mot de passe incorrect.');

      // Simule utilisateur trouvé mais mot de passe incorrect
      fakeDb.query.mockResolvedValue([[{ role: 'admin', email: 'test@test.com', password: 'hashed' }]]);
      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      res = await request(app).post('/api/admin/login').send({ email: 'test@test.com', password: 'wrongpass' });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Email ou mot de passe incorrect.');

      bcrypt.compare.mockRestore();
    });

    it('❌ renvoie 500 si erreur serveur', async () => {
      fakeDb.query.mockRejectedValue(new Error('DB error'));

      const res = await request(app).post('/api/admin/login').send({ email: 'admin@example.com', password: 'Password123!' });

      expect(res.statusCode).toBe(500);
      expect(res.text).toBe('Erreur interne du serveur.');
    });
  });

  describe('POST /api/admin/register', () => {
    it('✅ crée un admin avec données valides', async () => {
      fakeDb.query.mockResolvedValue([[]]); // email pas déjà pris
      fakeDb.query.mockResolvedValueOnce([[]]); // check email
      fakeDb.query.mockResolvedValueOnce([{ insertId: 1 }]); // insert admin

      const res = await request(app).post('/api/admin/register').send({
        email: 'newadmin@example.com',
        password: 'Password123!',
        confirmedpassword: 'Password123!',
        role: 'admin',
      });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Admin créé avec succès.');
    });

    it('❌ renvoie 400 si champs manquants', async () => {
      const res = await request(app).post('/api/admin/register').send({
        email: 'test@example.com',
        password: 'Password123!',
        // missing confirmedpassword and role
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/champs suivants sont manquants/);
    });

    it('❌ renvoie 400 si mots de passe ne correspondent pas', async () => {
      const res = await request(app).post('/api/admin/register').send({
        email: 'test@example.com',
        password: 'Password123!',
        confirmedpassword: 'Mismatch123!',
        role: 'admin',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Les mots de passe ne correspondent pas.");
    });

    it('❌ renvoie 400 si email invalide', async () => {
      const res = await request(app).post('/api/admin/register').send({
        email: 'invalid-email',
        password: 'Password123!',
        confirmedpassword: 'Password123!',
        role: 'admin',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Le format de l'email est invalide.");
    });

    it('❌ renvoie 400 si mot de passe trop court', async () => {
      const res = await request(app).post('/api/admin/register').send({
        email: 'test@example.com',
        password: 'short',
        confirmedpassword: 'short',
        role: 'admin',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Le mot de passe doit contenir au moins 10 caractères.");
    });

    it('❌ renvoie 400 si mot de passe pas assez complexe', async () => {
      const res = await request(app).post('/api/admin/register').send({
        email: 'test@example.com',
        password: 'passwordpassword', // pas de majuscule, chiffre ou spécial
        confirmedpassword: 'passwordpassword',
        role: 'admin',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Le mot de passe doit contenir une majuscule, une minuscule, un chiffre et un caractère spécial.");
    });

    it('❌ renvoie 400 si email déjà utilisé', async () => {
      // Simule qu'on trouve un utilisateur avec cet email
      fakeDb.query.mockResolvedValue([[{ id_admin: 1, email: 'used@example.com' }]]);

      const res = await request(app).post('/api/admin/register').send({
        email: 'used@example.com',
        password: 'Password123!',
        confirmedpassword: 'Password123!',
        role: 'admin',
      });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('Cet email est déjà utilisé.');
    });

    it('❌ renvoie 500 si erreur serveur', async () => {
      fakeDb.query.mockRejectedValue(new Error('DB error'));

      const res = await request(app).post('/api/admin/register').send({
        email: 'test@example.com',
        password: 'Password123!',
        confirmedpassword: 'Password123!',
        role: 'admin',
      });

      expect(res.statusCode).toBe(500);
      expect(res.text).toBe('Erreur interne du serveur.');
    });
  });
});
