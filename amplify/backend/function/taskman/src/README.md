# Task Manager API

This is a Task Management System API built with Node.js, Express, and MongoDB.

## Table of Contents
- [Routes](#routes)
  - [Auth Routes](#auth-routes)
  - [Task Routes](#task-routes)
  - [Notification Routes](#notification-routes)
- [Setup](#setup)
- [Testing](#testing)

## Routes

### Auth Routes

#### Register a User
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "msg": "User registered successfully",
    "success": true
  }
  ```

#### Login a User
- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "data": {
      "token": "string"
    },
    "msg": "Login successful",
    "success": true
  }
  ```

### Task Routes

#### Create a Task
- **URL**: `/api/tasks`
- **Method**: `POST`
- **Payload**:
  ```json
  {
    "title": "string",
    "description": "string",
    "dueDate": "date",
    "priority": "Low | Medium | High",
    "assignedTo": "ObjectId (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "data": {
      "task": "object"
    },
    "msg": "Task created successfully",
    "success": true
  }
  ```

#### Get All Tasks
- **URL**: `/api/tasks`
- **Method**: `GET`
- **Query Parameters** (optional):
  - `search`: Search by title or description
  - `status`: Filter by status (`Pending | In Progress | Completed`)
  - `priority`: Filter by priority (`Low | Medium | High`)
  - `dueDate`: Filter by due date (ISO date string)
- **Response**:
  ```json
  {
    "data": [
      "tasks"
    ],
    "success": true
  }
  ```

#### Update a Task
- **URL**: `/api/tasks/:id`
- **Method**: `PUT`
- **Payload**:
  ```json
  {
    "title": "string (optional)",
    "description": "string (optional)",
    "dueDate": "date (optional)",
    "priority": "Low | Medium | High (optional)",
    "status": "Pending | In Progress | Completed (optional)"
  }
  ```
- **Response**:
  ```json
  {
    "data": {
      "task": "object"
    },
    "msg": "Task updated successfully",
    "success": true
  }
  ```

#### Delete a Task
- **URL**: `/api/tasks/:id`
- **Method**: `DELETE`
- **Response**:
  ```json
  {
    "msg": "Task deleted successfully",
    "success": true
  }
  ```

#### Get Dashboard Data
- **URL**: `/api/tasks/dashboard`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "data": {
      "assignedTasks": ["tasks"],
      "createdTasks": ["tasks"],
      "overdueTasks": ["tasks"]
    },
    "success": true
  }
  ```

### Notification Routes

#### Get Notifications
- **URL**: `/api/notifications`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "data": [
      "notifications"
    ],
    "success": true
  }
  ```

## Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add the following:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm start
   ```

## Testing

Run the tests using Jest:
```bash
npm test
```