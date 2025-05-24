// __tests__/user.test.js
const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../db.js'); // mock du module db
const { connectToDb } = require('../db.js');
const { utilisateurRoutes } = require('../routes/userRoutes.js');

// On fixe la variable d'environnement pour JWT
beforeAll(() => {
  process.env.JWT_SECRET = 'test_secret_key';
});

describe('POST /api/utilisateur/login', () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/utilisateur', utilisateurRoutes());
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('✅ retourne 200 et token si login correct', async () => {
    // Mock du résultat BDD avec un hash bcrypt pour 'validPassword'
    const hashedPassword = await bcrypt.hash('validPassword', 10);

    connectToDb.mockResolvedValue({
      query: jest.fn().mockResolvedValue([[{
        role: 'user',
        email: 'test@example.com',
        password: hashedPassword,
      }]])
    });

    const res = await request(app)
      .post('/api/utilisateur/login')
      .send({ email: 'test@example.com', password: 'validPassword' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.message).toBe('Connexion réussie.');
  });

  it('❌ retourne 400 si email ou password manquant', async () => {
    const res = await request(app)
      .post('/api/utilisateur/login')
      .send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email et mot de passe sont obligatoires.');
  });

  it('❌ retourne 400 si utilisateur non trouvé', async () => {
    connectToDb.mockResolvedValue({
      query: jest.fn().mockResolvedValue([[]]) // Pas d’utilisateur trouvé
    });

    const res = await request(app)
      .post('/api/utilisateur/login')
      .send({ email: 'unknown@example.com', password: 'anyPassword' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email ou mot de passe incorrect.');
  });

  it('❌ retourne 400 si mot de passe invalide', async () => {
    const hashedPassword = await bcrypt.hash('correctPassword', 10);

    connectToDb.mockResolvedValue({
      query: jest.fn().mockResolvedValue([[{
        role: 'user',
        email: 'test@example.com',
        password: hashedPassword,
      }]])
    });

    const res = await request(app)
      .post('/api/utilisateur/login')
      .send({ email: 'test@example.com', password: 'wrongPassword' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe('Email ou mot de passe incorrect.');
  });

  it('❌ retourne 500 si erreur base de données', async () => {
    connectToDb.mockResolvedValue(null); // Simule échec connexion BDD

    const res = await request(app)
      .post('/api/utilisateur/login')
      .send({ email: 'test@example.com', password: 'validPassword' });

    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Erreur de connexion à la base de données');
  });
});
