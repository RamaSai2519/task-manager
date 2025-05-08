const request = require('supertest');
const app = require('../src/server');

describe('Task Routes', () => {
    it('should create a task', async () => {
        const res = await request(app)
            .post('/api/tasks')
            .send({
                title: 'Test Task',
                description: 'This is a test task.',
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('task');
    });

    it('should fetch all tasks', async () => {
        const res = await request(app).get('/api/tasks');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('tasks');
    });
});