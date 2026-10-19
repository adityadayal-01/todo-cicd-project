
const { test } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../app');

test('To-Do app can display, add, and delete tasks', async () => {
    // Check that the home page loads
    const home = await request(app).get('/');
    assert.equal(home.status, 200);
    assert.match(home.text, /My To-Do App/);

    // Add a task
    const added = await request(app)
        .post('/add')
        .type('form')
        .send({ task: 'Test my CI pipeline' });

    assert.equal(added.status, 302);

    // Confirm the task appears
    const updated = await request(app).get('/');
    assert.match(updated.text, /Test my CI pipeline/);

    // Delete the task
    const deleted = await request(app).post('/delete/0');
    assert.equal(deleted.status, 302);

    // Confirm the task is gone
    const finalPage = await request(app).get('/');
    assert.doesNotMatch(finalPage.text, /Test my CI pipeline/);
});
