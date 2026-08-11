
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index', { title: 'Página Inicial' });
});

app.listen(port, host, () => {
  console.log(`Servidor iniciado em http://${host}:${port}`);
});
