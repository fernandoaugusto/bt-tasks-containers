const request = require('supertest');
const { faker } = require('@faker-js/faker');
const { initServer, stopServer } = require('../src/main');

const PORT = 10002;
const SERVER_WITH_PREFIX = `http://localhost:${PORT}/api/v1`;

describe('Auth Tests E2E', () => {

    beforeAll(async () => {
        //await initServer(PORT);
    });

    afterAll(() => {
        stopServer();
    });

    describe('POST /auth/login', () => {

        it('should login in a new account', async () => {
            const requestBodyNewAccount = {
                email: faker.internet.email(),
                full_name: faker.person.fullName(),
                password: faker.internet.password()
            };
            const resNewAccount = await request(SERVER_WITH_PREFIX)
                .post('/accounts/signup')
                .send(requestBodyNewAccount)
                .expect(200);
            const requestBodyLogin = {
                email: requestBodyNewAccount.email,
                password: requestBodyNewAccount.password
            };
            const resLogin = await request(SERVER_WITH_PREFIX)
                .post('/auth/login')
                .send(requestBodyLogin)
            expect(resLogin.statusCode).toBe(200);
            expect(resLogin.headers).toHaveProperty('x-next-auth');
            expect(resLogin.body.email).toEqual(requestBodyNewAccount.email);
            expect(resLogin.body.full_name).toEqual(requestBodyNewAccount.full_name);
        });

        it('should not login - missing email field', async () => {
            const requestBody = {
                password: faker.internet.password()
            };
            const response = await request(SERVER_WITH_PREFIX)
                .post('/auth/login')
                .send(requestBody);
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('Email is mandatory.');
        });
    
        it('should not login - missing password field', async () => {
            const requestBody = {
                email: faker.internet.email()
            };
            const response = await request(SERVER_WITH_PREFIX)
                .post('/auth/login')
                .send(requestBody);
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('Password is mandatory.');
        });
    
        it('should not login - invalid email format', async () => {
            const requestBody = {
                email: "invalidEmailFormat",
                password: faker.internet.password()
            };
            const response = await request(SERVER_WITH_PREFIX)
                .post('/auth/login')
                .send(requestBody);
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('Invalid email!');
        });
    
        it('should not login - email exceeds max characters', async () => {
            const longEmail = "a".repeat(51) + "@test.com";
            const requestBody = {
                email: longEmail,
                password: faker.internet.password()
            };
            const response = await request(SERVER_WITH_PREFIX)
                .post('/auth/login')
                .send(requestBody);
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('Email must to have max 50 characters.');
        });
    
        it('should not login - password exceeds max characters', async () => {
            const longPassword = "a".repeat(21);
            const requestBody = {
                email: faker.internet.email(),
                password: longPassword
            };
            const response = await request(SERVER_WITH_PREFIX)
                .post('/auth/login')
                .send(requestBody);
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('Password must to have max 20 characters.');
        });

    });

    describe('GET /auth/me', () => { 

        const requestBodyNewAccount = {
            email: faker.internet.email(),
            full_name: faker.person.fullName(),
            password: faker.internet.password()
        };

        let auth_token;

        beforeAll(async () => {
            const resNewAccount = await request(SERVER_WITH_PREFIX)
                .post('/accounts/signup')
                .send(requestBodyNewAccount)
                .expect(200);
            const requestBodyLogin = {
                email: requestBodyNewAccount.email,
                password: requestBodyNewAccount.password
            };
            const resLogin = await request(SERVER_WITH_PREFIX)
                .post('/auth/login')
                .send(requestBodyLogin)
                expect(200)
            auth_token = resLogin.headers['x-next-auth'];
        });
        
        it('should get user authenticated', async () => {
            const resMe = await request(SERVER_WITH_PREFIX)
                .get('/auth/me')
                .set('x-auth', auth_token)
                expect(200);
            expect(resMe.headers).toHaveProperty('x-next-auth');
            expect(resMe.body.email).toEqual(requestBodyNewAccount.email);
            expect(resMe.body.full_name).toEqual(requestBodyNewAccount.full_name);
        });

        it('should not get user authenticated - missing auth token', async () => {
            const response = await request(SERVER_WITH_PREFIX)
                .get('/auth/me')
            expect(response.statusCode).toBe(401);
            expect(response.body.message).toContain('Auth token was not informed!');
        });

    });

});