
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// POST受け取れるようにする
app.use(express.json());

const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);


app.get('/', (req, res) => {
  //res.send('Hello from Azure!');
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


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
