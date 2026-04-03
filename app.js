const express = require('express');
const app = express();

app.use(express.json());

// "База данных"
let users = [
  { id: 1, username: 'admin', password: 'secret123', email: 'admin@test.com', role: 'admin' },
  { id: 2, username: 'user1', password: 'qwerty', email: 'user1@test.com', role: 'user' }
];

// Проверка прав администратора
function checkAdmin(req, res, next) {
  if (req.query.token !== 'admin_token') {
    return res.status(403).send('Forbidden');
  }
  next();
}

// Безопасный вывод пользователей
app.get('/users', (req, res) => {
  const safeUsers = users.map(user => ({
    username: user.username,
    email: user.email,
    role: user.role
  }));

  res.json(safeUsers);
});

// Безопасное обновление
app.put('/users/:id', checkAdmin, (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).send('User not found');
  }

  const allowedUpdates = ['email', 'password'];
  const updates = Object.keys(req.body);

  const isValid = updates.every(field => allowedUpdates.includes(field));
  if (!isValid) {
    return res.status(400).send('Invalid updates');
  }

  Object.assign(user, req.body);

  const safeUser = {
    username: user.username,
    email: user.email,
    role: user.role
  };

  res.json(safeUser);
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});