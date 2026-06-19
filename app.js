const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

// ルーティングの設定
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const apiRoutes = require('./routes/api');
app.use('/auth', authRoutes);
app.use('/items', itemRoutes);
app.use('/api', apiRoutes);

// UI（index.jsにあったやつ）テストコード
app.get('/', (req, res) => {
  res.send(`
    <h1>APIテスト</h1>
    <button onclick="callApi()">API呼び出し</button>
    <pre id="result"></pre>

    <script>
      async function callApi() {
        const res = await fetch('/api/hello');
        const data = await res.json();
        document.getElementById('result').innerText = JSON.stringify(data, null, 2);
      }
    </script>
  `);
});

// 起動
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
