// backend/models/Puzzle.js
const mongoose = require('mongoose');

const puzzleSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Título do puzzle
  description: { type: String, required: true }, // Descrição do puzzle
  banner: { type: String, required: false }, // URL da imagem do banner
  icon: { type: String, required: false }, // URL do ícone do puzzle
  island: {
    type: mongoose.Schema.Types.ObjectId, // Referência à ilha à qual o puzzle pertence
    ref: 'Island',
    required: true,
  },
});

module.exports = mongoose.model('Puzzle', puzzleSchema);