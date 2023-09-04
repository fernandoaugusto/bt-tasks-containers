const request = require('supertest');
const { faker } = require('@faker-js/faker');
const { initTestServer, stopTestServer } = require('./init.server');

const PORT = 10003;
const SERVER_WITH_PREFIX = `http://localhost:${PORT}/api/v1`;

describe('Project Tests E2E', () => {

    beforeAll(async () => {
        await initTestServer(PORT);
    });

    afterAll(() => {
        stopTestServer();
    });

    describe('POST /project', () => {

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

        it('should create a new project', async () => {
            const project_name = faker.commerce.productName();
            const response = await request(SERVER_WITH_PREFIX)
                .post('/projects')
                .set('x-auth', auth_token)
                .send({ name: project_name });
            expect(response.statusCode).toBe(200);
            expect(response.headers).toHaveProperty('x-next-auth');
            expect(response.body).toHaveProperty('id');
            expect(response.body.name).toEqual(project_name);
        });

        it('should not create a new project', async () => {
            const response = await request(SERVER_WITH_PREFIX)
                .post('/projects')
                .set('x-auth', auth_token)
                .send({ });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('Project Name is mandatory.');
        });

        it('should not create a project - name too short', async () => {
            const response = await request(SERVER_WITH_PREFIX)
                .post('/projects')
                .set('x-auth', auth_token)
                .send({ name: '' });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('Project Name must to have min 1 character.');
        });
        
        it('should not create a project - name too long', async () => {
            const projectName = 'a'.repeat(51);  // a string with 51 characters
            const response = await request(SERVER_WITH_PREFIX)
                .post('/projects')
                .set('x-auth', auth_token)
                .send({ name: projectName });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('Project Name must to have max 50 characters.');
        });
        
    });

    describe('PATCH /projects/:project_id', () => {

        let project_id;
        const project_name = faker.commerce.productName();

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
            const response = await request(SERVER_WITH_PREFIX)
                .post('/projects')
                .set('x-auth', auth_token)
                .send({ name: project_name });
            project_id = response.body.id;
        });

        it('should update an existing project', async () => {
            const new_name = faker.commerce.productName();
            const response = await request(SERVER_WITH_PREFIX)
                .patch(`/projects/${project_id}`)
                .set('x-auth', auth_token)
                .send({ name: new_name });
            expect(response.statusCode).toBe(200);
            expect(response.body.name).toEqual(new_name);
        });

        it('should not update a project with invalid UUID', async () => {
            const response = await request(SERVER_WITH_PREFIX)
                .patch(`/projects/invalidUUID`)
                .set('x-auth', auth_token)
                .send({ name: project_name });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('Project ID has invalid UUID v4 format.');
        });

    });

    describe('GET /projects', () => {

        const project_name = faker.commerce.productName();

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
            const response = await request(SERVER_WITH_PREFIX)
                .post('/projects')
                .set('x-auth', auth_token)
                .send({ name: project_name });
        });

        it('should fetch all projects of the user', async () => {
            const response = await request(SERVER_WITH_PREFIX)
                .get('/projects')
                .set('x-auth', auth_token);
            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });

    });

    describe('GET /projects/:project_id', () => {

        let project_id;
        const project_name = faker.commerce.productName();

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
            const response = await request(SERVER_WITH_PREFIX)
                .post('/projects')
                .set('x-auth', auth_token)
                .send({ name: project_name });
            project_id = response.body.id;
        });

        it('should fetch a specific project by ID', async () => {
            const response = await request(SERVER_WITH_PREFIX)
                .get(`/projects/${project_id}`)
                .set('x-auth', auth_token);
            expect(response.statusCode).toBe(200);
            expect(response.body.id).toEqual(project_id);
            expect(response.body.name).toEqual(project_name);
        });

        it('should not fetch a project with invalid UUID', async () => {
            const response = await request(SERVER_WITH_PREFIX)
                .get(`/projects/invalidUUID`)
                .set('x-auth', auth_token);
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('Project ID has invalid UUID v4 format.');
        });

    });

    describe('DELETE /projects/:project_id', () => {

        let project_id;
        const project_name = faker.commerce.productName();

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
            const response = await request(SERVER_WITH_PREFIX)
                .post('/projects')
                .set('x-auth', auth_token)
                .send({ name: project_name });
            project_id = response.body.id;
        });

        it('should delete a project by its ID', async () => {
            const response = await request(SERVER_WITH_PREFIX)
                .delete(`/projects/${project_id}`)
                .set('x-auth', auth_token);
            expect(response.statusCode).toBe(204);
        });

        it('should not delete a project with invalid UUID', async () => {
            const response = await request(SERVER_WITH_PREFIX)
                .delete(`/projects/invalidUUID`)
                .set('x-auth', auth_token);
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('Project ID has invalid UUID v4 format.');
        });

    });


});