const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// ルーティングの設定
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
app.use('/auth', authRoutes);
app.use('/items', itemRoutes);

// 起動
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
