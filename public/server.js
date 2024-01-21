const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'tu_usuario_postgres',
  host: 'localhost',
  database: 'tu_base_de_datos',
  password: 'tu_contraseña',
  port: 5432,
});

app.use(express.static('public'));
app.use(express.json());

// Rutas y lógica de la aplicación aquí

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});


