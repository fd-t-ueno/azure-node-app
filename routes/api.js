const express = require('express');
const router = express.Router();

router.get('/hello', (req, res) => {
  res.json({
    message: 'Hello API!',
    status: 'ok'
  });
});

router.get('/greet', (req, res) => {
  const name = req.query.name || 'Guest';

  res.json({
    message: `Hello, ${name}`
  });
});

router.post('/greet', (req, res) => {
  const name = req.body.name || 'Guest';

  res.json({
    message: `Hello, ${name}`
  });
});

module.exports = router;
