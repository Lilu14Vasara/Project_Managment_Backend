
# Project Management Backend

A Node.js and Express backend for a simple project management system with authentication, projects, project members, tasks, and subtasks.

This codebase currently provides:

- User registration, login, and logout
- JWT-based authentication using cookies or Bearer tokens
- Project creation and project member management
- Role-based access checks for project routes
- Task and subtask CRUD endpoints
- MongoDB persistence with Mongoose

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcrypt
- cookie-parser
- multer

## Project Structure

```text
src/
  app.js
  index.js
  db/
    index.js
  controllers/
    auth.controllers.js
    project.controllers.js
    task.controller.js
  middlewares/
    auth.middleware.js
    multer.middleware.js
  models/
    User.js
    project.models.js
    projectmember.models.js
    task.models.js
    subtask.model.js
    note.model.js
  routes/
    auth.routes.js
    project.routes.js
    task.routes.js
  utils/
    api-error.js
    api-response.js
    constants.js
```

## Features

### Authentication

- Register a new user
- Login with `email` or `username`
- Logout an authenticated user
- Access token validation through middleware

### Projects

- Create a project
- Fetch a single project
- Update a project
- Delete a project
- Add members to a project
- View project members
- Update project member role
- Remove a project member

### Tasks

- List tasks for a project
- Create a task inside a project
- Update a task
- Delete a task

### Subtasks

- List subtasks for a task
- Create a subtask
- Update a subtask
- Delete a subtask

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root and add:

```env
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
BASE_URL=http://localhost:3000
```

Notes:

- `ACCESS_TOKEN_SECRET` and `REFRESH_TOKEN_SECRET` are required for JWT generation and verification.
- `BASE_URL` is used when task attachments are converted into public URLs.
- The MongoDB connection string is currently hardcoded in [`src/db/index.js`](/home/i-m-shailesh/Desktop/temp/src/db/index.js), so database configuration is not yet environment-driven.

## Running the Project

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

The server starts on:

```text
http://localhost:3000
```

## API Base Path

```text
/api/v1
```

## Available Routes

### Auth Routes

Base path: `/api/v1/auth`

- `POST /register` - Register a new user
- `POST /login` - Login user
- `POST /logout` - Logout user

### Project Routes

Base path: `/api/v1/projects`

- `GET /:projectId` - Get a project
- `POST /` - Create a project
- `PUT /:projectId` - Update a project
- `DELETE /:projectId` - Delete a project
- `POST /:projectId/members` - Add or update a member in a project
- `GET /:projectId/members` - Get project members
- `PUT /:projectId/members/:userId` - Update member role
- `DELETE /:projectId/members/:userId` - Remove member from project

### Task Routes

Base path: `/api/v1`

- `GET /projects/:projectId/tasks` - Get tasks for a project
- `POST /projects/:projectId/tasks` - Create a task
- `PUT /tasks/:taskId` - Update a task
- `DELETE /tasks/:taskId` - Delete a task
- `GET /tasks/:taskId/subtasks` - Get subtasks
- `POST /tasks/:taskId/subtasks` - Create a subtask
- `PUT /subtasks/:subtaskId` - Update a subtask
- `DELETE /subtasks/:subtaskId` - Delete a subtask

## Authentication

Protected routes use the `verifyJWT` middleware from [`src/middlewares/auth.middleware.js`](/home/i-m-shailesh/Desktop/temp/src/middlewares/auth.middleware.js).

The API accepts the access token through either:

- An `accessToken` cookie
- An `Authorization: Bearer <token>` header

## Roles

The current project defines these roles in [`src/utils/constants.js`]

- `admin`
