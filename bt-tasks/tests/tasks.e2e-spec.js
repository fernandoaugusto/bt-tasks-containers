const request = require('supertest');
const { faker } = require('@faker-js/faker');
const { initServer, stopServer } = require('../src/main');

const PORT = 10004;
const SERVER_WITH_PREFIX = `http://localhost:${PORT}/api/v1`;

describe('Tasks Tests E2E', () => {

    beforeAll(async () => {
        //await initServer(PORT);
    });

    afterAll(() => {
        stopServer();
    });

    describe('POST /project/:project_id/tasks', () => {

        const requestBodyNewAccount = {
            email: faker.internet.email(),
            full_name: faker.person.fullName(),
            password: faker.internet.password()
        };
        const project_name = faker.commerce.productName();

        let auth_token, project_id;

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

        it('should create a new task', async () => {
            const task_title = faker.commerce.productName();
            const response = await request(SERVER_WITH_PREFIX)
                .post(`/projects/${project_id}/tasks`)
                .set('x-auth', auth_token)
                .send({ title: task_title });
            expect(response.statusCode).toBe(200);
            expect(response.body.title).toEqual(task_title);
        });

        it('should not create a task without title', async () => {
            const response = await request(SERVER_WITH_PREFIX)
                .post(`/projects/${project_id}/tasks`)
                .set('x-auth', auth_token)
                .send({});
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('Title is required');
        });

        it('should not create a task - title too long', async () => {
            const taskTitle = 'a'.repeat(51);
            const response = await request(SERVER_WITH_PREFIX)
                .post(`/projects/${project_id}/tasks`)
                .set('x-auth', auth_token)
                .send({ title: taskTitle });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('Title must be at most 50 characters long');
        });
    });

    describe('PATCH /project/:project_id/tasks/:task_id', () => {

        let auth_token, project_id, task_id;
    
        beforeAll(async () => {
            const requestBodyNewAccount = {
                email: faker.internet.email(),
                full_name: faker.person.fullName(),
                password: faker.internet.password()
            };
            const project_name = faker.commerce.productName();
    
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
                .expect(200);
            auth_token = resLogin.headers['x-next-auth'];
    
            const resProject = await request(SERVER_WITH_PREFIX)
                .post('/projects')
                .set('x-auth', auth_token)
                .send({ name: project_name });
            project_id = resProject.body.id;
    
            const task_title = faker.commerce.productName();
            const resTask = await request(SERVER_WITH_PREFIX)
                .post(`/projects/${project_id}/tasks`)
                .set('x-auth', auth_token)
                .send({ title: task_title });
            task_id = resTask.body.id;
        });
    
        it('should update the task', async () => {
            const new_task_title = faker.commerce.productName();
            const response = await request(SERVER_WITH_PREFIX)
                .patch(`/projects/${project_id}/tasks/${task_id}`)
                .set('x-auth', auth_token)
                .send({ title: new_task_title, checked: true });
            expect(response.statusCode).toBe(200);
            expect(response.body.title).toEqual(new_task_title);
            expect(response.body.checked).toEqual(true);
        });
    
        it('should not update the task without title', async () => {
            const response = await request(SERVER_WITH_PREFIX)
                .patch(`/projects/${project_id}/tasks/${task_id}`)
                .set('x-auth', auth_token)
                .send({ checked: true });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('Title is required');
        });
    
        it('should not update the task - title too long', async () => {
            const taskTitle = 'a'.repeat(51);
            const response = await request(SERVER_WITH_PREFIX)
                .patch(`/projects/${project_id}/tasks/${task_id}`)
                .set('x-auth', auth_token)
                .send({ title: taskTitle, checked: true });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('Title must be at most 50 characters long');
        });
    
        it('should not update the task without checked status', async () => {
            const new_task_title = faker.commerce.productName();
            const response = await request(SERVER_WITH_PREFIX)
                .patch(`/projects/${project_id}/tasks/${task_id}`)
                .set('x-auth', auth_token)
                .send({ title: new_task_title });
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain('Checked status is required');
        });
    });

    describe('DELETE /project/:project_id/tasks/:task_id', () => {

        let auth_token, project_id, task_id;
    
        beforeAll(async () => {
            const requestBodyNewAccount = {
                email: faker.internet.email(),
                full_name: faker.person.fullName(),
                password: faker.internet.password()
            };
            const project_name = faker.commerce.productName();
    
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
                .expect(200);
            auth_token = resLogin.headers['x-next-auth'];
    
            const resProject = await request(SERVER_WITH_PREFIX)
                .post('/projects')
                .set('x-auth', auth_token)
                .send({ name: project_name });
            project_id = resProject.body.id;
    
            const task_title = faker.commerce.productName();
            const resTask = await request(SERVER_WITH_PREFIX)
                .post(`/projects/${project_id}/tasks`)
                .set('x-auth', auth_token)
                .send({ title: task_title });
            task_id = resTask.body.id;
        });
    
        it('should delete the task successfully', async () => {
            const response = await request(SERVER_WITH_PREFIX)
                .delete(`/projects/${project_id}/tasks/${task_id}`)
                .set('x-auth', auth_token);
            expect(response.statusCode).toBe(204);
        });
    
        it('should return an error for invalid project UUID', async () => {
            const invalidProjectID = "1234-invalid-uuid";
            const response = await request(SERVER_WITH_PREFIX)
                .delete(`/projects/${invalidProjectID}/tasks/${task_id}`)
                .set('x-auth', auth_token);
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain("Project ID has invalid UUID v4 format.");
        });
    
        it('should return an error for invalid task UUID', async () => {
            const invalidTaskID = "1234-invalid-uuid";
            const response = await request(SERVER_WITH_PREFIX)
                .delete(`/projects/${project_id}/tasks/${invalidTaskID}`)
                .set('x-auth', auth_token);
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain("Task ID has invalid UUID v4 format.");
        });
    
        it('should return an error if the project does not exist', async () => {
            const non_existent_id = "8a60ff07-61d6-497c-8f98-8c7c2c2999c3";
            const response = await request(SERVER_WITH_PREFIX)
                .delete(`/projects/${non_existent_id}/tasks/${task_id}`)
                .set('x-auth', auth_token);
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain("Project with given ID does not exist.");
        });
    
        it('should return an error if the task does not exist', async () => {
            const non_existent_id = "8a60ff07-61d6-497c-8f98-8c7c2c2999c3";
            const response = await request(SERVER_WITH_PREFIX)
                .delete(`/projects/${project_id}/tasks/${non_existent_id}`)
                .set('x-auth', auth_token);
            expect(response.statusCode).toBe(400);
            expect(response.body.message).toContain("Task with given ID does not exist.");
        });
    
    });
    
    

});
