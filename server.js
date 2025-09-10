// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Importar as rotas
const testDocRoutes = require('./routes/testDocRoutes'); // teste de docs
const islandRoutes = require('./routes/islandRoutes');  // Rotas das ilhas/terras
const puzzleRoutes = require('./routes/puzzleRoutes');  // Rotas dos puzzles
const puzzleDetailsRoutes = require('./routes/puzzleDetailsRoutes'); // Rotas de PuzzleDetails
const testRoutes = require('./routes/testRoutes'); // teste de imagens
const imageRoutes = require('./routes/imageRoutes');  // Rotas das imagens
const authRoutes = require('./routes/auth'); // Rota de registo de utilizador


// Para servir arquivos estáticos
const path = require('path');

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar o aplicativo Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://127.0.0.1:3000', // Substituir pela URL do frontend, se necessário
  origin: 'http://localhost:3000', // Substituir pela URL do frontend, se necessário
  origin: 'https://cadmarques.github.io',
}));
app.use(express.json()); // Permite que o servidor interprete JSON

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Erro ao conectar ao MongoDB:', err));

// Rotas
app.get('/', (req, res) => {
  res.send('Welcome to the Planeta Smullyan API!');
});

// Usar as rotas
app.use('/api', testDocRoutes); // Rota de testes
app.use('/api/islands', islandRoutes); // Rotas das ilhas
app.use('/api/puzzles', puzzleRoutes); // Rotas dos puzzles
app.use('/api/puzzle-details', puzzleDetailsRoutes); // Rotas dos detalhes dos puzzles
app.use('/api/test', testRoutes); // Usa as rotas de teste de imagens
app.use('/api/images', imageRoutes);
app.use('/api', authRoutes);  // Usa as rotas de autenticação com prefixo /api

// Rota de teste para verificar logs
app.get('/test', (req, res) => {
  console.log('Rota /test chamada');
  res.send('Backend funcionando!');
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`);
});