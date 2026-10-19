
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

let tasks = [];

app.get('/', (req, res) => {
    const taskList = tasks.map((task, index) => `
        <li class="task">
            <span>${task}</span>
            <form action="/delete/${index}" method="POST">
                <button class="delete-btn" type="submit">
                    Delete
                </button>
            </form>
        </li>
    `).join('');

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport"
                  content="width=device-width, initial-scale=1.0">
            <title>My To-Do App</title>
            <link rel="stylesheet" href="/style.css">
        </head>
        <body>
            <main class="container">
                <h1>My To-Do App</h1>

                <form action="/add" method="POST" class="form">
                    <input
                        type="text"
                        name="task"
                        placeholder="What needs to be done?"
                        required
                        maxlength="200"
                    >
                    <button type="submit">Add Task</button>
                </form>

                <ul class="tasks">
                    ${taskList || '<li class="empty">No tasks yet. Add one!</li>'}
                </ul>

                <p class="footer">
                    ${tasks.length} task${tasks.length === 1 ? '' : 's'} • Keep going!
                </p>
            </main>
        </body>
        </html>
    `);
});

app.post('/add', (req, res) => {
    const task = req.body.task?.trim();

    if (task && task.length <= 200) {
        tasks.push(task);
    }

    res.redirect('/');
});

app.post('/delete/:index', (req, res) => {
    const index = Number(req.params.index);

    if (Number.isInteger(index) && index >= 0 && index < tasks.length) {
        tasks.splice(index, 1);
    }

    res.redirect('/');
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
