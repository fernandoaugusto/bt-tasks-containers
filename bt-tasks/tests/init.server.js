const express = require('express');
const cors = require('cors')
require('dotenv').config();
const accountsController = require('../src/accounts/accounts.controller');
const authController = require('../src/auth/auth.controller');
const projectsController = require('../src/projects/projects.controller');
const tasksController = require('../src/tasks/tasks.controller');
const { validateSignUp } = require('../src/accounts/validations/signup.validation');
const { validateLogin } = require('../src/auth/validations/login.validation');
const { validateProject } = require('../src/projects/validations/project.validation');
const { validateProjectUUID } = require('../src/projects/validations/projectuuid.validation');
const { validatePostTask } = require('../src/tasks/validations/posttask.validation');
const { validatePatchTask } = require('../src/tasks/validations/patchtask.validation');
const { validateProjectAndTaskUUID } = require('../src/tasks/validations/taskuuid.validation');
const { runMigrations } = require('../src/database/prisma.migration');
const { authenticate } = require('../src/guards/auth.guard');

const initTestServer = async (param_port) => {
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
  
    server = app.listen(param_port, () => {
      console.log(`Server is running on http://localhost:${param_port}`);
    });
  };

  const stopTestServer = () => {
    if (server) {
      server.close();
    }
  }

  module.exports = { initTestServer, stopTestServer }