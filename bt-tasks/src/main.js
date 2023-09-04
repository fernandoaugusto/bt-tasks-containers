const express = require('express');
const cors = require('cors')
require('dotenv').config();
const accountsController = require('./accounts/accounts.controller');
const authController = require('./auth/auth.controller');
const projectsController = require('./projects/projects.controller');
const tasksController = require('./tasks/tasks.controller');
const { validateSignUp } = require('./accounts/validations/signup.validation');
const { validateLogin } = require('./auth/validations/login.validation');
const { validateProject } = require('./projects/validations/project.validation');
const { validateProjectUUID } = require('./projects/validations/projectuuid.validation');
const { validatePostTask } = require('./tasks/validations/posttask.validation');
const { validatePatchTask } = require('./tasks/validations/patchtask.validation');
const { validateProjectAndTaskUUID } = require('./tasks/validations/taskuuid.validation');
const { runMigrations } = require('./database/prisma.migration');
const { authenticate } = require('./guards/auth.guard');

const PORT = process.env.PORT || 3000;
let server;

const initServer = async (param_port) => {
  await runMigrations();

  const corsOptions = {
    origin: '*',
    methods: ['POST', 'GET', 'PATCH', 'DELETE' ],
    allowedHeaders: ['Content-Type', 'x-auth'],
  }

  const app = express();
  app.use(express.json());
  app.use(cors(corsOptions))
  const routes = express.Router();

  routes.post('/accounts/signup', validateSignUp, accountsController.signUp);

  routes.post('/auth/login', validateLogin, authController.signIn);
  routes.get('/auth/me', authenticate, authController.me);

  routes.post('/projects', authenticate, validateProject, projectsController.postProject);
  routes.patch('/projects/:project_id', authenticate, validateProjectUUID, validateProject, projectsController.updateProjectByID);
  routes.get('/projects', authenticate, projectsController.getAllUserProjects);
  routes.get('/projects/:project_id', authenticate, validateProjectUUID, projectsController.getProjectByID);
  routes.delete('/projects/:project_id', authenticate, validateProjectUUID, projectsController.deleteProjectByID);

  routes.post('/projects/:project_id/tasks', authenticate, validateProjectUUID, validatePostTask, tasksController.postTask);
  routes.patch('/projects/:project_id/tasks/:task_id', authenticate, validateProjectAndTaskUUID, validatePatchTask, tasksController.patchTaskByID);
  routes.delete('/projects/:project_id/tasks/:task_id', authenticate, validateProjectAndTaskUUID, tasksController.deleteTaskByID);

  app.use('/api/v1', routes);

  const server_port = param_port ? param_port : PORT;

  server = app.listen(server_port, () => {
    console.log(`Server is running on http://localhost:${server_port}`);
  });
};

(async () => await initServer())();

const stopServer = () => {
  if (server) {
    server.close();
  }
}

module.exports = { initServer, stopServer }