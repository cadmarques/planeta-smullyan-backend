// backend/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Importar as rotas
const testDocRoutes = require('./routes/testDocRoutes');
const islandRoutes = require('./routes/islandRoutes');
const puzzleRoutes = require('./routes/puzzleRoutes'); // Adicionamos as rotas dos puzzles

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar o aplicativo Express
const app = express();
const PORT = process.env.PORT || 5000;

console.log('MONGO_URI:', process.env.MONGO_URI);

// Middleware
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Rotas
app.get('/', (req, res) => {
  res.send('Welcome to the Planeta Smullyan API!');
});

// Usar as rotas
app.use('/api', testDocRoutes);
app.use('/api/islands', islandRoutes);
app.use('/api/puzzles', puzzleRoutes); // Adicionamos as rotas dos puzzles

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});