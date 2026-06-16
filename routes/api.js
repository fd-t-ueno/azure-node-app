const express = require('express');
const router = express.Router();

// GET /api/hello
router.get('/hello', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: 'Hello API!',
      status: 'ok'
    }
  });
});

// GET /api/greet?name=Ueno
router.get('/greet', (req, res) => {
  const name = req.query.name || 'Guest';

  res.status(200).json({
    success: true,
    data: {
      message: `Hello, ${name}`,
    }
  });
});

// POST /api/greet
router.post('/greet', (req, res) => {
  const name = req.body.name || 'Guest';

  res.status(200).json({
    success: true,
    data: {
      message: `Hello, ${name}`,
    }
  });
});


// 簡易CRUD(Create, Read, Delete)サンプル
let users = [];
let nextId = 1;

// POST /api/users
// ユーザーを追加する
router.post('/users', (req, res) => {
  const name = req.body.name;
  
  if(!name) {
    return res.status(400).json({
      success: false,
      message: 'Name is required'
    });
  }

  const user = { id: nextId++, name };
  users.push(user);

  res.status(201).json({
    success: true,
    data: users
  });
});

// GET /api/users
// ユーザーの一覧を取得する
router.get('/users', (req, res) => {
  res.status(200).json({
    success: true,
    data: users
  });
});

// GET /api/users/:id
// ユーザーの詳細を取得する
router.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if(Number.isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    });
  }

  const user = users.find(u => u.id === id);

  if(!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    data: user
  });
});


// PUT /api/users/:id
// ユーザーの名前を更新する
router.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const name = req.body.name;

  if(Number.isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    });
  }

  if(!name) {
    return res.status(400).json({
      success: false,
      message: 'Name is required'
    });
  }

  const user = users.find(u => u.id === id);

  if(!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  user.name = name;

  res.status(200).json({
    success: true,
    data: user
  });
});

// DELETE /api/users/:id
// ユーザーを削除する
router.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);

  if(Number.isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid user ID'
    });
  }

  const index = users.findIndex(u => u.id === id);

  if(index === -1) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const deletedUser = users[index];
  users.splice(index, 1);

  res.status(200).json({
    success: true,
    data: deletedUser
  });
});

module.exports = router;
