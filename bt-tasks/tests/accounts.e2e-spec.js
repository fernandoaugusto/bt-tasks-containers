const request = require('supertest');
const { faker } = require('@faker-js/faker');
const { initServer, stopServer } = require('../src/main');

const PORT = 10001;
const SERVER_WITH_PREFIX = `http://localhost:${PORT}/api/v1`;

describe('Accounts Tests E2E', () => {

    beforeAll(async () => {
        //await initServer(PORT);
    });

    afterAll(() => {
        stopServer();
    });

    describe('POST /accounts/signup', () => {

        it('should create a new account', async () => {
            const requestBody = {
                email: faker.internet.email(),
                full_name: faker.person.fullName(),
                password: faker.internet.password()
            };
            const response = await request(SERVER_WITH_PREFIX)
                .post('/accounts/signup')
                .send(requestBody)
            expect(response.statusCode).toBe(200);
            expect(response.headers).toHaveProperty('x-next-auth');
            expect(response.body.email).toEqual(requestBody.email);
            expect(response.body.full_name).toEqual(requestBody.full_name);
        });

        it('should not create a new account - missing email field', async () => {
            const requestBody = {
                full_name: faker.person.fullName(),
                password: faker.internet.password()
            };
            const response = await request(SERVER_WITH_PREFIX)
                .post('/accounts/signup')
                .send(requestBody)
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('status_code');
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Email is mandatory.');
        });

        it('should not create a new account - missing full_name field', async () => {
            const requestBody = {
                email: faker.internet.email(),
                password: faker.internet.password()
            };
            const response = await request(SERVER_WITH_PREFIX)
                .post('/accounts/signup')
                .send(requestBody)
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('status_code');
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Full Name is mandatory.');
        });

        it('should not create a new account - missing password field', async () => {
            const requestBody = {
                email: faker.internet.email(),
                full_name: faker.person.fullName(),
            };
            const response = await request(SERVER_WITH_PREFIX)
                .post('/accounts/signup')
                .send(requestBody);
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('status_code');
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Password is mandatory.');
        });
    
        it('should not create a new account - invalid email format', async () => {
            const requestBody = {
                email: "invalidEmail",
                full_name: faker.person.fullName(),
                password: faker.internet.password()
            };
            const response = await request(SERVER_WITH_PREFIX)
                .post('/accounts/signup')
                .send(requestBody);
            expect(response.statusCode).toBe(400);
            expect(response.body).toHaveProperty('status_code');
            expect(response.body).toHaveProperty('message');
            expect(response.body.message).toContain('Invalid email!');
        });

    });

});