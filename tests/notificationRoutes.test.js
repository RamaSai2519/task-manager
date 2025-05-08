const request = require('supertest');
const app = require('../src/server');

describe('Notification Routes', () => {
    it('should fetch all notifications', async () => {
        const res = await request(app).get('/api/notifications');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('notifications');
    });

    it('should mark a notification as read', async () => {
        const res = await request(app)
            .patch('/api/notifications/1')
            .send({ read: true });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message', 'Notification marked as read');
    });
});