// Tell Node that we're in test "mode"
process.env.NODE_ENV = 'test';

const request = require('supertest');
const app = require('../app');
const db = require('../db');

beforeAll(async () => {
    await db.query(`
      CREATE TABLE IF NOT EXISTS companies (
        code TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT
      );
    `);
  });
  
let company;
beforeEach(async () => {
  const result = await db.query(`
    INSERT INTO companies (code, name, description) 
    VALUES ('AAA','Atom All Alter','The best of the best') 
    RETURNING *`);

  company = result.rows[0]
})

afterEach(async () => {
  await db.query(`DELETE FROM companies`)
})
// this stops all the async functions after the tests are complete, this ends the connection to the database
afterAll(async () => {
  await db.end()
})


describe("GET /compaines", () => {
    test("Get list of companies", async () => {
        const res = await request(app).get('/companies')
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([company])
        
    })
})

describe("GET /compaines/:code", () => {
    test("Get single company", async () => {
        const res = await request(app).get(`/companies/${company.code}`)
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(company)
    })
})

describe("POST /companies", () => {
    test("Creates a company", async () => {
      const res = await request(app)
        .post('/companies')
        .send({ code: 'BBB', name: 'Be Bad Ballin', description: "All of it" });  // Fixed the typo here
  
      expect(res.statusCode).toBe(201);  
      expect(res.body).toEqual({ 
        code: 'BBB',
        name: 'Be Bad Ballin',
        description: 'All of it'
      });
    });
  });
  
  
  describe("PUT /companies/:code", () => {
    test("Updates a company", async () => {
      const res = await request(app)  
        .put(`/companies/${company.code}`)  
        .send({ newCode: 'AAAA', name: 'AT&T' }); 
  
      expect(res.statusCode).toBe(200);  
      expect(res.body).toEqual({  
        companies: {  
          code: 'AAAA', 
          name: 'AT&T'  
        }
      });
    });
  });
  describe("DELETE /companies/:code", () => {
    test("Deletes a company", async () => {
      const res = await request(app).delete(`/companies/${company.code}`);
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual({ message: 'Deleted' })
    })
  })
  
  