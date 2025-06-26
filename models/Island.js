// backend/models/Island.js
const mongoose = require('mongoose');

const islandSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Nome da ilha
  description: { type: String, required: true }, // Descrição da ilha
  banner: { type: String, required: false }, // URL da imagem do banner
  icon: { type: String, required: false }, // URL do ícone da ilha
  boundaries: [
    {
      x: { type: Number, required: true }, // Coordenada X de um ponto limite
      y: { type: Number, required: true }, // Coordenada Y de um ponto limite
    },
  ],
  puzzles: [
    {
      type: mongoose.Schema.Types.ObjectId, // Referência aos puzzles associados
      ref: 'Puzzle',
    },
  ],
});

module.exports = mongoose.model('Island', islandSchema);