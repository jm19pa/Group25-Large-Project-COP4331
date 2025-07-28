// openPack.test.js
const request = require('supertest');
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = require('../server');

const client = new MongoClient(process.env.MONGODB_URI);
let jwtToken = '';
let userId = '';

beforeAll(async () => {
  await client.connect();
  const db = client.db('PocketProfessors');
  const users = db.collection('Users');

  const login = 'admin';
  const password = 'pass';
  const email = 'admin@example.com';

  // Try to find user
  let user = await users.findOne({ Login: login });

  // If not exists, create and mark as verified
  if (!user) {
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash(password, 10);
    await users.insertOne({
      Login: login,
      Password: hashedPassword,
      FirstName: 'Admin',
      LastName: 'User',
      Email: email,
      IsVerified: true,
      VerificationCode: null,
      CodeExpires: null
    });
  } else {
    // Ensure IsVerified is true
    await users.updateOne(
      { Login: login },
      { $set: { IsVerified: true } }
    );
  }

  // Login to get token
  const res = await request('http://localhost:5000')
    .post('/api/login')
    .send({ login, password });

  expect(res.statusCode).toBe(200);
  expect(res.body.jwtToken).toBeTruthy();

  jwtToken = res.body.jwtToken;
  userId = res.body.id;
});

afterAll(async () => {
  await client.close();
});
for (let i = 1; i <= 5; i++) {
  test(`Open Pack attempt #${i}`, async () => {
    const res = await request('http://localhost:5000')
      .post('/api/openPack')
      .send({ userId, jwtToken });

    console.log(`Attempt ${i}:`, res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.addedCards).toBeInstanceOf(Array);
  });
}
